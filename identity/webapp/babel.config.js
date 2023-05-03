module.exports = function (api) {
  api.cache(true);

  const presets = ['@weco/common/babel'];

  const plugins = ['@babel/plugin-proposal-private-methods'];

  return {
    plugins,
    presets,
  };
};
