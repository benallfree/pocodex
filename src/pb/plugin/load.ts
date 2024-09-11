import * as log from 'pocketbase-log'
import { PluginConfigured, PluginFactory } from '../../types'
import { getSetting, setSetting } from './settings'

export const loadPlugin = (txDao: daos.Dao, pluginName: string) => {
  const configuredModule = loadPluginSafeMode(txDao, pluginName)
  configuredModule.init(txDao)
  return configuredModule
}

export const loadPluginSafeMode = (txDao: daos.Dao, pluginName: string) => {
  const module = require(`${pluginName}/dist/plugin`)
  const factory = (module.default || module.plugin || module) as PluginFactory
  if (typeof factory !== 'function') {
    throw new Error(`Plugin ${pluginName} does not export a factory function`)
  }
  const pluginModule = factory({
    migrate: (up, down) => ({
      up,
      down,
    }),
    log,
    store: (key, updater, creator) => {
      if (updater) {
        if (!creator) {
          throw new Error(`Updating the store requires a creator function`)
        }
        return setSetting(txDao, pluginName, `setting`, key, updater, creator)
      } else {
        return getSetting(txDao, pluginName, `setting`, key)
      }
    },
  })
  const configuredModule: PluginConfigured = {
    name: pluginName,
    ...pluginModule,
  }
  return configuredModule
}
