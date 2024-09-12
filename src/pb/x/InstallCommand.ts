import { dbg, log } from 'pocketbase-log'
import { logo } from './logo'
import { installPlugin } from './plugin/install'

export const InstallCommand = () => {
  const cmd = new Command({
    use: 'install [name]',
    short: `Install a plugin`,
    run: (cmd, args) => {
      logo()

      const force = cmd.flag(`force`).value.toString() === 'true'

      dbg(`Running install command`, { args, force, isForce: !!force })

      const packageSpec = args.shift()
      if (!packageSpec) {
        log('Plugin npm package name is required')
        return
      }
      log(`Installing plugin ${packageSpec}`)
      dbg({ args, force })

      installPlugin($app.dao(), packageSpec, force)
    },
  })

  cmd
    .flags()
    .bool(
      'force',
      false,
      'Reinstall plugin, deleting existing plugin meta and migrations'
    )

  return cmd
}
