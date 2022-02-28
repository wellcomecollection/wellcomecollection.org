module.exports = function(api) {
  const presets = ['next/babel'];
  const plugins = ['babel-plugin-styled-components'];
  api.cache(true);
  return {
    presets,
    plugins,
  };
};
