module.exports = function(env) {
  const ComponentTag = function() {
    this.tags = ['component'];
    this.parse = function(parser, nodes, lexer) {
        var token = parser.nextToken();

        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);

        return new nodes.CallExtension(this, 'run', args);
    };
    this.run = function(context, name, data) {
        return nunjucks.render('components/' + name + '/' + name + '.html', data);
    };
  };
  env.addExtension('component', ComponentTag);


  const template = `{% component 'name', {title: 'Example', subtitle: 'An example component'} %}`;

  return env;
}
