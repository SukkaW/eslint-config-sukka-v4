/** 福妮严选 */
export const BETTER_ALTERNATIVES = Object.entries({
  // deep equal
  'deep-equal': 'https://www.npmjs.com/package/dequal',
  'fast-deep-equal': 'https://www.npmjs.com/package/dequal',
  // ansi color
  chalk: 'https://www.npmjs.com/package/picocolors',
  kleur: 'https://www.npmjs.com/package/picocolors',
  // mime
  'mime-db': 'https://www.npmjs.com/package/mrmime',
  'mime-types': 'https://www.npmjs.com/package/mrmime',
  // lru
  'tiny-lru': 'https://www.npmjs.com/package/flru',
  'lru-cache': 'https://www.npmjs.com/package/flru',
  'tmp-cache': 'https://www.npmjs.com/package/flru',
  // fs operations
  premove: 'Node.js built-in fs.rmdir & fs.rm API',
  mkdirp: 'Node.js built-in fs.mkdir API',
  'make-dir': 'Node.js built-in fs.mkdir API',
  'mk-dirs': 'Node.js built-in fs.mkdir API',
  // network
  axios: 'https://www.npmjs.com/package/ky',
  'node-fetch': 'https://www.npmjs.com/package/undici',
  got: 'https://www.npmjs.com/package/undici and https://www.npmjs.com/package/async-retry',
  // react
  'react-query': 'https://swr.vercel.app',
  '@tanstack/react-query': 'https://swr.vercel.app',
  '@tanstack/react-query-devtools': 'https://swr.vercel.app',
  ahooks: 'https://foxact.skk.moe and https://swr.vercel.app',
  // deep clone
  'clone-deep': 'https://www.npmjs.com/package/rfdc for Node.js / https://www.npmjs.com/package/klona for Browser',
  'deep-copy': 'https://www.npmjs.com/package/rfdc for Node.js / https://www.npmjs.com/package/klona for Browser',
  'fast-copy': 'https://www.npmjs.com/package/rfdc for Node.js / https://www.npmjs.com/package/klona for Browser',
  'lodash.clonedeep': 'https://www.npmjs.com/package/rfdc for Node.js / https://www.npmjs.com/package/klona for Browser',
  clone: 'https://www.npmjs.com/package/rfdc for Node.js / https://www.npmjs.com/package/klona for Browser',
  // misc
  ms: 'https://www.npmjs.com/package/@lukeed/ms',
  classnames: 'https://www.npmjs.com/package/clsx',
  'p-limit': 'https://www.npmjs.com/package/async-sema',
  'p-retry': 'https://www.npmjs.com/package/async-retry'
}).map(([key, value]) => ({ name: key, message: `Use ${value} instead.` }));

const restricedImportBase = [
  { name: 'date-fns/esm', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'idb/with-async-ittr-cjs', message: 'Please use idb/with-async-ittr instead.' },
  { name: 'lodash-unified', message: 'Do not import lodash-unified directly' },
  { name: 'react-fast-compare', message: 'What\'s faster than a really fast deep comparison? No deep comparison at all.' }
];

/** eslint-plugin-n/no-restricted-require doesn't support "importNames" */
const restrictedImportWithImportNames = [
  { name: 'lodash', message: 'Avoid using type unsafe methods.', importNames: ['get'] },
  { name: 'lodash-es', message: 'Avoid using type unsafe methods.', importNames: ['get'] },
  { name: 'lodash', message: 'Use https://www.npmjs.com/package/rfdc for Node.js / https://www.npmjs.com/package/klona for Browser instead', importNames: ['cloneDeep'] },
  { name: 'lodash-es', message: 'Use https://www.npmjs.com/package/rfdc for Node.js / https://www.npmjs.com/package/klona for Browser instead', importNames: ['cloneDeep'] },
  { name: 'uuid', importNames: ['v4'], message: 'Use https://www.npmjs.com/package/@lukeed/uuid instead' }
];

export const RESTRICTED_IMPORT_JS = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.' },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES,
  ...restrictedImportWithImportNames
];

export const RESTRICTED_IMPORT_TS = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.', allowTypeImports: true },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.', allowTypeImports: true },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES,
  ...restrictedImportWithImportNames
];

export const RESTRICTED_IMPORT_NODE_REQUIRE = [
  { name: 'date-fns', message: 'Please use date-fns/{submodule} instead.' },
  { name: 'async-call-rpc', message: 'Please use async-call-rpc/full instead.' },
  ...restricedImportBase,
  ...BETTER_ALTERNATIVES
];
