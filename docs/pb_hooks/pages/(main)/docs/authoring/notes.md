# pocodex Plugin Authoring Guide

- JSDOC works well
- integrated jsvm and jsvm-extra
- bun add -D pocodex
- pocodex watch / pocodex build
- bunx pocodex init to install

bunx pocodex update

pocketbase CLI:

- install
- enable
- disable
- uninstall

plugin:

- main.js
- hooks.pb.js
- plugin.js

the handler inlining discussion: using require / serializing \* devDep only - if you can't bundle it, it probably shouldn't be a dependency

bunx pocodex watch
bunx pocodex build

helpers:

- `pocketbase-log`
- `pocketbase-node`
- `pocketbase-stringify`

main.js:

- the single entry point
- making export functions for each hook

# Settings Store

- if you need simple atomic persistent storage and don't need migrations, use store(key, updater)
- if you need non-atomic but threadsafe memory cache, use $app.store()
- if you need full relational data, use pocketbase database and record APIs
