import { getSession } from '../services/auth/authService';

/**
 * The one HTTP entry point for feature APIs (starting with billing).
 *
 * Base URL is EXPO_PUBLIC_API_URL, the same value the auth adapter uses.
 * Errors are normalised into `ApiError` carrying the backend envelope
 * `{code, message, fields?}`, so screens branch on `code` instead of prose.
 */
const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
const TIMEOUT_MS = 15_000;

/** True when a backend is configured; false in mock/demo mode. */
export const HAS_API = !!BASE_URL;

export type ApiErrorCode =
  | 'NETWORK'
  | 'NOT_CONFIGURED'
  | 'UNAUTHENTICATED'
  | 'VALIDATION'
  | 'RATE_LIMITED'
  | 'PAYMENTS_NOT_CONFIGURED'
  | 'ALREADY_SUBSCRIBED'
  | 'NO_BILLING_ACCOUNT'
  | 'UNKNOWN'
  // Anything new the backend introduces still reaches the UI as a string.
  | (string & {});

export type ApiFieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  /** HTTP status, or 0 when the request never reached the server. */
  status: number;
  code: ApiErrorCode;
  fields?: ApiFieldErrors;

  constructor(
    status: number,
    code: ApiErrorCode,
    message: string,
    fields?: ApiFieldErrors
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
    // Required so `instanceof ApiError` survives transpilation.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Registered by AuthProvider: signs the user out and routes to /welcome.
 * Called once per failed request that proves the token is dead.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Send `Authorization: Token <key>`. Defaults to true. */
  auth?: boolean;
}

function parseFields(value: unknown): ApiFieldErrors | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const fields: ApiFieldErrors = {};
  Object.entries(value as Record<string, unknown>).forEach(([key, raw]) => {
    if (typeof raw === 'string') {
      fields[key] = [raw];
    } else if (Array.isArray(raw)) {
      const messages = raw.filter((item): item is string => typeof item === 'string');
      if (messages.length) fields[key] = messages;
    }
  });
  return Object.keys(fields).length ? fields : undefined;
}

async function readJson(response: Response): Promise<Record<string, unknown> | null> {
  if (response.status === 204) return null;
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Fetch a JSON resource.
 *
 * @returns the parsed body, or `undefined` for an empty 204 response.
 * @throws ApiError for every failure (never a raw fetch error).
 */
export async function apiFetch<T>(
  path: string,
  { method = 'GET', body, auth = true }: ApiFetchOptions = {}
): Promise<T> {
  if (!BASE_URL) {
    throw new ApiError(0, 'NOT_CONFIGURED', 'The API is not configured.');
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const session = await getSession();
    if (session?.token) headers.Authorization = `Token ${session.token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    // Abort (15s timeout), DNS failure, CORS rejection, offline.
    throw new ApiError(0, 'NETWORK', 'Network request failed.');
  } finally {
    clearTimeout(timer);
  }

  const payload = await readJson(response);

  if (response.ok) {
    return payload as T;
  }

  const bodyCode = typeof payload?.code === 'string' ? payload.code : '';
  const code: ApiErrorCode =
    response.status === 429
      ? 'RATE_LIMITED'
      : bodyCode ||
        (response.status === 401
          ? 'UNAUTHENTICATED'
          : response.status >= 500
            ? 'UNKNOWN'
            : 'VALIDATION');
  const message =
    typeof payload?.message === 'string' && payload.message
      ? payload.message
      : 'Something went wrong. Please try again.';

  if (auth && response.status === 401 && code === 'UNAUTHENTICATED') {
    unauthorizedHandler?.();
  }

  throw new ApiError(response.status, code, message, parseFields(payload?.fields));
}

/** True for the "server unreachable" and "not configured" cases. */
export function isOffline(error: unknown): boolean {
  return error instanceof ApiError && (error.code === 'NETWORK' || error.status === 0);
}
