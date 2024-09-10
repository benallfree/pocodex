import { cwd } from 'process'
import { join } from 'path'
import pkg from '../package.json'
import { copyFileSync, mkdirSync } from 'fs'

const PB_ROOT = (...paths) =>
  join(process.env.npm_config_local_prefix, ...paths)
const PACKAGE_ROOT = (...paths) => join(cwd(), ...paths)
const HOOKS_ROOT = (...paths) => join(PB_ROOT(), `pb_hooks`, ...paths)
const PACKAGE_NAME = pkg.name
const HOOK_NAME = `pocodex.pb.js`

const isInSelf = process.env.npm_package_name === PACKAGE_NAME

// console.log(`isInSelf: ${isInSelf}`, {
//   PACKAGE_NAME,
//   npm_package_name: env.get(`npm_package_name`).asString(),
// })
// console.log(`package root: ${PACKAGE_ROOT()}`)
// console.log(`hooks root: ${HOOKS_ROOT()}`)

if (isInSelf) {
  console.log(`***Skipping postinstall for self`)
  process.exit(0)
}

console.log(`Installing PocketBase Codex...`)

mkdirSync(HOOKS_ROOT(), { recursive: true })

const dst = HOOKS_ROOT(HOOK_NAME)
copyFileSync(PACKAGE_ROOT(`dist`, HOOK_NAME), dst)

console.log(`pocodex installed in ${dst}`)
