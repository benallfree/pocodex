import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs'],
  entry: {
    index: 'src/index.ts',
    pb: 'src/pb/x/index.ts',
    cli: 'src/cli/index.ts',
    [`pb_hooks/pocodex.pb`]: 'src/pb/pb_hooks/pocodex.pb.ts',
    [`pb_migrations/1725942258_create_pocodex`]:
      'src/pb/pb_migrations/1725942258_create_pocodex.js',
  },
  dts: {
    entry: ['./src/index.ts'],
    resolve: true,
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
  noExternal: [/^pocketbase-/, 'immer', '@s-libs/micro-dash'],
  splitting: false,
})
;``
