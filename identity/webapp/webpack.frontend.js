const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer({
  displayName: true,
});
const browserTargets = {
  edge: '17',
  firefox: '60',
  chrome: '67',
  safari: '11.1',
};

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : false,
  output: {
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
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              implementation: require('node-sass'),
              additionalData: '$is-next: true;',
              sassOptions: {
                includePaths: ['node_modules/@weco/common/styles'],
              },
            },
          },
        ],
      },
    ],
  },

  // Add problem packages to alias.
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  // We could use React from CDN.
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
