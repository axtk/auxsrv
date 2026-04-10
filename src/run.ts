#!/usr/bin/env node
import { getValues, isExplicitlyOff, isKey, Off, On, parseArgs } from "args-json";
import type { Config } from "./Config.ts";
import { serve } from "./serve.ts";

type CLIConfig = Omit<Config, "dirs" | "bundle" | "onRequest" | "spa" | "watch" | "log"> & {
  spa?: On | Off;
  watch?: On | Off;
  log?: On | Off;
};

async function run() {
  let args = process.argv.slice(2);
  let path: string | undefined;

  if (args.length !== 0 && !isKey(args[0])) path = args.shift();

  let { spa, watch, log, ...cliConfig } = parseArgs<CLIConfig>(args, {
    u: "url",
    s: "spa",
  });

  for (let cliKey of ["", "b", "bundle", "dirs"])
    delete cliConfig[cliKey as keyof typeof cliConfig];

  let dirs = getValues("--dirs");
  let bundleArgs = getValues(["--bundle", "-b"]);
  let bundleConfig: Config["bundle"];

  if (Array.isArray(bundleArgs)) {
    if (bundleArgs.length === 1 && isExplicitlyOff(bundleArgs[0])) bundleConfig = false;
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
    spa: !isExplicitlyOff(spa),
    watch: !isExplicitlyOff(watch),
    log: !isExplicitlyOff(log),
    ...cliConfig,
  };

  await serve(config);
}

run();
