module.exports = function(api) {
  const presets = ['next/babel', '@babel/preset-flow'];
  const plugins = ['babel-plugin-styled-components'];
  api.cache(true);
  return {
    presets,
    plugins,
  };
};
