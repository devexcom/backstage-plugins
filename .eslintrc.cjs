module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'dist-types',
    '*.esm.js',
    '*.cjs.js',
    '.eslintrc.cjs',
  ],
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.*'],
      env: {
        jest: true,
      },
    },
  ],
};
