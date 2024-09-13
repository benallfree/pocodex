import { forEach } from '@s-libs/micro-dash'
import { dbg, error, log } from 'pocketbase-log'
import { fs, path } from 'pocketbase-node'
import { getPackageManager, installPackage } from '../PackageManager'
import { loadPlugin } from './load'
import { hasPluginMeta, initPluginMeta } from './meta'
import { migrateUp } from './migrate'
import { uninstallPlugin } from './uninstall'

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
          if (fs.existsSync(dst)) {
            const currentContent = fs.readFileSync(dst, 'utf-8')
            if (currentContent != content) {
              log(`Refusing to overwrite ${dst} because it has been modified`)
              return
            }
          }
          log(`Writing ${dst}`)

          fs.mkdirSync(path.dirname(dst))
          fs.writeFileSync(dst, content)
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
  log(`Plugin ${pluginName} installed`)
}
