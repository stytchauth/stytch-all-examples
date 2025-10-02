const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');

const { fixupConfigRules } = require('@eslint/compat');

const tsParser = require('@typescript-eslint/parser');
const reactRefresh = require('eslint-plugin-react-refresh');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
    },

    extends: fixupConfigRules(
      compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'),
    ),

    plugins: {
      'react-refresh': reactRefresh,
    },

    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      'react-refresh/only-export-components': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  globalIgnores(['**/dist', '**/.eslintrc.cjs', '**/node_modules', 'frontend/node_modules']),
  {
    files: ['server/**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
      },
    },

    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['frontend/**/*.{ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...Object.fromEntries(Object.entries(globals.node).map(([key]) => [key, 'off'])),
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
