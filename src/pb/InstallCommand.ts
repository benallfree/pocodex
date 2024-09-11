import { dbg, error } from 'pocketbase-log'
import { installPlugin } from './plugin-helpers'

export const InstallCommand = () => {
  const cmd = new Command({
    use: 'install [name]',
    short: `Install a plugin`,
    run: (cmd, args) => {
      const force = cmd.flag(`force`).value.toString() === 'true'
      const link = cmd.flag(`link`).value.toString() === 'true'

      dbg(`Running install command`, { args, link, force, isForce: !!force })

      const pluginName = args.shift()
      if (!pluginName) {
        error('Plugin name is required')
        return
      }
      dbg(`Installing plugin ${pluginName}`, { args, link, force })

      installPlugin($app.dao(), pluginName, link, force)

      dbg('Hello from pocodex install command!')
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
      'Reinstall plugin, deleting existing plugin meta and migrations',
    )

  return cmd
}
