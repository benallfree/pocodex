# pocketbase-node

An attempt at a rough node compatibility layer to assist in porting other node projects.

Uses underlying PocketBase functions where possible.

Includes a suite of helpful utility functions.

```bash
npm i pocketbase-node
yarn add pocketbase-node
pnpm add pocketbase-node
bun add pocketbase-node
```

```js
const kitchenSink = require('pocketbase-node')
```

# Logging

```js
const { dbg, info, warn, error } = require('pocketbase-node/log')

Note: `--dev` must be present for `dbg`

## stringify

const { stringify } = require('pocketbase-node/stringify')

A cycle-safe stable stringify.
```

## fs

```js
const fs = require('fs')
```

becomes

```js
const fs = require('pocketbase-node/fs')
```

## path

const { join, basename, dirname } = require('pocketbase-node/path')

## Why not alias

While `npm i fs@npm:pocketbase-node-fs` might work, it would interfere with actual node-compatible CLI tools that you may want to run in your PocketBase project root.

## If PocketBase can...we will...

`const fs = require('pocketbase-node/fs')`
