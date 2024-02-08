import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import {defineConfig} from 'rollup'
import {terser} from 'rollup-plugin-terser'

/**
 * Flag to indicate build of library
 */
const isProduction =
  !process.env.ROLLUP_WATCH || process.env.NODE_ENV === 'production'

export default defineConfig([
  {
    input: 'src/index.ts',
    external: [
      ...Object.keys({
        "@supabase/supabase-js": "^2.39.3",
        "dotenv": "^16.4.1",
        "ms": "^2.1.3",
        "ts-node": "^10.9.2"
      } || {})
    ],
    output: [
      {
        file: "dist/index.cjs.js",
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: "dist/index.esm.js",
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript(), // so Rollup can convert TypeScript to JavaScript
      replace({
        // preserve to be handled by bundlers
        __DEV__: `(process.env.NODE_ENV !== 'production')`,
        // see: https://github.com/rollup/plugins/tree/master/packages/replace#preventassignment
        preventAssignment: true,
      }),
      isProduction && terser(), // minify, but only in production
    ].filter(Boolean),
  },
])
