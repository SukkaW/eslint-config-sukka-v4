// This file is generated by scripts/codegen.ts
// DO NOT EDIT THIS FILE MANUALLY
import { memo } from '@eslint-sukka/shared';
import type { SukkaESLintRuleConfig } from '@eslint-sukka/shared';
import stylisticJs from '@stylistic/eslint-plugin-js';

export const generated_eslint_js_deprecated: SukkaESLintRuleConfig = {
  plugins: {
    '@stylistic/js': memo(stylisticJs, '@stylistic/eslint-plugin-js')
  },
  rules: {
    "no-extra-semi": "off",
    "@stylistic/js/no-extra-semi": "error",
    "no-mixed-spaces-and-tabs": "off",
    "@stylistic/js/no-mixed-spaces-and-tabs": "error"
  }
};
