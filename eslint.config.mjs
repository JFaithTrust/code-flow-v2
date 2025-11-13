import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import pluginImport from 'eslint-plugin-import';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/components/ui/**',
  ]),

  prettier,

  {
    plugins: {
      import: pluginImport,
      'unused-imports': pluginUnusedImports,
      'better-tailwindcss': betterTailwind,
    },

    rules: {
      // ==== Best practices ====
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // ==== TypeScript ====
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // ==== Import order ====
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // ==== React & Hooks ====
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ==== Accessibility ====
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',

      // ==== Better Tailwind CSS ====
      'better-tailwindcss/enforce-consistent-class-order': 'warn',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/enforce-shorthand-classes': 'warn',
      'better-tailwindcss/no-unregistered-classes': [
        'error',
        {
          ignore: [
            'prose',
            'prose-sm',
            'prose-lg',
            'prose-invert',
            'custom-scrollbar',
            'no-scrollbar',
            'active-theme',
            'mdxeditor-toolbar',
            'hash-span',
            'markdown',
            'dark-editor',
          ],
        },
      ],
      'better-tailwindcss/no-conflicting-classes': 'error',
    },

    settings: {
      'better-tailwindcss': {
        config: 'tailwind.config.js',
        entryPoint: 'app/globals.css',
        callees: ['cn', 'clsx'],
      },
    },
  },
]);

export default eslintConfig;
