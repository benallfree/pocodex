import { dbg, log } from 'pocketbase-log'
import { getPackageManager, installPackage } from '../PackageManager'
import { loadPlugin, loadPluginSafeMode } from './load'
import { deletePluginMeta, hasPluginMeta, initPluginMeta } from './meta'
import { migrateDown, migrateUp } from './migrate'
import { deleteSettings } from './settings'

export const uninstallPlugin = (dao: daos.Dao, pluginName: string) => {
  const plugin = loadPluginSafeMode(dao, pluginName)
  dao.runInTransaction((txDao) => {
    migrateDown(txDao, plugin)
    dbg(`Deleting plugin meta for ${plugin.name}`)
    deletePluginMeta(txDao, plugin.name)
    dbg(`Deleting settings owned by ${plugin.name}`)
    deleteSettings(txDao, plugin.name)
  })
}

export const installPlugin = (
  dao: daos.Dao,
  pluginName: string,
  link: boolean,
  force: boolean
) => {
  dbg(`Installing plugin ${pluginName}`)

  const packageManager = getPackageManager()

  try {
    dbg(`Checking for existing plugin meta`)
    const hasMeta = hasPluginMeta(dao, pluginName)
    const shouldBlock = hasMeta && !force

    if (shouldBlock) {
      log(`Plugin ${pluginName} already installed. Use --force to reinstall.`)
      return
    }
    uninstallPlugin(dao, pluginName)
  } catch (e) {
    dbg(`Did not find plugin meta for ${pluginName}`)
  }

  try {
    dao.runInTransaction((txDao) => {
      try {
        const output = installPackage(packageManager, pluginName, link)
        log(output)
      } catch (e) {
        log(`Failed to install package ${pluginName}: ${e}`)
        throw e
      }

      const plugin = (() => {
        try {
          log(`Loading plugin...`)
          return loadPlugin(txDao, pluginName)
        } catch (e) {
          log(`Failed to load plugin ${pluginName}: ${e}`)
          if (`${e}`.match(/invalid module/i)) {
            log(e)
          }
          throw e
        }
      })()

      try {
        log(`Initializing settings...`)
        initPluginMeta(txDao, pluginName)
      } catch (e) {
        log(`Failed to initialize plugin meta for ${pluginName}: ${e}`)
        throw e
      }

      try {
        migrateUp(txDao, plugin)
      } catch (e) {
        log(`Failed to migrate plugin ${pluginName}: ${e}`)
        throw e
      }
    })
  } catch (e) {
    log(
      `Fatal: failed to install package ${pluginName}. See above for details.`
    )
    dbg(e)
  }
}
