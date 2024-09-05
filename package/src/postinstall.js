import { ensureDirSync } from 'fs-extra'
import { cwd } from 'process'
import env from 'env-var'
import { join } from 'path'
import { copyFileSync } from 'fs'

const PB_ROOT = (...paths) =>
  join(env.get(`npm_config_local_prefix`).required().asString(), ...paths)
const PACKAGE_ROOT = (...paths) => join(cwd(), ...paths)
const HOOKS_ROOT = (...paths) => join(PB_ROOT(), `pb_hooks`, ...paths)

const isInSelf = env.get(`npm_package_name`).asString() === `pocketbase-plugins`

console.log(`isInSelf: ${isInSelf}`)
console.log(`package root: ${PACKAGE_ROOT()}`)
console.log(`hooks root: ${HOOKS_ROOT()}`)

if (isInSelf) {
  process.exit(0)
}

console.log(`Running postinstall script...`)

ensureDirSync(HOOKS_ROOT())

copyFileSync(
  PACKAGE_ROOT(`src`, `pb_hooks`, `pocketbase-plugins.pb.js`),
  HOOKS_ROOT(`pocketbase-plugins.pb.js`)
)

console.log(`Postinstall script executed successfully!`)
