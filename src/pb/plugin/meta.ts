import { dbg } from 'pocketbase-log'
import { PluginConfigured, PluginMeta } from '../../types'
import {
  SettingsUpdater,
  deleteSettings,
  getSetting,
  getSettings,
  setSetting,
} from './settings'

export const POCODEX_OWNER = `pocodex`
export const RECORD_TYPE_PLUGIN_META = `plugin`

export const getPluginMetas = (dao: daos.Dao) => {
  return getSettings<PluginMeta>(dao, POCODEX_OWNER, RECORD_TYPE_PLUGIN_META)
}

export const hasPluginMeta = (dao: daos.Dao, name: string) => {
  return !!getSetting<PluginMeta>(
    dao,
    POCODEX_OWNER,
    RECORD_TYPE_PLUGIN_META,
    name
  )
}

export const getPluginMeta = (dao: daos.Dao, name: string) => {
  return getSetting<PluginMeta>(
    dao,
    POCODEX_OWNER,
    RECORD_TYPE_PLUGIN_META,
    name,
    newPluginMeta
  ) as PluginMeta
}

export const newPluginMeta = (): PluginMeta => ({ migrations: [] })

export const setPluginMeta = (
  dao: daos.Dao,
  plugin: PluginConfigured,
  update: SettingsUpdater<PluginMeta>
) => {
  setSetting<PluginMeta>(
    dao,
    POCODEX_OWNER,
    RECORD_TYPE_PLUGIN_META,
    plugin.name,
    update,
    newPluginMeta
  )
}

export const deletePluginMeta = (dao: daos.Dao, pluginName: string) => {
  deleteSettings(dao, POCODEX_OWNER, RECORD_TYPE_PLUGIN_META, pluginName)
}

export const initPluginMeta = (dao: daos.Dao, name: string) => {
  dbg(`Initializing plugin meta for ${name}`)
  setSetting<PluginMeta>(
    dao,
    POCODEX_OWNER,
    RECORD_TYPE_PLUGIN_META,
    name,
    (v) => v,
    newPluginMeta
  )
}
