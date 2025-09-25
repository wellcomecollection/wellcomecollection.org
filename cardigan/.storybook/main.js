import { dirname, join } from 'path';

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
    getAbsolutePath('@storybook/addon-links'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}
