#!/usr/bin/env node
import { getValues, isKey, parseArgs } from "args-json";
import type { Config } from "./Config.ts";
import { serve } from "./serve.ts";

type CLIConfig = Omit<Config, "dirs" | "bundle" | "onRequest">;

async function run() {
  let args = process.argv.slice(2);
  let path: string | undefined;

  if (!isKey(args[0])) path = args.shift();

  let cliConfig = parseArgs<CLIConfig>(args, {
    u: "url",
    s: "spa",
  });

  for (let cliKey of ["", "b", "bundle", "dirs"])
    delete cliConfig[cliKey as keyof CLIConfig];

  let dirs = getValues("--dirs");
  let bundleArgs = getValues(["--bundle", "-b"]);
  let bundleConfig: Config["bundle"];

  if (Array.isArray(bundleArgs)) {
    if (bundleArgs.length === 1 && bundleArgs[0] === "false")
      bundleConfig = false;
    else
      bundleConfig = {
        input: bundleArgs[0],
        dir: bundleArgs[1],
        output: bundleArgs[2],
      };
  }

  let config: Config = {
    path,
    dirs,
    bundle: bundleConfig,
    watch: true,
    log: true,
    ...cliConfig,
  };

  await serve(config);
}

run();
