import { dbg, info, error } from 'pocketbase-log'
import { getPackageManager, installPackage } from './PackageManager'
import { initPluginMeta } from './pluginMeta'
import { migrateUp } from './migrateUp'

export const InstallCommand = () =>
  new Command({
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
      $app
        .dao()
        .db()
        .newQuery(`delete from _collections where name = 'plugin-otp-tokens'`)
        .execute()
      $app.dao().db().newQuery(`drop table 'plugin-otp-tokens'`).execute()

      const packageManager = getPackageManager()

      try {
        $app.dao().runInTransaction((txDao) => {
          const output = installPackage(packageManager, pluginName)
          info(output)
          initPluginMeta(txDao, pluginName)
          const pluginModule = require(pluginName)((up, down) => ({
            up,
            down,
          }))
          pluginModule.name = pluginName
          // dbg({ pluginModule })
          migrateUp(txDao, pluginModule)
        })
      } catch (e) {
        error(`Failed to install package ${pluginName}: ${e}`)
        error(e.stack)
      }

      dbg('Hello from pocodex install command!')
    },
  })
