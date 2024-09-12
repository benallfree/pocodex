import { forEach, keys } from '@s-libs/micro-dash'
import { dbg, log, warn } from 'pocketbase-log'
import { PluginConfigured } from '../../../types'
import { getPluginMeta, setPluginMeta } from './meta'

export const migrateUp = (dao: daos.Dao, plugin: PluginConfigured) => {
  log(`Running up migrations for plugin ${plugin.name}`)
  const value = getPluginMeta(dao, plugin.name)
  const migrations = plugin.migrations?.()

  dbg(`Found migrations:`, keys(migrations))
  forEach(migrations, (migration, name) => {
    dbg(`Checking migration ${name}`)
    if (value.migrations.includes(name)) {
      dbg(`Skipping migration ${name} because it has already been applied`)
      return
    }
    log(`Running migration ${name}`)
    dao.runInTransaction((txDao) => {
      dbg(`Running up migration ${name}`)
      migration.up(txDao.db())
      dbg(`Updating meta with migration ${name}`)
      setPluginMeta(txDao, plugin, (meta) => {
        dbg(`Adding migration ${name} to meta`, { meta })
        meta.migrations.push(name)
      })
    })
  })
}

export const migrateDown = (dao: daos.Dao, plugin: PluginConfigured) => {
  dbg(`Running down migrations for plugin ${plugin.name}`)
  const meta = getPluginMeta(dao, plugin.name)
  const migrations = plugin.migrations?.()

  meta?.migrations?.reverse().forEach((name) => {
    const migration = migrations?.[name]
    if (!migration) {
      warn(`Migration ${name} not found - skipping downgrade`)
    }
    dbg(`Running down migration ${name}`)
    dao.runInTransaction((txDao) => {
      migration!.down(txDao.db())
      dbg(`Removing migration  ${name} from meta`)
      setPluginMeta(txDao, plugin, (meta) => {
        meta.migrations = meta.migrations.filter((m) => m !== name)
      })
    })
  })
}
