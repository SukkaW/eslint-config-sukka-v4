import { constants, memo, importMetaResolve, RESTRICTED_IMPORT_TS } from '@eslint-sukka/shared';

import { generated_overrides } from './_generated_typescript_overrides';
import eslint_plugin_sukka_ts from 'eslint-plugin-sukka-ts';
import stylisticPlus from '@stylistic/eslint-plugin-plus';

import type { FlatESLintConfigItem } from '@eslint-sukka/shared';

import { configs as ts_eslint_configs } from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';

import eslint_plugin_import_x from 'eslint-plugin-import-x';

import { fileURLToPath, pathToFileURL } from 'url';

export interface OptionsTypeScript {
  tsconfigPath?: string | string[] | true,
  tsconfigRootDir?: string,
  componentExtentions?: string[]
}

const javaScriptExtensions = ['.js', '.jsx', '.mjs', '.cjs'];
const allExtensions = ['.ts', '.cts', '.mts', '.tsx', '.d.ts', ...javaScriptExtensions];
// Omit `.d.ts` because 1) TypeScript compilation already confirms that
// types are resolved, and 2) it would mask an unresolved
// `.ts`/`.tsx`/`.js`/`.jsx` implementation.
const importResolverExtensions = ['.ts', '.cts', '.mts', '.tsx', ...javaScriptExtensions];

export const typescript = (options: OptionsTypeScript = {}): FlatESLintConfigItem[] => {
  const { tsconfigPath = true, tsconfigRootDir = process.cwd(), componentExtentions = [] } = options;

  const typescriptEslintParserPath = fileURLToPath(importMetaResolve('@typescript-eslint/parser', typeof __dirname === 'string' ? pathToFileURL(__dirname).href : import.meta.url));

  return [
    {
      name: '@eslint-sukka/ts base',
      files: [
        constants.GLOB_TS,
        constants.GLOB_TSX,
        ...componentExtentions.map(ext => `**/*.${ext}`)
      ],
      plugins: {
        ...ts_eslint_configs.base.plugins,
        '@stylistic/ts': memo<any>(stylisticTs, '@stylistic/eslint-plugin-ts'),
        'sukka-ts': memo(eslint_plugin_sukka_ts, 'eslint-plugin-sukka-ts'),
        '@stylistic/plus': memo(stylisticPlus, '@stylistic/eslint-plugin-plus') as any,
        'import-x': memo(eslint_plugin_import_x, 'eslint-plugin-import-x') as any
      },
      // extends: [
      //   'plugin:i/recommended',
      //   'plugin:i/typescript'
      // ],
      languageOptions: {
        parser: ts_eslint_configs.base.languageOptions!.parser as any,
        sourceType: 'module',
        parserOptions: {
          sourceType: 'module',
          ecmaVersion: 'latest',
          ...(tsconfigPath === true
            ? {
              projectService: true
            }
            : {
              project: tsconfigPath
            }
          ),
          tsconfigRootDir,
          ecmaFeatures: {
            jsx: true
          },
          // for @typescript/eslint-parser
          jsxPragma: undefined,
          warnOnUnsupportedTypeScriptVersion: true
        }
      },
      settings: {
        'import-x/extensions': allExtensions,
        'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
        'import-x/resolver': {
          node: {
            extensions: importResolverExtensions
          },
          'ts-bundled': {
            alwaysTryTypes: true,
            ...(tsconfigPath === true ? {} : {
              project: tsconfigPath
            })
          }
        },
        'import-x/parsers': {
          // TODO: remove this line once eslint-plugin-import #2556 is fixed
          espree: javaScriptExtensions,
          [typescriptEslintParserPath]: ['.ts', '.cts', '.mts', '.tsx', '.d.ts']
        }
      },
      rules: {
        // overwritten eslint:recommended

        // plugin:@typescript-eslint/recommended
        ...ts_eslint_configs.base.rules,
        // plugin:@typescript-eslint/recommended-type-checked
        ...ts_eslint_configs.recommendedTypeChecked.reduce<typeof ts_eslint_configs.base.rules>(
          (acc, curr) => ({ ...acc, ...curr.rules }),
          {}
        ),
        // plugin:@typescript-eslint/stylistic-type-checked
        ...ts_eslint_configs.stylisticTypeChecked.reduce<typeof ts_eslint_configs.base.rules>(
          (acc, curr) => ({ ...acc, ...curr.rules }),
          {}
        ),
        // plugin:i/typescript
        ...eslint_plugin_import_x.configs.typescript.rules,

        ...generated_overrides.rules,

        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': true,
            'ts-nocheck': true,
            'ts-check': false,
            minimumDescriptionLength: 10
          }
        ], // disable a rule requires a reason
        '@typescript-eslint/naming-convention': [
          'warn',
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allowSingleOrDouble'
          },
          // Allow camelCase functions (23.2), and PascalCase functions (23.8)
          {
            selector: 'function',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allowSingleOrDouble'
          },
          // Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
          {
            selector: 'typeLike',
            format: ['PascalCase'],
            leadingUnderscore: 'allowSingleOrDouble',
            trailingUnderscore: 'allowSingleOrDouble'
          }
        ],
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow' }
        ],
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          { allowNumber: true, allowAny: true, allowBoolean: true, allowNever: true }
        ],
        '@typescript-eslint/unbound-method': 'error',
        '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports', disallowTypeAnnotations: false, fixStyle: 'separate-type-imports' }],
        '@typescript-eslint/no-import-type-side-effects': 'warn',
        '@typescript-eslint/consistent-type-exports': ['warn', { fixMixedExportsWithInlineTypeSpecifier: true }],
        '@typescript-eslint/consistent-type-definitions': 'warn',
        '@typescript-eslint/consistent-generic-constructors': ['error', 'constructor'],
        '@typescript-eslint/no-base-to-string': ['error', { ignoredTypeNames: ['Error', 'RegExp', 'URL', 'URLSearchParams'] }],
        '@typescript-eslint/no-confusing-non-null-assertion': 'error', // a! == b
        '@typescript-eslint/no-dynamic-delete': 'warn',
        '@typescript-eslint/no-extraneous-class': ['warn', {
          allowConstructorOnly: true,
          allowEmpty: true,
          allowWithDecorator: true
        }],
        // Promise<void[]> gets flagged
        '@typescript-eslint/no-invalid-void-type': ['off', { allowInGenericTypeArguments: true, allowAsThisParameter: true }],
        '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        // Failed to detect "isCancelled" case in useEffect
        '@typescript-eslint/no-unnecessary-condition': [
          'warn',
          { allowConstantLoopConditions: true }
        ],
        '@typescript-eslint/no-unnecessary-type-arguments': 'error',
        '@typescript-eslint/no-unsafe-declaration-merging': 'error',
        '@typescript-eslint/non-nullable-type-assertion-style': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-return-this-type': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-reduce-type-parameter': 'error',
        '@typescript-eslint/unified-signatures': ['error', { ignoreDifferentlyNamedParameters: true }],
        '@typescript-eslint/prefer-for-of': 'off',
        '@typescript-eslint/prefer-function-type': 'off',
        '@typescript-eslint/consistent-indexed-object-style': 'off',
        '@typescript-eslint/prefer-enum-initializers': 'warn',
        '@typescript-eslint/no-duplicate-enum-values': 'error',
        '@typescript-eslint/no-extra-non-null-assertion': 'error',
        '@typescript-eslint/no-meaningless-void-operator': 'warn', // void a_void_call()
        '@typescript-eslint/no-unnecessary-qualifier': 'warn', // no extra qualifier in enum/namespace
        '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }], // prefer T[] than Array<T>
        '@typescript-eslint/no-restricted-imports': [
          'error',
          {
            paths: RESTRICTED_IMPORT_TS
          }
        ],

        // the maintainers of @typescript-eslint DOESN'T KNOW ANYTHING about TypeScript AT ALL
        // and basically @typescript-eslint is a joke anyway
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              // {} is widely used with "& {}" approach
              '{}': false,
              FC: {
                message: 'To declare a component, you don\'t have to use FC to annotate it. To type something that accepts/is a React Component, use ComponentType<T>.',
                fixWith: 'ComponentType'
              },
              ReactElement: {
                message: 'In most cases, you want ReactNode. Only ignore this rule when you want to use cloneElement.',
                fixWith: 'ReactNode'
              },
              'React.FC': {
                message: 'To declare a component, you don\'t have to use React.FC to annotate it. To type something that accepts/is a React Component, use React.ComponentType<T>.',
                fixWith: 'React.ComponentType'
              },
              'React.ReactElement': {
                message: 'In most cases, you want React.ReactNode. Only ignore this rule when you want to use cloneElement.',
                fixWith: 'React.ReactNode'
              }
            },
            extendDefaults: true
          }
        ],
        '@typescript-eslint/no-unsafe-assignment': 'off', // bans a = any
        '@typescript-eslint/no-unsafe-argument': 'off', // bans call(any)
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-loop-func': 'warn',
        '@typescript-eslint/no-redundant-type-constituents': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-call': 'off', // bans any()
        '@typescript-eslint/no-unsafe-member-access': 'off', // bans a = any.prop
        '@typescript-eslint/no-unsafe-return': 'off', // bans return any
        '@typescript-eslint/no-unsafe-enum-comparison': 'warn',

        // https://eslint.style/rules/ts/member-delimiter-style
        '@stylistic/ts/member-delimiter-style': ['error', {
          multiline: { delimiter: 'comma', requireLast: false/** true */ },
          singleline: { delimiter: 'comma', requireLast: false }
        }],
        // https://eslint.style/rules/ts/lines-between-class-members
        '@stylistic/ts/lines-between-class-members': [
          'error', 'always',
          { exceptAfterSingleLine: true, exceptAfterOverload: true }
        ],
        // https://eslint.style/rules/ts/padding-line-between-statements
        '@stylistic/ts/padding-line-between-statements': [
          'error',
          // add line after
          { blankLine: 'always', prev: 'directive', next: '*' },
          // add line around (both before and after)
          { blankLine: 'always', prev: '*', next: ['class', 'with'] },
          { blankLine: 'always', prev: ['class', 'with'], next: '*' },
          { blankLine: 'any', prev: ['interface', 'type'], next: ['interface', 'type'] } // ts
        ],
        // https://eslint.style/rules/ts/type-annotation-spacing
        '@stylistic/ts/type-annotation-spacing': ['error', {
          before: false,
          after: true,
          overrides: {
            arrow: {
              before: true,
              after: true
            }
          }
        }],
        '@typescript-eslint/no-namespace': 'off',

        // prefer string.startsWith() and string.endsWith() over more complex alternatives
        // but also allow a[0] === 'a'
        '@typescript-eslint/prefer-string-starts-ends-with': 'off',

        '@typescript-eslint/switch-exhaustiveness-check': 'error',

        'sukka-ts/string/prefer-string-starts-ends-with': 'error',

        'sukka-ts/string/no-unneeded-to-string': 'error',
        // If you have a good reason to do this, please ignore this error and provide a comment about why this is type safe.
        'sukka-ts/type/no-force-cast-via-top-type': 'error',
        'sukka-ts/type/no-wrapper-type-reference': 'error',
        'sukka-ts/no-default-error': 'off', // disable since this is way too slow
        'sukka-ts/no-const-enum': 'error', // not tree-shakable by swc/babel/esbuild

        '@stylistic/plus/type-generic-spacing': 'error',
        '@stylistic/plus/type-named-tuple-spacing': 'error',
        // replaced by unused-imports/no-unused-imports
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-vars': [
          'error',
          { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_', ignoreRestSiblings: true }
        ],
        'unused-imports/no-unused-imports': 'error'
      }
    },
    {
      name: '@eslint-sukka/ts dts',
      files: ['**/*.d.ts'],
      plugins: {
        'import-x': memo(eslint_plugin_import_x, 'eslint-plugin-import-x') as any
      },
      rules: {
        'import-x/no-duplicates': 'off',
        'unused-imports/no-unused-vars': 'off'
      }
    },
    {
      name: '@eslint-sukka/ts jest/mocha',
      files: ['**/*.{test,spec}.ts?(x)'],
      rules: {
        'no-unused-expressions': 'off'
      }
    },
    {
      name: '@eslint-sukka/ts commonjs',
      files: ['**/*.js', '**/*.cjs'],
      plugins: ts_eslint_configs.base.plugins as any,
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ];
};
