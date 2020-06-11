module.exports = function(api) {
  const presets = ['@babel/preset-flow', 'next/babel'];
  const plugins = [
    [
      'babel-plugin-styled-components',
      {
        ssr: true,
        displayName: true,
        preprocess: false,
      },
    ],
  ];

  return {
    presets,
    plugins,
  };
};
