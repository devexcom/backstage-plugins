module.exports = {
  extends: ['@backstage'],
  rules: {
    '@typescript-eslint/no-shadow': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.*'],
      rules: {
        'jest/expect-expect': 'off',
      },
    },
  ],
};