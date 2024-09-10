export type MigrationFunction = (db: dbx.Builder) => void
export type MigrationSet = { up: MigrationFunction; down: MigrationFunction }
export type PluginConfig = {
  migrate: (up: MigrationFunction, down: MigrationFunction) => MigrationSet
}

export type Plugin = {
  init(): void
  hooks(): void
  install(): void
  uninstall(): void
  files(): Record<string, string>
  migrations(): { [migrationName: string]: MigrationSet }
}
export type PluginModuleFactory = (config: PluginConfig) => Plugin
