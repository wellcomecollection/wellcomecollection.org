'use strict';

const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'prettier/@typescript-eslint',
  ],

  plugins: ['@typescript-eslint', 'prettier', 'react-hooks', 'jest', 'react', 'json-format'],
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: {
    'react/prop-types': OFF,
    'import/named': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/camelcase': OFF,
    '@typescript-eslint/no-empty-interface': WARN,
    '@typescript-eslint/ban-ts-comment': WARN,
    'no-undef': OFF,
    'no-use-before-define': OFF,
    'react-hooks/rules-of-hooks': ERROR,
    'react-hooks/exhaustive-deps': WARN,
    'prettier/prettier': ERROR,
    'accessor-pairs': OFF,
    'brace-style': [ERROR, '1tbs'],
    'consistent-return': OFF,
    'dot-location': [ERROR, 'property'],
    'dot-notation': ERROR,
    'eol-last': ERROR,
    eqeqeq: [ERROR, 'allow-null'],
    indent: OFF,
    'jsx-quotes': [ERROR, 'prefer-double'],
    'keyword-spacing': [ERROR, { after: true, before: true }],
    'no-bitwise': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': ERROR,
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-shadow': ERROR,
    'no-unused-expressions': ERROR,
    'no-useless-concat': OFF,
    quotes: [ERROR, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
  },
};
