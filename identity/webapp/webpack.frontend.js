const webpack = require('webpack');
const createStyledComponentsTransformer =
  require('typescript-plugin-styled-components').default;
const Dotenv = require('dotenv-webpack');
const styledComponentsTransformer = createStyledComponentsTransformer({
  displayName: true,
});
const browserTargets = {
  edge: '17',
  firefox: '60',
  chrome: '67',
  safari: '11.1',
};
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : false,
  entry: './src/frontend/index.tsx',
  output: {
    path: path.join(__dirname, '/lib/frontend/build'),
    // Will be available on the router at `/assets/bundle.js`
    filename: 'bundle.js',
    pathinfo: false,
    publicPath: `/assets/`,
  },
  module: {
    rules: [
      // Load and convert typescript to javascript
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules\/(?!@weco).*/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              configFile: 'tsconfig.frontend.json',
              transpileOnly: true,
              experimentalWatchApi: true,
              getCustomTransformers: () => ({
                before: [styledComponentsTransformer],
              }),
            },
          },
        ],
      },
      // Pass javascript through babel with preset env to target browsers.
      {
        test: /\.(js)$/,
        exclude: /node_modules\/(?!@weco).*/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'babel-plugin-styled-components',
                'babel-plugin-transform-typescript-metadata',
                ['@babel/plugin-proposal-decorators', { legacy: true }],
              ],
              presets: [
                '@babel/preset-flow',
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  {
                    targets: browserTargets,
                    modules: 'commonjs',
                    useBuiltIns: 'usage',
                    corejs: 3,
                  },
                ],
              ],
            },
          },
        ],
      },
      // Pass through style loader.
      {
        test: /\.s?[ac]ss$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
        ],
      },
    ],
  },

  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    // Components in @weco/common do not necessarily import React, as
    // doing so is not required in Next.js projects. Providing it here
    // fixes that without having to load an additional copy of React from
    // a CDN
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  ],

  // Add problem packages to alias.
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};
