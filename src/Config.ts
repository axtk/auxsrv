import type { IncomingMessage, ServerResponse } from "node:http";
import type { BundleConfig } from "./BundleConfig.ts";

export type Config = {
  /** Server URL. */
  url?: string;
  /**
   * Server host.
   *
   * @defaultValue "localhost"
   */
  host?: string;
  /**
   * Server port.
   *
   * @defaultValue 3000
   */
  port?: number;
  /** Application path. */
  path?: string;
  /**
   * Public assets directories. If not provided, the application
   * `path` is served as a public assets directory.
   */
  dirs?: string[];
  /**
   * Enables single-page application (SPA) mode. If `true`, all
   * unmatched URLs are served as "/".
   *
   * @default true
   */
  spa?: boolean;
  /**
   * Whether to rebuild whenever the bundled files change.
   *
   * @default true
   */
  watch?: boolean;
  /** Whether the bundle should be minified. */
  minify?: boolean;
  /** Whether to log to the console. */
  log?: boolean;
  /**
   * Bundle config.
   *
   * If `undefined`, bundling is skipped.
   * Otherwise, its type is `BundleConfig`, with the following shorthand options:
   * If `true`, it's equivalent to `{ input: "index.ts", output: "index.js" }`.
   * If `string`, it's equivalent to `input` in `{ input, ouput: "index.js" }`.
   */
  bundle?: boolean | string | BundleConfig | undefined;
  /**
   * Whether to run the initialization (i.e. bundling if it's present) without
   * starting the server and without enabling the watch mode.
   */
  init?: boolean;
  /** Custom request handler. */
  onRequest?: (
    req?: IncomingMessage,
    res?: ServerResponse<IncomingMessage>,
  ) => void | Promise<void>;
  /** Turns on debug logging. */
  debug?: boolean | undefined;
};
