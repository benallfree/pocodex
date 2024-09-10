/// <reference types="./jsvm" />
/// <reference types="./jsvm-extra" />

export type MigrationFunction = (db: dbx.Builder) => void
export type MigrationSet = { up: MigrationFunction; down: MigrationFunction }
export type PluginConfig = {
  migrate: (up: MigrationFunction, down: MigrationFunction) => MigrationSet
}

export type Plugin = {
  init(): void
  install(): void
  uninstall(): void
  files(): Record<string, string>
  migrations(): { [migrationName: string]: MigrationSet }
}
export type PluginConfigured = Plugin & { name: string }

export type PluginFactory = (config: PluginConfig) => Plugin

export type PluginMeta = {
  migrations: { [migrationName: string]: boolean }
}
