import nunjucks from 'nunjucks';
import parse from 'parse5';

export default class Icon {
  constructor(env) {
    this.tags = ['icon'];
    this.env = env;
  }

  parse(parser, nodes, lexer) {
    const token = parser.nextToken();
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    return new nodes.CallExtension(this, 'run', args);
  };

  run(context, name, title) {
    const svgHtml = this.env.render(`icons/${name}.svg`);
    const frag = parse.parseFragment(svgHtml);
    const svgFrag = frag.childNodes[0];

    const attrs = svgFrag.attrs;
    const pathData = parse.serialize(svgFrag);

    const html = this.env.render(`components/icon/index.njk`, {
      title, pathData, attrs
    });

    return new nunjucks.runtime.SafeString(html);
  };
};
