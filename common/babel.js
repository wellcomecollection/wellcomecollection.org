module.exports = function () {
  const presets = ['next/babel'];
  const plugins = [
    [
      'babel-plugin-styled-components',
      {
        ssr: true,
        displayName: true,
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
