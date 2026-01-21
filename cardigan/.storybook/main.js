import { createRequire } from 'module';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

const monorepoRoot = resolve(__dirname, '../..');

const config = {
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
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/nextjs-vite'),
    options: {},
  },

  viteFinal: async config => {
    // Add aliases for monorepo packages
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Prismic packages
      '@prismicio/react': resolve(
        monorepoRoot,
        'node_modules/@prismicio/react'
      ),
      '@prismicio/client': resolve(
        monorepoRoot,
        'node_modules/@prismicio/client'
      ),
      // Next.js - ensure it resolves from root node_modules
      'next/router': resolve(monorepoRoot, 'node_modules/next/router.js'),
      'next/navigation': resolve(
        monorepoRoot,
        'node_modules/next/navigation.js'
      ),
      'next/image': resolve(monorepoRoot, 'node_modules/next/image.js'),
      'next/link': resolve(monorepoRoot, 'node_modules/next/link.js'),
      'next/head': resolve(monorepoRoot, 'node_modules/next/head.js'),
      'node-fetch': resolve(__dirname, './mocks/node-fetch.js'),
    };

    return config;
  },
};

export default config;
