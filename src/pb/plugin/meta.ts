import { dbg } from 'pocketbase-log'
import { PluginConfigured, PluginMeta } from '../../types'
import {
  SettingsUpdater,
  deleteSettings,
  getSetting,
  getSettings,
  setSetting,
} from './settings'

export const getPluginMetas = (dao: daos.Dao) => {
  return getSettings<PluginMeta>(dao, `pocodex`, `meta`)
}

export const hasPluginMeta = (dao: daos.Dao, name: string) => {
  return !!getSetting<PluginMeta>(dao, `pocodex`, `meta`, name)
}

export const getPluginMeta = (dao: daos.Dao, name: string) => {
  return getSetting<PluginMeta>(
    dao,
    `pocodex`,
    `meta`,
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
    `pocodex`,
    `plugin`,
    plugin.name,
    update,
    newPluginMeta
  )
}

export const deletePluginMeta = (dao: daos.Dao, pluginName: string) => {
  deleteSettings(dao, `pocodex`, `meta`, pluginName)
}

export const initPluginMeta = (dao: daos.Dao, name: string) => {
  dbg(`Initializing plugin meta for ${name}`)
  setSetting<PluginMeta>(
    dao,
    `pocodex`,
    `plugin`,
    name,
    (v) => v,
    newPluginMeta
  )
}
