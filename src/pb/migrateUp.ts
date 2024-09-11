import { dbg, error, warn } from 'pocketbase-log'
import { PluginConfigured } from '../types'
import { getPluginMeta, loadPlugin, updatePluginMeta } from './plugin-helpers'

export const migrateUp = (dao: daos.Dao, plugin: PluginConfigured) => {
  dbg(`Running up migrations for plugin ${plugin.name}`)
  const migrations = plugin.migrations(dao)

  dao.runInTransaction(() => {
    Object.entries(migrations).forEach(([migrationName, migrationSet]) => {
      const { up } = migrationSet
      dbg(`Running migration ${migrationName}`)
      up(dao.db())
      updatePluginMeta(dao, plugin, (meta) => ({
        ...meta,
        migrations: [...meta.migrations, migrationName],
      }))
    })
  })
}

export const migrateDown = (dao: daos.Dao, pluginName: string) => {
  const plugin = loadPlugin(dao, pluginName)
  const migrations = plugin.migrations(dao)

  const meta = getPluginMeta(dao, pluginName)
  dao.runInTransaction(() => {
    dbg(`Running down migrations for plugin ${plugin.name}`)
    meta.migrations.reverse().forEach((migrationName) => {
      const migrationSet = migrations[migrationName]
      if (!migrationSet) {
        warn(`Migration ${migrationName} not found during down migration`)
        return
      }
      dbg(`Running down migration ${migrationName}`)
      const { down } = migrationSet
      dbg(`Running migration ${migrationName}`)
      try {
        down(dao.db())
      } catch (e) {
        error(e)
      }
      dbg(`Removing migration ${migrationName}`)
      updatePluginMeta(dao, plugin, (meta) => ({
        ...meta,
        migrations: meta.migrations.filter((m) => m !== migrationName),
      }))
    })
    dbg(`All down migrations complete for plugin ${plugin.name}`)
    updatePluginMeta(dao, plugin, (meta) => ({
      ...meta,
      migrations: [],
    }))
    dbg(`Plugin ${plugin.name} migrations cleared`)
  })
  dbg(`All down migrations complete for plugin ${plugin.name}`)
}
