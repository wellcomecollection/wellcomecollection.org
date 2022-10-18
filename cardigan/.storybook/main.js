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
    '@storybook/addon-backgrounds',
    {
      name: "@storybook/addon-docs",
      options: { transcludeMarkdown: true },
    },
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          stream: 'stream-browserify',
          process: 'process/browser',
          util: 'util/',
          events: 'events/',
          http: 'agent-base',
          https: 'agent-base',
        }
      },
    });
  },
};
