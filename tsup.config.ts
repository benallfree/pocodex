import { globSync } from 'glob'
import { defineConfig } from 'tsup'

console.log(globSync(`pb_hooks/*.js`, { cwd: `src` }))
const files = [`pb_hooks`, `pb_migrations`]
  .map((pfx) =>
    globSync(`${pfx}/*.js`, { cwd: `src` }).reduce((acc, file) => {
      console.log({ file })
      acc[file.slice(0, -3)] = `src/${file}`
      return acc
    }, {})
  )
  .reduce((acc, obj) => ({ ...acc, ...obj }), {})
console.log(files)
export default defineConfig({
  format: ['cjs'],
  entry: {
    types: 'src/types.ts',
    cli: 'src/entries/cli/index.ts',
    postinstall: 'src/postinstall.ts',
    ...files,
  },
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  target: 'node20',
  platform: 'node',
  minify: false,
  sourcemap: 'inline',
  bundle: true,
  // https://github.com/egoist/tsup/issues/619
  noExternal: [/(.*)/],
  splitting: false,
})
;``
