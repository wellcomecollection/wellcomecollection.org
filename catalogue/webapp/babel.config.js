module.exports = function (api) {
  const presets = [
    '@babel/preset-flow',
    'next/babel'
  ];
  api.cache(true);
  return {
    presets
  };
};
