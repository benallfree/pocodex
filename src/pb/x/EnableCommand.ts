import { dbg } from 'pocketbase-log'
import { logo } from './logo'

export const EnableCommand = () =>
  new Command({
    use: 'enable [name]',
    args: (cmd, args) => {
      if (args.length < 1) {
        throw new Error('Enable the plugin')
      }
    },
    short: `Enable a plugin`,
    run: (cmd, args) => {
      logo()
      dbg('Hello from pocodex enable command!')
    },
  })
