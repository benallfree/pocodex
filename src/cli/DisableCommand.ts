import { dbg } from 'pocketbase-log'

export const DisableCommand = () =>
  new Command({
    use: 'disable [name]',
    args: (cmd, args) => {
      if (args.length < 1) {
        throw new Error('Disable the plugin')
      }
    },
    short: `Disable a plugin, but don't uninstall it`,
    run: (cmd, args) => {
      dbg('Hello from pocodex disable command!')
    },
  })
