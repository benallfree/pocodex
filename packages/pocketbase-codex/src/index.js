/// <reference path="../../types.d.ts" />

const { dbg } = require('./log')

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
    short: 'i',
    run: (cmd, args) => {
      dbg({ cmd, args })
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
