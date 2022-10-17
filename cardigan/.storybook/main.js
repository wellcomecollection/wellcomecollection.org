const path = require('path');
const { mergeConfig } = require('vite');

module.exports = {
  stories: [
    '../stories/global/**/*.stories.mdx',
    '../stories/global/**/*.stories.tsx',
    '../stories/components/**/*.stories.mdx',
    '../stories/components/**/*.stories.tsx',
    '../stories/docs/**/*.stories.mdx',
  ],
  addons: [
    '@storybook/addon-controls',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-backgrounds',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
      console.log({config});
    return mergeConfig(config, {
      // Use the same "resolve" configuration as your app
      // resolve: (await import('../vite.config.js')).default.resolve,
      // // Add dependencies to pre-optimization
      // optimizeDeps: {
      //   include: ['storybook-dark-mode'],
      // },
    });
  },
  // webpackFinal: async (config, { configType }) => {
  //   // Adds support for modules using mjs
  //   console.log({config});
  //   config.module.rules.push({
  //     test: /\.mjs$/,
  //     include: /node_modules/,
  //     type: "javascript/auto",
  //   });

  //   config.module.rules.push({
  //     test: /\.js$/,
  //     exclude: /node_modules/,
  //     include: [
  //       path.resolve(__dirname, '../../common'),
  //       path.resolve(__dirname, '../stories'),
  //       path.resolve(__dirname, '../../catalogue/webapp'),
  //     ],
  //     use: {
  //       loader: 'babel-loader',
  //       options: {
  //         presets: ['@babel/preset-flow', '@babel/preset-react'],
  //         plugins: [
  //           'babel-plugin-react-require',
  //           '@babel/plugin-proposal-class-properties',
  //           '@babel/plugin-proposal-optional-chaining',
  //           '@babel/plugin-syntax-dynamic-import',
  //         ],
  //       },
  //     },
  //   });

  //   return config;
  // },
};
