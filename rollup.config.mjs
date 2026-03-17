import fs from "node:fs";
import path from "node:path";
import { builtinModules } from "node:module";
import { fileURLToPath } from "node:url";

import commonjs from "@rollup/plugin-commonjs";
import inject from "@rollup/plugin-inject";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import esbuild from "rollup-plugin-esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
);

const externalPackages = new Set([
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
]);

const builtinPackageIds = new Set([
  ...builtinModules,
  ...builtinModules.map((moduleId) => `node:${moduleId}`),
]);

function isExternalDependency(id) {
  if (builtinPackageIds.has(id)) {
    return true;
  }

  for (const dependencyName of externalPackages) {
    if (id === dependencyName || id.startsWith(`${dependencyName}/`)) {
      return true;
    }
  }

  return false;
}

function resolveJsSourceSpecifier() {
  return {
    name: "resolve-js-source-specifier",
    resolveId(source, importer) {
      if (!importer || !source.startsWith(".") || !source.endsWith(".js")) {
        return null;
      }

      const resolvedSourcePath = path.resolve(path.dirname(importer), source);
      const sourceCandidates = [
        resolvedSourcePath,
        resolvedSourcePath.slice(0, -3) + ".ts",
      ];

      for (const candidatePath of sourceCandidates) {
        if (fs.existsSync(candidatePath)) {
          return candidatePath;
        }
      }

      return null;
    },
  };
}

function createOutput(dir, format) {
  return {
    dir,
    format,
    exports: "named",
    interop: format === "cjs" ? "auto" : undefined,
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true,
    entryFileNames: format === "esm" ? "[name].mjs" : "[name].js",
  };
}

const sharedPlugins = [
  resolveJsSourceSpecifier(),
  esbuild({
    sourceMap: true,
    target: "es2022",
    tsconfig: "tsconfig.base.json",
    loaders: {
      ".js": "js",
      ".ts": "ts",
    },
  }),
  inject({
    Buffer: ["buffer", "Buffer"],
  }),
];

/** Library build — preserves modules, externalizes dependencies. */
const libConfig = {
  input: "src/index.ts",
  external: isExternalDependency,
  plugins: sharedPlugins,
  output: [createOutput("lib/esm", "esm"), createOutput("lib/cjs", "cjs")],
};

/** Bundled dist build — single file with all dependencies included.
 * Note: These builds are intended for direct use in browsers or via CDNs.
 */
const distConfig = {
  input: "src/index.ts",
  plugins: [
    resolveJsSourceSpecifier(),
    resolve({ browser: true, preferBuiltins: false }),
    commonjs(),
    esbuild({
      sourceMap: true,
      target: "es2022",
      tsconfig: "tsconfig.base.json",
      loaders: {
        ".js": "js",
        ".ts": "ts",
      },
      minify: false,
    }),
    inject({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  output: [
    {
      file: "dist/stellar-base.js",
      format: "umd",
      name: "StellarBase",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/stellar-base.min.js",
      format: "umd",
      name: "StellarBase",
      exports: "named",
      sourcemap: true,
      plugins: [
        terser({
          format: { ascii_only: true },
        }),
      ],
    },
    {
      file: "dist/stellar-base.esm.mjs",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/stellar-base.cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
  ],
};

export default [libConfig, distConfig];
