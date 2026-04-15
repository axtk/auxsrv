import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { extname } from "node:path";
import { bundle } from "./bundle.ts";
import type { Config } from "./Config.ts";
import { getFilePath } from "./getFilePath.ts";
import { getTarget } from "./getTarget.ts";
import { mimeTypes } from "./mimeTypes.ts";

export type Server = ReturnType<typeof createServer>;

/**
 * Starts a static server as configured by the `config` parameter and
 * returns the `Server` object.
 *
 * Bundles the code before starting the server, if configured with
 * `config.bundle` to do so.
 */
export async function serve(config: Config = {}): Promise<Server> {
  let { debug, log } = config;

  if (debug) console.log(JSON.stringify(config, null, 2));

  let stop = await bundle(config);

  return new Promise<Server>((resolve) => {
    let server = createServer(async (req, res) => {
      await config.onRequest?.(req, res);

      if (res.headersSent) {
        if (debug)
          console.log(`\n${req.method} ${req.url}\nQuitting, headers sent`);

        return;
      }

      let filePath = await getFilePath(req.url, config);

      if (debug)
        console.log(
          `\n${req.method} ${req.url}\nFile: ${JSON.stringify(filePath)}`,
        );

      if (filePath === null) {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not found");
        return;
      }

      let ext = extname(filePath).slice(1).toLowerCase();
      let mimeType = mimeTypes[ext] ?? "application/octet-stream";

      res.writeHead(200, { "content-type": mimeType });
      createReadStream(filePath).pipe(res);
    });

    if (stop) {
      server.on("close", async () => {
        if (debug) console.log("Server closing");

        await stop();
      });
    }

    let { host, port } = getTarget(config);

    server.listen(port, host, () => {
      if (log || debug) console.log(`Server running at http://${host}:${port}`);

      resolve(server);
    });
  });
}
