const sharedPlugins = [
  'import',
  'react',
  'react-hooks',
  'jest',
  'prettier',
  'standard',
];

const sharedExtends = [
  'standard',
  'plugin:react/recommended',
  'plugin:prettier/recommended',
  'plugin:jest-playwright/recommended',
  'prettier',
  'prettier/react',
  'prettier/standard',
];

const sharedRules = {
  'no-multi-spaces': 'off',
  'no-multi-str': 'off',
  'no-mixed-operators': 'off',
  'no-return-assign': 'off',
  'react/react-in-jsx-scope': 'off',
  'react-hooks/rules-of-hooks': 'error',
  'prettier/prettier': 'error',
  'no-restricted-syntax': [
    'error',
    "JSXElement.children > [expression.callee.property.name='stringify']",
  ],
};

module.exports = {
  parser: 'babel-eslint',
  plugins: [...sharedPlugins, 'flowtype'],
  env: {
    'jest/globals': true,
  },
  extends: [
    ...sharedExtends,
    'prettier/flowtype',
    'plugin:flowtype/recommended',
  ],
  rules: {
    ...sharedRules,
    'flowtype/no-types-missing-file-annotation': 'off',
    'flowtype/space-after-type-colon': [2, 'always', { allowLineBreak: true }],
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: [...sharedPlugins, '@typescript-eslint'],
      extends: [
        ...sharedExtends,
        'plugin:@typescript-eslint/recommended',
        'plugin:jest-playwright/recommended',
      ],
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
        // This rule does not support FunctionComponent<Props> and so
        // makes using (eg) children props more of a pain than it should be
        'react/prop-types': 'off',
      },
    },
  ],
};
