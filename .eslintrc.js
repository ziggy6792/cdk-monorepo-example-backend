// eslint-disable-next-line no-undef
module.exports = {
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],

  rules: {
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',
    'no-use-before-define': 'off',
    'no-unused-vars': 'warn',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'func-names': 'off',

    'max-len': [
      'error',
      160,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
      },
    ],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
  },
  // settings: {
  //   'import/resolver': {
  //     alias: [['/', '/build']],
  //   },
  // },
};
