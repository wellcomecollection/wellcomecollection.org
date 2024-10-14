import { dirname, join } from 'path';

const path = require('path');
module.exports = {
  staticDirs: ['../public'],
  stories: [
    '../stories/global/**/*.mdx',
    '../stories/global/**/*.stories.tsx',
    '../stories/components/**/*.stories.tsx',
  ],
  docs: {
    defaultName: 'Overview',
  },

  addons: [
    getAbsolutePath('@storybook/addon-controls'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-backgrounds'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('storybook-addon-mock'),
  ],

  webpackFinal: async (config, { configType }) => {
    // Adds support for modules using mjs
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, '../../common'),
        path.resolve(__dirname, '../stories'),
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-flow', '@babel/preset-react'],
          plugins: [
            'babel-plugin-react-require',
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-optional-chaining',
            '@babel/plugin-syntax-dynamic-import',
          ],
        },
      },
    });

    config.resolve.fallback = {
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      fs: require.resolve('browserify-fs'),
      zlib: require.resolve('browserify-zlib'),
    };

    return config;
  },

  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
