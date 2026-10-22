import { MOCK_APPROVALS } from '../../data/mock/approvals';
import { MOCK_TOP_CONTENT } from '../../data/mock/analytics';
import { MOCK_BRAND_RULES, MOCK_PERSONAS } from '../../data/mock/brand';
import { MOCK_SCHEDULED } from '../../data/mock/scheduled';

// TODO: replace with API calls.
export const CONTENT_IS_DEMO = true;

const MOCK_DELAY_MS = 300;

function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export async function listApprovals() {
  await delay();
  return MOCK_APPROVALS;
}

export async function listScheduled() {
  await delay();
  return MOCK_SCHEDULED;
}

export async function listTopContent() {
  await delay();
  return MOCK_TOP_CONTENT;
}

export async function listBrandRules() {
  await delay();
  return MOCK_BRAND_RULES;
}

export async function listPersonas() {
  await delay();
  return MOCK_PERSONAS;
}
