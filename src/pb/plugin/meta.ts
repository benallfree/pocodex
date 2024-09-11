import { WritableDraft } from 'immer'
import { dbg } from 'pocketbase-log'
import { PluginConfigured, PluginMeta } from '../../types'
import {
  TrustedSettingsUpdater,
  deleteSettings,
  getSetting,
  getSettings,
  setSetting,
} from './settings'

export const getPluginMetas = (dao: daos.Dao) => {
  return getSettings<PluginMeta>(dao, `pocodex`, `meta`)
}

export const getPluginMeta = (dao: daos.Dao, name: string) => {
  return getSetting<PluginMeta>(dao, `pocodex`, `meta`, name)
}

export const setPluginMeta = (
  dao: daos.Dao,
  plugin: PluginConfigured,
  update: TrustedSettingsUpdater<PluginMeta>
) => {
  setSetting<PluginMeta>(
    dao,
    `pocodex`,
    `plugin`,
    plugin.name,
    (untrustedMeta) => {
      if (!untrustedMeta.migrations) {
        untrustedMeta.migrations = []
      }
      update(untrustedMeta as WritableDraft<PluginMeta>)
    }
  )
}

export const deletePluginMeta = (dao: daos.Dao, pluginName: string) => {
  deleteSettings(dao, `pocodex`, `meta`, pluginName)
}

export const initPluginMeta = (dao: daos.Dao, name: string) => {
  dbg(`Initializing plugin meta for ${name}`)
  setSetting<PluginMeta>(dao, `pocodex`, `plugin`, name, (currentValue) => {
    return { migrations: [] }
  })
}
