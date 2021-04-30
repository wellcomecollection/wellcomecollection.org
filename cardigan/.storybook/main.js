const path = require('path');
module.exports = {
  stories: [
    '../stories/components/**/*.tsx',
    '../stories/components/*.js',
    '../stories/global/**/*.js',
    '../stories/docs/*.js',
  ],
  addons: [
    'storybook-readme',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
  ],
  webpackFinal: async (config, { configType }) => {
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

    config.module.rules.push({
      test: /\.scss$/,
      include: [path.resolve(__dirname, '../../common/styles')],
      use: [
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              path: path.resolve(__dirname, '../'),
            },
          },
        },
        'sass-loader',
      ],
    });
    return config;
  },
};
