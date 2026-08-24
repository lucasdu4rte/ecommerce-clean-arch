import { beforeEach } from "vitest";

const store = new Map<string, string>();

globalThis.localStorage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => void store.set(key, String(value)),
  removeItem: (key) => void store.delete(key),
  clear: () => store.clear(),
  key: (index) => Array.from(store.keys())[index] ?? null,
  get length() {
    return store.size;
  },
} as Storage;

beforeEach(() => localStorage.clear());
