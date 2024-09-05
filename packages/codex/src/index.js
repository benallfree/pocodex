/// <reference path="../../types.d.ts" />

const {
  log: { dbg, error, info },
  fs,
  path,
  process,
  child_process,
} = require(`pocketbase-node`)

dbg('Hello from PocketBase Codex bootstrap')

const cmd = new Command({
  use: 'codex',
})

function getPackageManager() {
  const lockFiles = {
    'package-lock.json': 'npm',
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm',
    'bun.lockb': 'bun',
  }

  for (const [file, manager] of Object.entries(lockFiles)) {
    const lockFile = path.join(process.cwd(), file)
    // dbg(`Searching for ${lockFile}`)
    if (fs.existsSync(lockFile)) {
      return manager
    }
  }

  return `npm` // No lock file found
}

function installPackage(manager, packageName) {
  const command =
    manager === 'npm'
      ? `npm install ${packageName}`.split(' ')
      : manager === 'yarn'
      ? `yarn add ${packageName}`.split(' ')
      : manager === 'pnpm'
      ? `pnpm add ${packageName}`.split(' ')
      : manager === 'bun'
      ? `bun add ${packageName}`.split(' ')
      : null

  if (!command) {
    error('Unsupported package manager')
    return
  }

  const output = child_process.execSync(command)
  return output
}

cmd.addCommand(
  new Command({
    use: 'install [name]',
    args: (cmd, args) => {
      if (args.length < 1) {
        throw new Error('Plugin name is required')
      }
    },
    short: 'i',
    run: (cmd, args) => {
      const name = args.shift()
      // dbg({ cmd, name, args })

      const packageManager = getPackageManager()

      try {
        const output = installPackage(packageManager, name)
        info(output)
      } catch (e) {
        error(`Failed to install package ${name}: ${e}`)
      }

      dbg('Hello from codex install command!')
    },
  })
)

cmd.addCommand(
  new Command({
    use: `uninstall [name]`,
    run: (cmd, args) => {
      dbg(`Hello from codex uninstall command!`)
    },
  })
)

// let listGlobal = false
// const listCommand = new Command({
//   use: `list`,
//   short: 'ls',

//   run: (cmd, args) => {
//     dbg(`Hello from codex list command!`, { listGlobal })
//   },
// })
// listCommand.flags().boolVar(listGlobal, 'global', 'g', 'List global plugins')
// cmd.addCommand(listCommand)

$app.rootCmd.addCommand(cmd)
