/* eslint-env node */

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'semi': ['error', 'never'],
    'quotes': [
      'error',
      'single',
      { 'allowTemplateLiterals': true }
    ],
  },
}
