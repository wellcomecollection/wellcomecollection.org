import {Map} from 'immutable';
import {getEnvWithGlobalsExtensionsAndFilters} from './env-utils';
import markdown from 'nunjucks-markdown';
import marked from 'marked';

export default function render(root) {
  return (ctx, next) => {
    const globals = Map({
      featuresCohort: ctx.featuresCohort,
      featureFlags: ctx.intervalCache.get('flags')
    });

    const env = getEnvWithGlobalsExtensionsAndFilters(root, globals);
    ctx.render = (relPath, templateData) => ctx.body = env.render(`${relPath}.njk`, templateData);
    markdown.register(env, marked);
    return next();
  };
}
