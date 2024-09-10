import { dbg, info, error } from 'pocketbase-log'
import { getPackageManager, installPackage } from '../lib/pm'
import { Plugin } from '../types'

dbg('Hello from PocketBase Codex bootstrap')

const cmd = new Command({
  use: 'pocodex',
  short: 'Access the pocodex, the Unofficial PocketBase Codex',
})

const initPluginMeta = (dao, name) => {
  const collection = dao.findCollectionByNameOrId('codex')
  const record = new Record(collection, {
    key: name,
    value: { migrations: {} },
  })
  dao.saveRecord(record)
}

const updatePluginMeta = (txDao, pluginName, update) => {
  dbg(`***updatePluginMeta`, { pluginName })
  const record = txDao.findFirstRecordByData('codex', 'key', pluginName)
  update(record)
  txDao.saveRecord(record)
}

const migrateUp = (dao, plugin: Plugin) => {
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

cmd.addCommand(
  new Command({
    use: 'install [name]',
    short: 'i',
    run: (cmd, args) => {
      const pluginName = args.shift()
      if (!pluginName) {
        throw new Error('Plugin name is required')
      }
      // dbg({ cmd, name, args })

      $app.dao().db().newQuery(`delete from codex`).execute()
      $app
        .dao()
        .db()
        .newQuery(`delete from _collections where name = 'plugin-otp-tokens'`)
        .execute()
      $app.dao().db().newQuery(`drop table 'plugin-otp-tokens'`).execute()

      const packageManager = getPackageManager()

      try {
        $app.dao().runInTransaction((txDao) => {
          const output = installPackage(packageManager, pluginName)
          info(output)
          initPluginMeta(txDao, pluginName)
          const pluginModule = require(pluginName)((up, down) => ({
            up,
            down,
          }))
          pluginModule.name = pluginName
          // dbg({ pluginModule })
          migrateUp(txDao, pluginModule)
        })
      } catch (e) {
        error(`Failed to install package ${pluginName}: ${e}`)
        error(e.stack)
      }

      dbg('Hello from codex install command!')
    },
  })
)

cmd.addCommand(
  new Command({
    use: 'enable [name]',
    args: (cmd, args) => {
      if (args.length < 1) {
        throw new Error('Enable the plugin')
      }
    },
    short: 'e',
    run: (cmd, args) => {
      dbg('Hello from codex enable command!')
    },
  })
)

cmd.addCommand(
  new Command({
    use: 'disable [name]',
    args: (cmd, args) => {
      if (args.length < 1) {
        throw new Error('Disable the plugin')
      }
    },
    short: 'd',
    run: (cmd, args) => {
      dbg('Hello from codex disable command!')
    },
  })
)

cmd.addCommand(
  new Command({
    use: `uninstall [name]`,
    run: (cmd, args) => {
      dbg(`Hello from codex uninstall command!`)
    },
  })
)

// let listGlobal = false
// const listCommand = new Command({
//   use: `list`,
//   short: 'ls',

//   run: (cmd, args) => {
//     dbg(`Hello from codex list command!`, { listGlobal })
//   },
// })
// listCommand.flags().boolVar(listGlobal, 'global', 'g', 'List global plugins')
// cmd.addCommand(listCommand)

$app.rootCmd?.addCommand(cmd)
