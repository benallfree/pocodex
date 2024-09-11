import { forEach } from '@s-libs/micro-dash'
import { WritableDraft } from 'immer'
import * as log from 'pocketbase-log'
import { dbg, error, info, warn } from 'pocketbase-log'
import { PluginConfigured, PluginFactory, PluginMeta } from '../types'
import { getPackageManager, installPackage } from './PackageManager'
import {
  TrustedSettingsUpdater,
  deleteSetting,
  getSetting,
  getSettings,
  setSetting,
} from './settings'

export const migrateUp = (dao: daos.Dao, plugin: PluginConfigured) => {
  dbg(`Running up migrations for plugin ${plugin.name}`)
  const value = getPluginMeta(dao, plugin.name)
  const migrations = plugin.migrations()

  dbg(`Found migrations`, migrations)
  forEach(plugin.migrations(), (migration, name) => {
    dbg(`Checking migration ${name}`)
    if (value?.migrations?.includes(name)) {
      return
    }
    dbg(`Running migration ${name}`)
    dao.runInTransaction((txDao) => {
      dbg(`Running up migration ${name}`)
      migration.up(txDao.db())
      dbg(`Updating meta with migration ${name}`)
      updatePluginMeta(txDao, plugin, (meta) => {
        meta.migrations.push(name)
      })
    })
  })
}

export const migrateDown = (dao: daos.Dao, plugin: PluginConfigured) => {
  dbg(`Running down migrations for plugin ${plugin.name}`)
  const meta = getPluginMeta(dao, plugin.name)
  const migrations = plugin.migrations()

  meta?.migrations?.reverse().forEach((name) => {
    const migration = migrations[name]
    if (!migration) {
      warn(`Migration ${name} not found - skipping downgrade`)
    }
    dbg(`Running down migration ${name}`)
    dao.runInTransaction((txDao) => {
      migration!.down(txDao.db())
      dbg(`Removing migration  ${name} from meta`)
      updatePluginMeta(txDao, plugin, (meta) => {
        meta.migrations = meta.migrations.filter((m) => m !== name)
      })
    })
  })
}

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
  })
  const configuredModule: PluginConfigured = {
    name: pluginName,
    ...pluginModule,
  }
  return configuredModule
}

export const initPluginMeta = (dao: daos.Dao, name: string) => {
  dbg(`Initializing plugin meta for ${name}`)
  setSetting<PluginMeta>(dao, `plugin.meta`, name, (currentValue) => {
    return { migrations: [] }
  })
}

export const updatePluginMeta = (
  dao: daos.Dao,
  plugin: PluginConfigured,
  update: TrustedSettingsUpdater<PluginMeta>
) => {
  setSetting<PluginMeta>(dao, `plugin.meta`, plugin.name, (untrustedMeta) => {
    if (!untrustedMeta.migrations) {
      untrustedMeta.migrations = []
    }
    update(untrustedMeta as WritableDraft<PluginMeta>)
  })
}

export const getPluginMeta = (dao: daos.Dao, name: string) => {
  return getSetting<PluginMeta>(dao, `plugin.meta`, name)
}

export const deletePluginMeta = (dao: daos.Dao, pluginName: string) => {
  deleteSetting(dao, `plugin.meta`, pluginName)
}

export const uninstallPlugin = (dao: daos.Dao, pluginName: string) => {
  const plugin = loadPluginSafeMode(dao, pluginName)
  dao.runInTransaction((txDao) => {
    migrateDown(txDao, plugin)
    deletePluginMeta(txDao, plugin.name)
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
      dbg(`Plugin loaded`, { plugin })

      initPluginMeta(txDao, pluginName)
      migrateUp(txDao, plugin)
    })
  } catch (e) {
    error(`Failed to install package ${pluginName}: ${e}`)
    if (e instanceof Error) {
      error(e.stack)
    }
  }
}

export const initPlugins = (dao: daos.Dao) => {
  dbg(`Initializing plugins`)

  try {
    dbg(`Getting plugin metas`)
    const pluginMetas = getSettings<PluginMeta>(dao, `plugin.meta`)

    dbg(`Plugin metas`, { pluginMetas })

    pluginMetas.forEach((record) => {
      const { key, value } = record
      dbg(`Initializing plugin ${key}`)
      const plugin = loadPlugin($app.dao(), key)
      dbg(`Loaded, calling init`)
      plugin.init(dao)
      migrateUp(dao, plugin)
    })
  } catch (e) {
    error(`Failed to initialize plugins: ${e}`)
    if (e instanceof Error) {
      error(e.stack)
    }
  }
}
