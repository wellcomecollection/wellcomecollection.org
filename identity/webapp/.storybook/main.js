const webpack = require('webpack');

module.exports = {
  "stories": [
    "../src/stories/**/*.stories.mdx",
    "../src/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-actions",
    "@storybook/addon-essentials",
    '@storybook/addon-knobs',
    '@storybook/addon-a11y'
  ],
  webpackFinal: async (config, { configType }) => {

    config.module.rules[0].exclude = /node_modules\/(?!@weco).*/;

    config.plugins.push(
        new webpack.ProvidePlugin({
          "React": "react",
        })
    );

    return config;
  }
}
