module.exports = function (api) {
  api.cache(true);

  const presets = ['@weco/common/babel'];

  // see https://www.npmjs.com/package/babel-plugin-superjson-next
  // why do we need this?
  const plugins = ['superjson-next'];

  return {
    presets,
    plugins,
  };
};
