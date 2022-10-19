module.exports = function (api) {
  const presets = ['next/babel'];
  api.cache(true);
  return {
    presets,
  };
};
