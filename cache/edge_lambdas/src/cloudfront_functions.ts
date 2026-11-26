import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

// Loads a CloudFront Function from cache/cloudfront_functions so it can be
// tested in Node. The runtime's `cloudfront` and `crypto` imports become
// globals: crypto is Node's, which has the same createHash API.

export const functionsDir = path.resolve(
  __dirname,
  '../../cloudfront_functions'
);

export type Kvs = { get: (key: string, options?: unknown) => Promise<unknown> };

export type Replacements = { version?: string; cookieDomain?: string };

export function functionSource(
  name: string,
  { version = 'test', cookieDomain = '' }: Replacements = {}
): string {
  return fs
    .readFileSync(path.join(functionsDir, name), 'utf-8')
    .replace(/__VERSION__/g, version)
    .replace(/__COOKIE_DOMAIN__/g, cookieDomain);
}

export function loadFunction(
  name: string,
  { kvs, ...replacements }: Replacements & { kvs?: Kvs } = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (event: any) => any {
  const source = functionSource(name, replacements).replace(
    /^import .*;$/gm,
    ''
  );
  const context = vm.createContext({
    cf: { kvs: () => kvs },
    crypto,
  });
  vm.runInContext(source, context);
  return context.handler;
}
