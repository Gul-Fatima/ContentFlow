import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Two storage layers:
 *  - secure* : expo-secure-store (Keychain / Keystore) for auth tokens. On web
 *    there is no secure store, so we fall back to localStorage (best effort —
 *    a browser tab is not a trusted keystore, see docs/AUTH_CONTRACT.md).
 *  - kv*     : AsyncStorage with JSON (de)serialization for non-secret app data.
 */
const isWeb = Platform.OS === 'web';

export async function secureGet(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function secureSet(key: string, value: string): Promise<void> {
  if (isWeb) {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      // Private mode / storage disabled: session stays in memory only.
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function secureRemove(key: string): Promise<void> {
  if (isWeb) {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      // Nothing to clean up if storage was unavailable.
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw == null) return null;
  return JSON.parse(raw) as T;
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function kvRemove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
