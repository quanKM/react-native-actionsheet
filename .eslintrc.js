module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['react-app'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
  rules: {
    semi: ['error', 'always'],
  },
};
