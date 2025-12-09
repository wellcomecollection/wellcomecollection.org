const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const jestPlugin = require('eslint-plugin-jest');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const jestPlaywrightPlugin = require('eslint-plugin-jest-playwright');
const localRulesPlugin = require('eslint-plugin-local-rules');
const babelParser = require('@babel/eslint-parser');

const sharedRules = {
  'eol-last': 'error',
  'import/order': [
    'warn',
    {
      groups: [
        ['builtin', 'external'],
        ['internal', 'sibling', 'parent', 'index'],
      ],
      pathGroups: [
        {
          pattern: '@weco/**',
          group: 'external',
          position: 'after',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin', 'object'],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
      'newlines-between': 'always',
    },
  ],
  'local-rules/data-component-declared': 'warn',
  'no-mixed-operators': 'warn',
  'no-multi-spaces': 'warn',
  'no-multi-str': 'off',
  'no-restricted-imports': [
    'error',
    { patterns: ['../*'] }, // Should only import relatively from same directory
  ],
  'no-restricted-syntax': [
    'error',
    "JSXElement.children > [expression.callee.property.name='stringify']",
  ],
  'no-return-assign': 'off',
  'prettier/prettier': 'error',
  'react/no-deprecated': 'error',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-curly-brace-presence': [
    'warn',
    { props: 'never', children: 'never', propElementValues: 'always' },
  ],
  'react-hooks/rules-of-hooks': 'error',
  'sort-imports': [
    'error',
    {
      ignoreCase: true,
      ignoreDeclarationSort: true,
    },
  ],
};

module.exports = [
  {
    ignores: [
      '**/node_modules/',
      '**/libs/',
      '**/_next/',
      '**/dist/',
      '.storybook/',
      '.stylelintrc.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
      globals: {
        // Node.js globals
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        // Browser globals
        console: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        // Jest globals
        afterAll: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        fit: 'readonly',
        it: 'readonly',
        jest: 'readonly',
        test: 'readonly',
        xdescribe: 'readonly',
        xit: 'readonly',
        xtest: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      jest: jestPlugin,
      prettier: prettierPlugin,
      'jest-playwright': jestPlaywrightPlugin,
      'local-rules': localRulesPlugin,
    },
    rules: {
      ...sharedRules,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'local-rules': './eslint-local-rules',
    },
  },
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        // Node.js globals
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        // Browser globals
        console: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        // Jest globals
        afterAll: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        fit: 'readonly',
        it: 'readonly',
        jest: 'readonly',
        test: 'readonly',
        xdescribe: 'readonly',
        xit: 'readonly',
        xtest: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      jest: jestPlugin,
      prettier: prettierPlugin,
      'jest-playwright': jestPlaywrightPlugin,
      'local-rules': localRulesPlugin,
    },
    rules: {
      ...sharedRules,
      'no-use-before-define': 'off',
      '@typescript-eslint/array-type': ['error'],
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
      'jest/no-standalone-expect': [
        'error',
        { additionalTestBlockFunctions: ['each.test'] },
      ],
      // This rule does not support FunctionComponent<Props> and so
      // makes using (eg) children props more of a pain than it should be
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'local-rules': './eslint-local-rules',
    },
  },
  // Some directories don't have an absolute import equivalent so ignoring
  // import rules for them.
  {
    files: ['dash/**'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  prettierConfig,
];
