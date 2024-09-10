import { dbg } from 'pocketbase-log'

export const UninstallCommand = () =>
  new Command({
    use: `uninstall [name]`,
    short: `Uninstall a plugin`,
    run: (cmd, args) => {
      dbg(`Hello from pocodex uninstall command!`)
    },
  })
