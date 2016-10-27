import 'views/component-templates';
import extensions from 'common/extensions';

const env = nunjucks.configure({autoescape: false});
extensions.forEach((extension, key) => env.addExtension(key, new extension(env)));

export default function render(templateName, context) {
  // TODO: potentially return DOM node
  return env.render(`${templateName}/index.njk`, context);
}
