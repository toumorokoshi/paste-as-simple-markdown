import js from '@eslint/js';
import functional from 'eslint-plugin-functional';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      functional
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      complexity: ['error', 5],
      'max-depth': ['error', 3],
      'max-lines-per-function': ['error', 70],
      'no-magic-numbers': ['off'],
      'functional/no-let': 'error',
      'no-var': 'error',
      'prefer-const': 'error'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
];
