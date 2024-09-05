/// <reference path="../../types.d.ts" />

const {
  dbg,
} = require('/Volumes/Code/repos/pocketbase-plugins/packages/pocketbase-node')

dbg('Hello from PocketBase Codex bootstrap')

const cmd = new Command({
  use: 'codex',
  run: (cmd, args) => {
    console.log('Hello from codex command!')
  },
})

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
      dbg({ cmd, name, args })
      dbg('Hello from codex install command!')
    },
  })
)

cmd.addCommand(
  new Command({
    use: `uninstall`,
    run: (cmd, args) => {
      console.log(`Hello from codex uninstall command!`)
    },
  })
)
$app.rootCmd.addCommand(cmd)
