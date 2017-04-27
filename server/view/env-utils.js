import nunjucks from 'nunjucks';
import extensions from '../extensions';
import filters from '../filters';
import {intervalCache} from '../cache/interval-cache';

export default function getEnv(root) {
  return nunjucks.configure(root);
}

export function addGlobals(env) {
  env.addGlobal('featureFlags', intervalCache.get('flags'));
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

export function getEnvWithGlobalsExtensionsAndFilters(root) {
  return addFilters(addExtensions(addGlobals(getEnv(root))));
}
