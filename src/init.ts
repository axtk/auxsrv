import { access, rm } from "node:fs/promises";
import { join } from "node:path";
import { type BuildOptions, build, context } from "esbuild";
import type { BundleConfig } from "./BundleConfig.ts";
import type { Config } from "./Config.ts";
import { getRootPath } from "./getRootPath.ts";

const possibleInputFiles = [
  "index.ts",
  "index.tsx",
  "src/index.ts",
  "src/index.tsx",
];

export async function init(config: Config = {}) {
  if (config.bundle === false) return;

  let { bundle: options, init, minify, watch } = config;

  let normalizedOptions: BundleConfig = {};
  let rootPath = getRootPath(config);

  if (typeof options === "string") normalizedOptions.input = options;
  else if (typeof options === "object") normalizedOptions = options;

  let dir = normalizedOptions.dir ?? "dist";
  let inputFile: string | null = null;

  if (normalizedOptions.input === undefined) {
    for (let path of possibleInputFiles) {
      let fullPath = join(rootPath, path);

      try {
        await access(fullPath);
        inputFile = fullPath;
        break;
      } catch {}
    }
  } else inputFile = join(rootPath, normalizedOptions.input);

  if (inputFile === null) return;

  await rm(join(rootPath, dir), { recursive: true, force: true });

  let buildOptions: BuildOptions = {
    entryPoints: [inputFile],
    bundle: true,
    format: "esm",
    platform: "browser",
    logLevel: "warning",
    minify,
  };

  if (normalizedOptions.output)
    buildOptions.outfile = join(rootPath, dir, normalizedOptions.output);
  else {
    buildOptions.outdir = join(rootPath, dir);
    buildOptions.splitting = true;
  }

  if (watch && !init) {
    let ctx = await context(buildOptions);

    await ctx.watch();

    return async () => {
      await ctx.dispose();
    };
  }

  await build(buildOptions);
}
