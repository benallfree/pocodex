import { dbg, error, info } from 'pocketbase-log'
import { getPackageManager, installPackage } from '../PackageManager'
import { loadPlugin, loadPluginSafeMode } from './load'
import { deletePluginMeta, getPluginMeta, initPluginMeta } from './meta'
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
    const meta = getPluginMeta($app.dao(), pluginName)
    const shouldBlock = meta && !force

    if (shouldBlock) {
      error(`Plugin ${pluginName} already installed. Use --force to reinstall.`)
      return
    }
    uninstallPlugin($app.dao(), pluginName)
  } catch (e) {
    dbg(`Did not find plugin meta for ${pluginName}`)
  }

  try {
    dao.runInTransaction((txDao) => {
      const output = installPackage(packageManager, pluginName, link)
      info(output)

      dbg(`Loading plugin ${pluginName}`)
      const plugin = loadPlugin(txDao, pluginName)
      dbg(`Plugin loaded, initializing meta`)

      initPluginMeta(txDao, pluginName)
      migrateUp(txDao, plugin)
    })
  } catch (e) {
    error(`Failed to install package ${pluginName}: ${e}`)
    dbg(e)
  }
}
