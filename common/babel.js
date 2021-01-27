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
  const env = {
    test: {
      plugins: ['dynamic-import-node'],
    },
  };

  return {
    presets,
    plugins,
    env,
  };
};
