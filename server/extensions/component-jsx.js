import nunjucks from 'nunjucks';
import ReactDOMServer from 'react-dom/server';
import * as components from '../../common/views/components/Index';

export default class Component {
  constructor(env) {
    this.tags = ['componentJsx'];
    this.env = env;
  }

  parse(parser, nodes /* lexer */) {
    const token = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    return new nodes.CallExtension(this, 'run', args);
  };

  run(_/* context */, name, model = {}, children = []) {
    const childrenComponents = children.map(c => components[c.name](c.model));
    const modelWithChildren = Object.assign({}, model, {children: childrenComponents});
    const html = ReactDOMServer.renderToString(components[name](modelWithChildren));
    return new nunjucks.runtime.SafeString(html);
  };
};
