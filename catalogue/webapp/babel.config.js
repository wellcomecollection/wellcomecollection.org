module.exports = function (api) {
  const presets = [
    'next/babel',
    '@babel/preset-flow'
  ];
  api.cache(true);
  return {
    presets
  };
};
