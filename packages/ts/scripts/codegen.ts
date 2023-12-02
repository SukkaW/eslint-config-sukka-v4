import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED__ } from '@eslint-sukka/js';

import ts_eslint_plugin from '@typescript-eslint/eslint-plugin';
import stylistic_eslint_plugin_js from '@stylistic/eslint-plugin-js';
import stylistic_eslint_plugin_ts from '@stylistic/eslint-plugin-ts';

import fs from 'fs';
import path from 'path';

(() => {
  const stylistic_eslint_plugin_ts_rulenames = new Set(Object.keys(stylistic_eslint_plugin_ts.rules));

  const TS_ESLINT_BASE_RULES_TO_BE_OVERRIDDEN = new Map(Object.entries(ts_eslint_plugin.rules)
    .filter(([, rule]) => (rule as any).meta.docs?.extendsBaseRule)
    .map(
      ([ruleName, rule]) => [
        typeof (rule as any).meta.docs?.extendsBaseRule === 'string'
          ? (rule as any).meta.docs.extendsBaseRule
          : ruleName,
        ruleName
      ] as const
    ));

  const STYLISTIC_JS_RULES_TO_BE_OVERRIDEN = new Set(Object.keys(stylistic_eslint_plugin_js.rules)
    .filter((ruleName) => stylistic_eslint_plugin_ts_rulenames.has(ruleName))
    .map(ruleName => `@stylistic/js/${ruleName}`));

  const rules = Object.fromEntries(
    Object.entries(
      Object.values(__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED__)
        .reduce((acc, cur) => ({ ...acc, ...cur.rules }), {})
    )
      .filter(([, value]) => {
        if (typeof value === 'string') {
          return value !== 'off';
        }
        if (typeof value === 'number') {
          return value !== 0;
        }
        if (Array.isArray(value)) {
          return value.length !== 0 && value[0] !== 'off';
        }
        return true;
      })
      .reduce((acc, [baseRuleName, value]) => {
        if (baseRuleName === 'camelcase' || baseRuleName === 'no-restricted-imports') {
          // disable camelcase directly, use custom @typescript-eslint/naming-convention instead
          // disable no-restricted-imports directly, use @typescript-eslint/no-restricted-imports instead

          // @ts-expect-error -- no type overlap between eslint and typescript-eslint
          acc.push([baseRuleName, 'off']);
        } else if (TS_ESLINT_BASE_RULES_TO_BE_OVERRIDDEN.has(baseRuleName)) {
          const replacementRulename = TS_ESLINT_BASE_RULES_TO_BE_OVERRIDDEN.get(baseRuleName)!;
          acc.push(
            // @ts-expect-error -- no type overlap between eslint and typescript-eslint
            [baseRuleName, 'off'],
            [`@typescript-eslint/${replacementRulename}`, value]
          );
        } else if (STYLISTIC_JS_RULES_TO_BE_OVERRIDEN.has(baseRuleName)) {
          acc.push(
            // @ts-expect-error -- no type overlap between eslint and typescript-eslint
            [baseRuleName, 'off'],
            [baseRuleName.replace('@stylistic/js/', '@stylistic/ts/'), value]
          );
        }
        return acc;
      }, [])
  );

  fs.writeFileSync(
    path.resolve(__dirname, '../src/modules/generated_overrides.ts'),
    [
      '// This file is generated by scripts/codegen.ts',
      '// DO NOT EDIT THIS FILE MANUALLY',
      'import { memo } from \'@eslint-sukka/shared\';',
      'import type { SukkaESLintRuleConfig } from \'@eslint-sukka/shared\';',
      'import ts_eslint_plugin from \'@typescript-eslint/eslint-plugin\';',
      '',
      'export const generated_overrides: SukkaESLintRuleConfig = {',
      '  plugins: {',
      '    \'@typescript-eslint\': memo<any>(ts_eslint_plugin, \'@typescript-eslint/eslint-plugin\')',
      '  },',
      `  rules: ${JSON.stringify(rules, null, 2).split('\n').map((line) => `  ${line}`).join('\n').trimStart()}`,
      '};',
      ''
    ].join('\n')
  );
})();
