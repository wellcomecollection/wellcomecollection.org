import nunjucks from 'nunjucks';
import extensions from '../extensions';

export default function getEnv(root) {
  return nunjucks.configure(root);
}

export function addExtensions(env) {
  extensions.forEach((Extension, key) => env.addExtension(key, new Extension(env)));
  return env;
}

export function getEnvWithExtensions(root) {
  return addExtensions(getEnv(root));
}
