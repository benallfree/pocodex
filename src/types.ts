/// <reference types="./jsvm" />
/// <reference types="./jsvm-extra" />
import * as log from 'pocketbase-log'

export type MigrationFunction = (db: dbx.Builder) => void
export type MigrationSet = { up: MigrationFunction; down: MigrationFunction }
export type PluginConfig = {
  migrate: (up: MigrationFunction, down: MigrationFunction) => MigrationSet
  log: typeof log
}

export type Plugin = {
  init(dao: daos.Dao): void
  install(dao: daos.Dao): void
  uninstall(dao: daos.Dao): void
  files(dao: daos.Dao): Record<string, string>
  migrations(dao: daos.Dao): { [migrationName: string]: MigrationSet }
}
export type PluginConfigured = Plugin & { name: string }

export type PluginFactory = (config: PluginConfig) => Plugin

export type PluginMeta = {
  migrations: string[]
}
