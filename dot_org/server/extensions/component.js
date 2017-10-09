import nunjucks from 'nunjucks';

export default class Component {
  constructor(env) {
    this.tags = ['component'];
    this.env = env;
  }

  parse(parser, nodes, lexer) {
    const token = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    return new nodes.CallExtension(this, 'run', args);
  };

  run(context, name, data) {
    const html = this.env.render(`components/${name}/${name}.njk`, data);
    return new nunjucks.runtime.SafeString(html);
  };
};
