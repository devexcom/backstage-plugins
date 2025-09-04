module.exports = {
  root: true,
  extends: ['eslint:recommended'],
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
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'prefer-const': 'off',
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
