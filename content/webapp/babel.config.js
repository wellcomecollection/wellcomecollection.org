module.exports = function (api) {
  api.cache(true);

  const presets = [
    'next/babel',
    '@babel/preset-flow'
  ];
  const plugins = [
    [
      'babel-plugin-styled-components',
      {
        ssr: true,
        displayName: true,
        preprocess: false
      }
    ]
  ];

  return {
    presets,
    plugins
  };
};
