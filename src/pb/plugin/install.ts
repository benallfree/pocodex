import { forEach } from '@s-libs/micro-dash'
import { dbg, error, log } from 'pocketbase-log'
import { writeFileSync } from 'pocketbase-node'
import { getPackageManager, installPackage } from '../PackageManager'
import { loadPlugin, loadPluginSafeMode } from './load'
import { deletePluginMeta, hasPluginMeta, initPluginMeta } from './meta'
import { migrateDown, migrateUp } from './migrate'
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
  })
}

export const installPlugin = (
  dao: daos.Dao,
  packageSpec: string,
  force: boolean
) => {
  const pluginName = packageSpec.split('@')[0]!
  dbg(`Installing plugin ${packageSpec}`)

  const packageManager = getPackageManager()

  dbg(`Checking for existing plugin meta`)
  const hasMeta = hasPluginMeta(dao, pluginName)
  if (hasMeta) {
    const shouldBlock = hasMeta && !force

    if (shouldBlock) {
      error(`Plugin ${pluginName} already installed. Use --force to reinstall.`)
      return
    }
    log(`Force reinstalling plugin ${pluginName}`)
    uninstallPlugin(dao, pluginName)
  }

  try {
    dao.runInTransaction((txDao) => {
      try {
        const output = installPackage(packageManager, packageSpec)
        log(output)
      } catch (e) {
        error(`Failed to install package ${pluginName}: ${e}`)
        throw e
      }

      const plugin = (() => {
        try {
          log(`Loading plugin...`)
          return loadPlugin(txDao, pluginName)
        } catch (e) {
          error(`Failed to load plugin ${pluginName}: ${e}`)
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
        error(`Failed to initialize plugin meta for ${pluginName}: ${e}`)
        throw e
      }

      try {
        migrateUp(txDao, plugin)
      } catch (e) {
        error(`Failed to migrate plugin ${pluginName}: ${e}`)
        throw e
      }

      try {
        log(plugin.files?.(txDao))
        forEach(plugin.files?.(txDao), (content, dst) => {
          log(`Writing ${dst}`)
          writeFileSync(dst, content)
        })
      } catch (e) {
        error(`Failed to copy files for plugin ${pluginName}: ${e}`)
        dbg(e)
        throw e
      }
    })
  } catch (e) {
    error(
      `Fatal: failed to install package ${pluginName}. See above for details.`
    )
    dbg(e)
  }
}
