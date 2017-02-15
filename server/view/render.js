import {getEnvWithExtensionsAndFilters} from './env-utils';

export default function render(root) {
  return (ctx, next) => {
    const env = getEnvWithExtensionsAndFilters(root);
    ctx.render = (relPath, templateData) => ctx.body = env.render(`${relPath}.njk`, templateData);

    return next();
  }
}
