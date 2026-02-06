const eslint = require("@eslint/js");
const eslintConfig = require("eslint/config");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const { includeIgnoreFile } = require("@eslint/compat");
const path = require("path");

const gitignorePath = path.resolve(__dirname, "..", ".gitignore");

function addTypeScriptLanguageOptions(config) {
  return {
    ...config,
    files: ["**/*.ts"],
    languageOptions: {
      ...config.languageOptions,
      globals: {
        ...config.languageOptions?.globals,
        ...globals.es2020,
        ...globals["shared-node-browser"],
        Buffer: "readonly"
      },
      parserOptions: {
        projectService: true
      },
      sourceType: "module"
    }
  };
}

const javascriptConfig = [
  eslint.configs.recommended,
  {
    name: "javascript/node-globals",
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.es2020,
        ...globals["shared-node-browser"],
        // This can be removed once we migrate fully to ESM
        ...globals.commonjs,
        Buffer: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["error", { caughtErrors: "none" }]
    }
  }
];

module.exports = eslintConfig.defineConfig(
  includeIgnoreFile(gitignorePath),
  javascriptConfig,
  tseslint.configs.recommendedTypeChecked.map(addTypeScriptLanguageOptions),
  addTypeScriptLanguageOptions({
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/prefer-promise-reject-errors": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      // See https://stackoverflow.com/questions/43353087/are-there-performance-concerns-with-return-await/70979225#70979225
      "@typescript-eslint/return-await": ["error", "always"],
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/sort-type-constituents": "error",
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      "no-return-await": "off"
    }
  })
);
