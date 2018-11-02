module.exports = function (api) {
  const presets = [
    '@babel/preset-flow',
    '@babel/env'
  ];
  const plugins = ['transform-react-jsx', '@babel/proposal-class-properties'];
  const ignore = [
    'node_modules',
    'views/partials/analytics.js.njk',
    'views/partials/hotjar.js.njk'
  ];
  api.cache(true);
  return {
    presets,
    plugins,
    ignore
  };
};
