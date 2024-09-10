import { dbg } from 'pocketbase-log'
import { PluginConfigured } from '../types'
import { updatePluginMeta } from './pluginMeta'

export const migrateUp = (dao: daos.Dao, plugin: PluginConfigured) => {
  const migrations = plugin.migrations()

  Object.entries(migrations).forEach(([migrationName, migrationSet]) => {
    const { up } = migrationSet
    dbg(`Running migration ${migrationName}`)
    up(dao.db())
    updatePluginMeta(dao, plugin, (meta) => ({
      ...meta,
      migrations: { ...meta.migrations, [migrationName]: true },
    }))
  })
}
