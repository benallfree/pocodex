import { copyFileSync } from 'fs'
import { globSync } from 'glob'
import { defineConfig } from 'tsup'

const files = [`pb_hooks`, `pb_migrations`]
  .map((pfx) =>
    globSync(`${pfx}/*.js`, { cwd: `src` }).reduce((acc, file) => {
      console.log({ file })
      acc[file.slice(0, -3)] = `src/${file}`
      return acc
    }, {})
  )
  .reduce((acc, obj) => ({ ...acc, ...obj }), {})

export default defineConfig({
  format: ['cjs'],
  entry: {
    index: 'src/index.ts',
    pb: 'src/pb/index.ts',
    cli: 'src/cli.ts',
  },
  dts: {
    entry: ['./src/index.ts'],
    resolve: true,
    banner: `/// <reference types="./jsvm" />\n/// <reference types="./jsvm-extra" />`,
  },
  shims: true,
  skipNodeModulesBundle: true,
  clean: false,
  target: 'node20',
  platform: 'node',
  minify: false,
  sourcemap: 'inline',
  bundle: true,
  // https://github.com/egoist/tsup/issues/619
  noExternal: [/^pocketbase-/],
  splitting: false,
  onSuccess: `cp src/*.d.ts dist && cp -r src/pb_hooks dist && cp -r src/pb_migrations dist`,
})
;``
