import fs from 'fs-extra'
import { cwd } from 'process'
import env from 'env-var'
import { join } from 'path'

const pkg = fs.readJsonSync(env.get(`npm_package_json`).required().asString())

const PB_ROOT = (...paths) =>
  join(env.get(`npm_config_local_prefix`).required().asString(), ...paths)
const PACKAGE_ROOT = (...paths) => join(cwd(), ...paths)
const HOOKS_ROOT = (...paths) => join(PB_ROOT(), `pb_hooks`, ...paths)
const PACKAGE_NAME = pkg.name
const HOOK_NAME = `${PACKAGE_NAME}.pb.js`

const isInSelf = env.get(`npm_package_name`).asString() === PACKAGE_NAME

// console.log(`isInSelf: ${isInSelf}`)
// console.log(`package root: ${PACKAGE_ROOT()}`)
// console.log(`hooks root: ${HOOKS_ROOT()}`)

if (isInSelf) {
  process.exit(0)
}

console.log(`Installing PocketBase Codex...`)

fs.ensureDirSync(HOOKS_ROOT())

const dst = HOOKS_ROOT(HOOK_NAME)
fs.copyFileSync(PACKAGE_ROOT(`src`, `pb_hooks`, HOOK_NAME), dst)

console.log(`PocketBase Codex installation completed! Look in ${dst}`)
