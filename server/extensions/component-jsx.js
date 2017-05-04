import nunjucks from 'nunjucks';
import Inferno from 'inferno';
import InfernoServer from 'inferno-server';
import * as components from '../views/components/components';

export default class Component {
  constructor(env) {
    this.tags = ['componentJsx'];
    this.env = env;
  }

  parse(parser, nodes, /*lexer*/) {
    const token = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    return new nodes.CallExtension(this, 'run', args);
  };

  run(_/*context*/, name, model) {
    const html = InfernoServer.renderToString(components[name](model));
    return new nunjucks.runtime.SafeString(html);
  };
};
