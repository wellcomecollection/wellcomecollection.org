import nunjucks from 'nunjucks';

export default class Component {
  constructor(env) {
    this.tags = ['componentV2'];
    this.env = env;
  }

  parse(parser, nodes, /*lexer*/) {
    const token = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    return new nodes.CallExtension(this, 'run', args);
  };

  run(context, name, model, modifiers = [], data = {}) {
    const html = this.env.render(`components/${name}/index.njk`, {model, modifiers, data});
    return new nunjucks.runtime.SafeString(html);
  };
};
