export type BundleConfig = {
  /**
   * Output directory path relative to the server config `path`.
   *
   * @default "dist"
   */
  dir?: string | undefined;
  /**
   * Input path relative to the server config `path`.
   *
   * By default, the first of `["index.ts", "index.tsx", "src/index.ts", "src/index.tsx"]`
   * that exists.
   */
  input?: string | undefined;
  /**
   * Output path relative to the bundle config `dir`.
   *
   * @default "index.js"
   */
  output?: string | undefined;
  /**
   * Packages excluded from the bundle.
   */
  external?: string[];
};
