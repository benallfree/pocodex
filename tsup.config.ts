import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs'],
  entry: {
    types: 'src/types.ts',
    cli: 'src/entries/cli.ts',
    [`pocodex.pb`]: 'src/pb_hooks/pocodex.pb.js',
    postinstall: 'src/postinstall.ts',
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
