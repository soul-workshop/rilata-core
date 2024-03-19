module.exports = {
  extends: ['./node_modules/nurgeo-project-configs/src/base-configs/common/.eslintrc.js'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'operator-linebreak': 'off',
    'function-paren-newline': 'off',
    'object-curly-newline': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
