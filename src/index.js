/// <reference path="../jsvm.d.ts" />

const {
  log: { dbg, error, info },
  fs,
  path,
  process,
  child_process,
} = require(`pocketbase-node`)
const { getPackageManager, installPackage } = require('./pm')

dbg('Hello from PocketBase Codex bootstrap')

const cmd = new Command({
  use: 'codex',
})

const initPluginMeta = (dao, name) => {
  const collection = dao.findCollectionByNameOrId('codex')
  const record = new Record(collection, {
    key: name,
    value: { migrations: {} },
  })
  dao.saveRecord(record)
}

updatePluginMeta = (txDao, pluginName, update) => {
  dbg(`***updatePluginMeta`, { pluginName })
  const record = txDao.findFirstRecordByData('codex', 'key', pluginName)
  update(record)
  txDao.saveRecord(record)
}

const migrateUp = (dao, pluginModule) => {
  const migrations = pluginModule.migrations()

  for (const [migrationName, { up, down }] of Object.entries(migrations)) {
    dbg(`Running migration ${migrationName}`)
    up(dao.db())
    updatePluginMeta(dao, pluginModule.name, (meta) => ({
      ...meta,
      migrations: { ...meta.migrations, [migrationName]: true },
    }))
  }
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

onAfterBootstrap((e) => {
  const {
    log: { dbg },
  } = require(`pocketbase-node`)
  dbg('Hello from PocketBase Codex after bootstrap')
})
