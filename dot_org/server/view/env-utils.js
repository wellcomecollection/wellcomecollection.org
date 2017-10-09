import nunjucks from 'nunjucks';
import extensions from '../extensions';
import filters from '../filters';

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

export function getEnvWithGlobalsExtensionsAndFilters(root, globals) {
  return addFilters(
    addExtensions(
      addGlobals(getEnv(root), globals)
    )
  );
}
