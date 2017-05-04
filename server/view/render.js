import {getEnvWithGlobalsExtensionsAndFilters} from './env-utils';
import markdown from 'nunjucks-markdown';
import marked from 'marked';

export default function render(root) {
  return (ctx, next) => {
    const env = getEnvWithGlobalsExtensionsAndFilters(root);
    ctx.render = (relPath, templateData) => ctx.body = env.render(`${relPath}.njk`, templateData);
    markdown.register(env, marked);
    return next();
  };
}
