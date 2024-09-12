import { forEach } from '@s-libs/micro-dash'
import { dbg, error, log } from 'pocketbase-log'
import { getPackageManager, uninstallPackage } from '../PackageManager'
import { loadPluginSafeMode } from './load'
import { deletePluginMeta } from './meta'
import { migrateDown } from './migrate'
import { deleteSettings } from './settings'

export const uninstallPlugin = (dao: daos.Dao, pluginName: string) => {
  const plugin = loadPluginSafeMode(dao, pluginName)
  dao.runInTransaction((txDao) => {
    log(`Migrating down plugin ${plugin.name}`)
    migrateDown(txDao, plugin)
    log(`Deleting plugin meta for ${plugin.name}`)
    deletePluginMeta(txDao, plugin.name)
    log(`Deleting settings owned by ${plugin.name}`)
    deleteSettings(txDao, plugin.name)
    log(`Deleting files for ${plugin.name}`)
    try {
      log(plugin.files?.(txDao))
      forEach(plugin.files?.(txDao), (content, dst) => {
        log(`Removing ${dst}`, content)
        $os.remove(dst)
      })
    } catch (e) {
      error(`Failed to copy files for plugin ${pluginName}: ${e}`)
      dbg(e)
      throw e
    }
    log(`Removing package ${plugin.name}`)
    const packageManager = getPackageManager()
    try {
      const output = uninstallPackage(packageManager, pluginName)
      log(output)
    } catch (e) {
      error(`Failed to install package ${pluginName}: ${e}`)
      throw e
    }
  })
}
