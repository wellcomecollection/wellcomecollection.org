import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import vm from 'vm';

// Compiles a CloudFront Function from cloudfront_functions/ with the settings
// the release uses, and runs the JavaScript in Node so the tests exercise what
// ships. The runtime's `cloudfront` and `crypto` imports become globals, and
// crypto is Node's own, which has the same createHash API.

export const functionsDir = path.resolve(__dirname, '../cloudfront_functions');

const compilerOptions = (() => {
  const configPath = path.join(functionsDir, 'tsconfig.json');
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(config, ts.sys, functionsDir).options;
})();

export type Kvs = { get: (key: string, options?: unknown) => Promise<unknown> };

export type Replacements = { version?: string; cookieDomain?: string };

export function compiledFunction(
  name: string,
  { version = 'test', cookieDomain = '' }: Replacements = {}
): string {
  const source = fs.readFileSync(
    path.join(functionsDir, `${name}.ts`),
    'utf-8'
  );
  return ts
    .transpileModule(source, { compilerOptions })
    .outputText.replace(/__VERSION__/g, version)
    .replace(/__COOKIE_DOMAIN__/g, cookieDomain);
}

export function loadFunction(
  name: string,
  { kvs, ...replacements }: Replacements & { kvs?: Kvs } = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (event: any) => any {
  const source = compiledFunction(name, replacements).replace(
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
