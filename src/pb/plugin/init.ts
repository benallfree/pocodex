import { dbg, error } from 'pocketbase-log'
import { PluginMeta } from '../../types'
import { loadPlugin } from './load'
import { POCODEX_OWNER, RECORD_TYPE_PLUGIN_META } from './meta'
import { migrateUp } from './migrate'
import { getSettings } from './settings'

export const initPlugins = (dao: daos.Dao) => {
  dbg(`Initializing plugins`)

  try {
    dbg(`Getting plugin metas`)
    const pluginMetas = getSettings<PluginMeta>(
      dao,
      POCODEX_OWNER,
      RECORD_TYPE_PLUGIN_META
    )

    dbg(`Plugin metas`, { pluginMetas })

    pluginMetas.forEach((record) => {
      try {
        const { key, value } = record
        dbg(`Initializing plugin ${key}`)
        const plugin = loadPlugin($app.dao(), key)
        dbg(`Loaded, calling init`)
        plugin.init?.(dao)
        migrateUp(dao, plugin)
      } catch (e) {
        error(`Failed to initialize plugin ${record.key}: ${e}`)
        dbg(e)
      }
    })
  } catch (e) {
    error(`Failed to initialize plugins: ${e}`)
    dbg(e)
  }
}
