import {Map} from 'immutable';
import {getEnvWithGlobalsExtensionsAndFilters} from './env-utils';
import markdown from 'nunjucks-markdown';
import marked from 'marked';

export default function render(root, extraGlobals) {
  return (ctx, next) => {
    const [flags, cohorts] = ctx.intervalCache.get('flags');
    const globals = Map(Object.assign({}, extraGlobals, {
      featuresCohort: ctx.featuresCohort,
      featureFlags: flags,
      cohorts: cohorts
    }));
    const env = getEnvWithGlobalsExtensionsAndFilters(root, globals);
    ctx.render = (relPath, templateData) => ctx.body = env.render(`${relPath}.njk`, templateData);
    markdown.register(env, marked);
    return next();
  };
}
