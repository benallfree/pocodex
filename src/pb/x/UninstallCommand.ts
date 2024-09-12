import { dbg, log } from 'pocketbase-log'
import { logo } from './logo'
import { uninstallPlugin } from './plugin/uninstall'

export const UninstallCommand = () =>
  new Command({
    use: `uninstall [name]`,
    short: `Uninstall a plugin`,
    run: (cmd, args) => {
      logo()

      dbg(`Running uninstall command`, { args })

      const packageSpec = args.shift()
      if (!packageSpec) {
        log('Plugin npm package name is required')
        return
      }
      log(`Uninstalling plugin ${packageSpec}`)

      uninstallPlugin($app.dao(), packageSpec)
    },
  })
