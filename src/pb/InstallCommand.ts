import { dbg, log } from 'pocketbase-log'
import { installPlugin } from './plugin/install'
import { logo } from './RootCommand'

export const InstallCommand = () => {
  const cmd = new Command({
    use: 'install [name]',
    short: `Install a plugin`,
    run: (cmd, args) => {
      logo()

      const force = cmd.flag(`force`).value.toString() === 'true'
      const link = cmd.flag(`link`).value.toString() === 'true'

      dbg(`Running install command`, { args, link, force, isForce: !!force })

      const pluginName = args.shift()
      if (!pluginName) {
        log('Plugin name is required')
        return
      }
      log(`Installing plugin ${pluginName}`)
      dbg({ args, link, force })

      installPlugin($app.dao(), pluginName, link, force)
    },
  })

  cmd
    .flags()
    .boolP('link', 'l', false, 'Use link: prefix for local development') ===
    'boolean'
  cmd
    .flags()
    .bool(
      'force',
      false,
      'Reinstall plugin, deleting existing plugin meta and migrations'
    )

  return cmd
}
