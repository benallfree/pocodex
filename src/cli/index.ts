#!/usr/bin/env node

import { execSync } from 'child_process'
import { Command, program } from 'commander'
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { globSync } from 'glob'
import { dirname, join } from 'path'
import { Options, build } from 'tsup'
export * from '../types'

function getPackageManager() {
  const lockFiles = {
    'package-lock.json': 'npm',
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm',
    'bun.lockb': 'bun',
  }

  for (const [file, manager] of Object.entries(lockFiles)) {
    const lockFile = join(process.cwd(), file)
    // dbg(`Searching for ${lockFile}`)
    if (existsSync(lockFile)) {
      return manager
    }
  }

  return `npm` // No lock file found
}

function installPackage(manager: string, packageName) {
  const command =
    manager === 'npm'
      ? `npm install ${packageName}`
      : manager === 'yarn'
        ? `yarn add ${packageName}`
        : manager === 'pnpm'
          ? `pnpm add ${packageName}`
          : manager === 'bun'
            ? `bun add ${packageName}`
            : null

  if (!command) {
    throw new Error(`Unsupported package manager ${manager}`)
  }

  const output = execSync(command)
  return output
}

const PLUGIN_BUILD_CONFIG = (packageName: string): Options => {
  const config: Options = {
    format: ['cjs'],
    entry: globSync(`src/*.{js,ts}`),
    shims: true,
    skipNodeModulesBundle: false,
    clean: false,
    target: 'node20',
    platform: 'node',
    minify: false,
    sourcemap: 'inline',
    bundle: true,
    // https://github.com/egoist/tsup/issues/619
    external: [packageName],
    splitting: false,
  }
  console.log({ config })
  return config
}

program
  .name(`pocodex`)
  .addCommand(
    new Command(`init`)
      .option(
        `-l, --link`,
        `Use a link: prefix when installing (for local development)`
      )
      .action(({ link }) => {
        installPackage(
          getPackageManager(),
          link ? `pocodex@link:pocodex` : `pocodex@latest`
        )

        const PACKAGE_ROOT = (...paths: string[]) => join(__dirname, ...paths)

        ;['pb_hooks', 'pb_migrations'].forEach((pfx) => {
          console.log(`Scanning `, PACKAGE_ROOT(pfx))
          const files = globSync(`${pfx}/*.js`, { cwd: PACKAGE_ROOT() })
          files.forEach((file) => {
            console.log(`Copying ${file}`)
            const src = PACKAGE_ROOT(file)
            const dst = file
            mkdirSync(dirname(dst), { recursive: true })
            copyFileSync(src, dst)
          })
        })

        console.log(`pocodex installed`)
      })
  )
  .addCommand(
    new Command(`build`).action(async () => {
      console.log(`starting to build`)
      const { name } = JSON.parse(readFileSync('package.json', 'utf-8'))
      await build(PLUGIN_BUILD_CONFIG(name))
    })
  )
  .addCommand(
    new Command(`watch`).action(async () => {
      console.log(`starting to build`)
      const { name } = JSON.parse(readFileSync('package.json', 'utf-8'))
      await build({ ...PLUGIN_BUILD_CONFIG(name), watch: true })
    })
  )

program.parseAsync(process.argv)
