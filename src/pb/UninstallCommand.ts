import { dbg } from 'pocketbase-log'
import { logo } from './logo'

export const UninstallCommand = () =>
  new Command({
    use: `uninstall [name]`,
    short: `Uninstall a plugin`,
    run: (cmd, args) => {
      logo()
      dbg(`Hello from pocodex uninstall command!`)
    },
  })
