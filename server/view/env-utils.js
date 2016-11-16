import nunjucks from 'nunjucks';
import extensions from '../extensions';
import filters from '../filters';

export default function getEnv(root) {
  return nunjucks.configure(root);
}

export function addExtensions(env) {
  extensions.forEach((Extension, key) => env.addExtension(key, new Extension(env)));
  return env;
}

export function addFilters(env) {
  filters.forEach((filter, key) => env.addFilter(key, filter));
  return env;
}

export function getEnvWithExtensionsAndFilters(root) {
  return addFilters(addExtensions(getEnv(root)));
}
