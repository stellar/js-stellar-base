import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const include = ["test/**/*.test.ts"];
const exclude = ["node_modules", "dist", "lib"];

export default defineConfig({
  test: {
    exclude,
    projects: [
      {
        test: {
          name: "node",
          include,
          environment: "node"
        }
      },
      {
        test: {
          name: "browser",
          include,
          setupFiles: ["./test/setup/browser.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }]
          }
        }
      }
    ]
  }
});
