import { join } from "node:path";
import type { Config } from "./Config.ts";
import { getRootPath } from "./getRootPath.ts";
import { isValidFilePath } from "./isValidFilePath.ts";

/**
 * Resolves with a file path, or `null` if `url` doesn't point to
 * a valid file path.
 */
export async function getFilePath(url = "", config: Config) {
  let { debug, dirs = [], spa = true } = config;

  let rootPath = getRootPath(config);
  let urlPath = url.replace(/[?#].*$/, "");

  if (debug) {
    console.log(`Root path: ${JSON.stringify(rootPath)}`);
    console.log(`URL path: ${JSON.stringify(urlPath)}`);
  }

  for (let dir of dirs.length === 0 ? [""] : dirs) {
    let dirPath = join(rootPath, dir);
    let filePath = join(dirPath, urlPath);

    if (!urlPath.endsWith("/") && (await isValidFilePath(filePath, dirPath)))
      return filePath;

    filePath = join(dirPath, urlPath, "index.html");

    if (await isValidFilePath(filePath, dirPath)) return filePath;

    if (spa) {
      filePath = join(dirPath, "index.html");

      if (await isValidFilePath(filePath, dirPath)) return filePath;
    }

    if (debug) {
      console.log(`Dir path: ${JSON.stringify(dirPath)}`);
      console.log(`Invalid file path: ${JSON.stringify(filePath)}`);
    }
  }

  return null;
}
