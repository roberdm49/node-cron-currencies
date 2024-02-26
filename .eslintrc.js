module.exports = {
  extends: ['./node_modules/ts-standard/eslintrc.json'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    // to use "if (someString) | if (!someOtherString)"
    '@typescript-eslint/strict-boolean-expressions': 'off'
  }
}
