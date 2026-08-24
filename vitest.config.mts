import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // "@test" must come first: Vite matches aliases in order and "@" would swallow it.
    alias: [
      { find: "@test", replacement: fileURLToPath(new URL("./test", import.meta.url)) },
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
    ],
  },
  test: {
    include: ["src/**/*.spec.ts", "test/**/*.spec.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
