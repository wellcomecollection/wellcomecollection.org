const path = require('path');
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
    '@storybook/addon-backgrounds',
    'storybook-addon-next-router',
     {
      name: "@storybook/addon-docs",
      options: { transcludeMarkdown: true },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    // Adds support for modules using mjs
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, '../../common'),
        path.resolve(__dirname, '../stories'),
        path.resolve(__dirname, '../../catalogue/webapp'),
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-flow', '@babel/preset-react'],
          plugins: [
            'babel-plugin-react-require',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-syntax-dynamic-import',
          ],
        },
      },
    });

    return config;
  },
};
