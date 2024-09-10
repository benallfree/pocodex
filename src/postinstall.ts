import { cwd } from 'process'
import { join } from 'path'
import pkg from '../package.json'
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { globSync } from 'glob'
import { confirm } from '@inquirer/prompts'

const PB_ROOT = (...paths) =>
  join(process.env.npm_config_local_prefix, ...paths)
const PACKAGE_ROOT = (...paths) => join(cwd(), ...paths)
const PB_HOOKS_ROOT = (...paths) => PB_ROOT(`pb_hooks`, ...paths)
const PB_MIGRATIONS_ROOT = (...paths) => PB_ROOT(`pb_hooks`, ...paths)
const PACKAGE_NAME = pkg.name

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

const fileContentDiffers = (src, dst) => {
  if (!existsSync(dst)) {
    return false
  }

  const srcContent = readFileSync(src, 'utf8')
  const dstContent = readFileSync(dst, 'utf8')

  return srcContent !== dstContent
}

mkdirSync(PB_HOOKS_ROOT(), { recursive: true })
;['pb_hooks', 'pb_migrations'].forEach((pfx) => {
  const files = globSync(`${pfx}/*.js`, { cwd: PACKAGE_ROOT(`src`) })
  files.forEach((file) => {
    const src = PACKAGE_ROOT(`dist`, file)
    const dst = PB_ROOT(file)
    console.log(`Copying ${file}`)
    copyFileSync(src, dst)
  })
})

console.log(`pocodex installed`)
