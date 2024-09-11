import * as log from 'pocketbase-log'
import { dbg, error, info } from 'pocketbase-log'
import { stringify } from 'pocketbase-stringify'
import { PluginConfigured, PluginFactory, PluginMeta } from '../types'
import { migrateDown, migrateUp } from './migrateUp'
import { getPackageManager, installPackage } from './PackageManager'

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

export const initPluginMeta = (dao: daos.Dao, name: string, force = false) => {
  dbg(`Initializing plugin meta for ${name}`)
  const collection = dao.findCollectionByNameOrId('pocodex')
  const meta: PluginMeta = { migrations: [] }
  const record = new Record(collection, {
    key: name,
    value: meta,
  })
  dbg(`Saving plugin meta for ${name}`, record)
  dao.saveRecord(record)
}

export const updatePluginMeta = (
  dao: daos.Dao,
  plugin: PluginConfigured,
  update: (meta: PluginMeta) => PluginMeta
) => {
  const { name } = plugin
  dbg(`Updating plugin meta for ${name}`)
  const record = dao.findFirstRecordByData('pocodex', 'key', name)
  if (!record) {
    throw new Error(`Plugin meta not found for ${name}`)
  }
  const updatedMeta = update(JSON.parse(record.get(`value`)))
  dbg(`Updated meta`, { updatedMeta })
  record.set(`value`, stringify(updatedMeta))
  dbg(`Saving plugin meta for ${name}`)
  dao.saveRecord(record)
}

export const getPluginMeta = (dao: daos.Dao, name: string): PluginMeta => {
  dbg(`Getting plugin meta for ${name}`)
  const record = dao.findFirstRecordByData('pocodex', 'key', name)
  dbg(`Found record`, { record })
  if (!record) {
    throw new Error(`Plugin meta not found for ${name}`)
  }
  return JSON.parse(record.get(`value`))
}

export const deletePluginMeta = (dao: daos.Dao, pluginName: string) => {
  dbg(`Deleting plugin meta for ${pluginName}`)
  const record = dao.findFirstRecordByData('pocodex', 'key', pluginName)
  dbg(`Found record`, { record })
  dao.deleteRecord(record)
  dbg(`Deleted plugin meta for ${pluginName}`)
}

export const uninstallPlugin = (dao: daos.Dao, pluginName: string) => {
  dao.runInTransaction((txDao) => {
    migrateDown(txDao, pluginName)
    deletePluginMeta(txDao, pluginName)
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
    dbg(`Plugin meta found`, {
      meta: !!meta,
      force: force,
      notForce: !force,
      forceType: typeof force,
      shouldBlock,
    })
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
  const result = arrayOf(
    new DynamicModel({
      key: '',
      value: {},
    })
  ) as { key: string; value: string }[]

  try {
    $app.dao().db().newQuery('SELECT key,value from pocodex').all(result)

    result.forEach((record) => {
      const pluginName = record.key
      const meta = JSON.parse(record.value)
      const plugin = loadPlugin($app.dao(), pluginName)
      plugin.init($app.dao())
      if (meta.migrations.length > 0) {
        migrateUp($app.dao(), plugin)
      }
    })
  } catch (e) {
    error(`Failed to initialize plugins: ${e}`)
  }
}
