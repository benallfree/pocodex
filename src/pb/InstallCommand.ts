import { dbg, error, info } from 'pocketbase-log'
import { PluginConfigured, PluginFactory } from '../types'
import { migrateUp } from './migrateUp'
import { getPackageManager, installPackage } from './PackageManager'
import { initPluginMeta } from './pluginMeta'

export const InstallCommand = () => {
  const cmd = new Command({
    use: 'install [name]',
    short: `Install a plugin`,
    run: (cmd, args) => {
      const pluginName = args.shift()
      if (!pluginName) {
        error('Plugin name is required')
        return
      }
      // dbg({ cmd, name, args })
      $app.dao().db().newQuery(`delete from pocodex`).execute()

      const packageManager = getPackageManager()

      try {
        $app.dao().runInTransaction((txDao) => {
          const output = installPackage(packageManager, pluginName, link)
          info(output)
          initPluginMeta(txDao, pluginName)
          const module = require(`${pluginName}/dist/plugin`)
          const factory = (module.default ||
            module.plugin ||
            module) as PluginFactory
          if (typeof factory !== 'function') {
            error(`Plugin ${pluginName} does not export a factory function`)
            return
          }
          dbg({ factory })
          const pluginModule = factory({
            migrate: (up, down) => ({
              up,
              down,
            }),
          })
          const configuredModule: PluginConfigured = {
            name: pluginName,
            ...pluginModule,
          }
          // dbg({ pluginModule })
          migrateUp(txDao, configuredModule)
        })
      } catch (e) {
        error(`Failed to install package ${pluginName}: ${e}`)
        if (e instanceof Error) {
          error(e.stack)
        }
      }

      dbg('Hello from pocodex install command!')
    },
  })
  let link = cmd
    .flags()
    .boolP('link', 'l', false, 'Use link: prefix for local development')

  return cmd
}
