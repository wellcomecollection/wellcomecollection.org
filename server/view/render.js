import {getEnvWithExtensionsAndFilters} from './env-utils';

export default function render(root) {
  return (ctx, next) => {
    const env = getEnvWithExtensionsAndFilters(root);

    ctx.render = (relPath, templateData) => {
      return new Promise((resolve, reject) => {
        env.render(`${relPath}.njk`, templateData, (err, res) => {
          if (err) {
            reject(err);
          } else {
            ctx.body = res;
            resolve(res);
          }
        });
      });
    };
    return next();
  }
}
