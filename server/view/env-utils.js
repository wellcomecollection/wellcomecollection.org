import nunjucks from 'nunjucks';
import extensions from '../extensions';
import filters from '../filters';
import path from 'path';

export default function getEnv(root) {
  return nunjucks.configure(root);
}

export function addGlobals(env, globals) {
  globals.forEach((v, k) => env.addGlobal(k, v));
  return env;
}

export function addExtensions(env) {
  extensions.forEach((Extension, key) => env.addExtension(key, new Extension(env)));
  return env;
}

export function addFilters(env) {
  filters.forEach((filter, key) => env.addFilter(key, filter));
  return env;
}

export function getEnvWithGlobalsExtensionsAndFilters(roots, globals) {
  const env = getEnv(roots);
  return addFilters(
    addExtensions(
      addGlobals(env, globals)
    )
  );
}
