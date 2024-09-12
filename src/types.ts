import { WritableDraft } from 'immer'
import * as log from 'pocketbase-log'

export type SettingsCreator<T> = () => T
export type SettingsUpdater<T> = (value: WritableDraft<T>) => void

export type MigrationFunction = (db: dbx.Builder) => void
export type MigrationSet = { up: MigrationFunction; down: MigrationFunction }
export type PluginConfig = {
  migrate: (up: MigrationFunction, down: MigrationFunction) => MigrationSet
  log: typeof log
  store: <T>(
    key: string,
    updater?: SettingsUpdater<T>,
    creator?: SettingsCreator<T>
  ) => T | null
}

export type Plugin = {
  init?(dao: daos.Dao): void
  install?(dao: daos.Dao): void
  uninstall?(dao: daos.Dao): void
  files?(dao: daos.Dao): Record<string, string>
  migrations?(): { [migrationName: string]: MigrationSet }
}
export type PluginConfigured = Plugin & { name: string }

export type PluginFactory = (config: PluginConfig) => Plugin

export type PluginMeta = {
  migrations: string[]
}
