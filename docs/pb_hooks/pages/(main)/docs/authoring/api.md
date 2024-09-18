# Plugin API Guide

Understanding the plugin API is essential for developing effective pocodex plugins. This guide explains the core components of the plugin API, how to structure your `plugin.ts`, and the reasoning behind passing the `Dao` instance to plugin functions.

## Plugin Structure

Your `plugin.ts` file must default export a **PluginFactory**. This factory function receives a **PluginConfig** object and returns a **Plugin** object with optional lifecycle methods and configurations.

### Example Structure

```typescript
// src/plugin.ts
export default definePlugin((config: PluginConfig) => {
  return {
    // Plugin methods and properties
  }
})
```

## Type Definitions

Here are the key type definitions used in the plugin API.

### `PluginFactory`

A factory function that receives a **PluginConfig** and returns a **Plugin**.

```typescript
export type PluginFactory = (config: PluginConfig) => Plugin
```

### `PluginConfig`

Provides utilities and functions to the plugin during initialization.

```typescript
export type PluginConfig = {
  migrate: (up: MigrationFunction, down: MigrationFunction) => MigrationSet
  log: typeof log
  store: <T>(
    key: string,
    updater?: SettingsUpdater<T>,
    creator?: SettingsCreator<T>
  ) => T | null
}
```

- **`migrate`**: Function to define migrations.
- **`log`**: Logging utilities.
- **`store`**: Access to persistent key/value storage.

### `Plugin`

An object that defines your plugin's lifecycle methods and configurations.

```typescript
export type Plugin = {
  init?(dao: daos.Dao): void
  install?(dao: daos.Dao): void
  uninstall?(dao: daos.Dao): void
  files?(): Record<string, string>
  migrations?(): { [migrationName: string]: MigrationSet }
}
```

- **`init`**: Called when the plugin is initialized.
- **`install`**: Called when the plugin is installed.
- **`uninstall`**: Called when the plugin is uninstalled.
- **`files`**: Defines files to copy upon installation.
- **`migrations`**: Defines database migrations.

### `MigrationFunction` and `MigrationSet`

Used to define database migrations.

```typescript
export type MigrationFunction = (db: dbx.Builder) => void
export type MigrationSet = { up: MigrationFunction; down: MigrationFunction }
```

- **`up`**: Function to apply the migration.
- **`down`**: Function to revert the migration.

## Passing `Dao` to Plugin Functions

The `dao: daos.Dao` parameter is passed to each plugin function (`init`, `install`, `uninstall`, etc.) instead of being part of the `PluginConfig`. This design allows the plugin functions to operate within the context of a transaction if necessary. By providing the `Dao` instance at the time of calling, your plugin can perform database operations safely within transactions.

### Example Usage

```typescript
export default definePlugin((config: PluginConfig) => {
  return {
    install(dao: daos.Dao) {
      // Perform installation logic using the dao instance
    },
    uninstall(dao: daos.Dao) {
      // Perform uninstallation logic using the dao instance
    },
  }
})
```

## Detailed Explanation

### Plugin Lifecycle Methods

- **`init(dao)`**: Called when the plugin is initialized. Use this to set up any necessary state.
- **`install(dao)`**: Called when the plugin is installed. Perform setup tasks, such as creating default data.
- **`uninstall(dao)`**: Called when the plugin is uninstalled. Clean up any data or state to prevent leftovers.
- **`files()`**: Return an object mapping destination paths to file contents. Used to copy files during installation.
- **`migrations()`**: Return an object mapping migration names to `MigrationSet`s. Used to manage database schema changes.

### Persistent Storage with `store`

The `store` function in `PluginConfig` provides access to persistent key/value storage that survives restarts and shutdowns. When setting a value, the `store` function operates within a transaction. It passes the current settings as a **mutable draft** to the updater function. This means you can modify the draft directly, and your changes will be safely committed. This approach ensures thread safety and data integrity, which is why you use a mutator function instead of a standard assignment.

#### Setting a Value

```typescript
config.store(
  'myKey',
  (draft) => {
    // Modify the draft as needed
    draft.someProperty = 'newValue'
  },
  () => ({
    // Default value if the key doesn't exist
    someProperty: 'defaultValue',
  })
)
```

- **`key`**: The key for the stored value.
- **`updater`**: A function that receives the current value (as a mutable draft) and allows you to modify it. The changes you make to the draft happen within a transaction.
- **`creator`**: A function that provides a default value if the key doesn't exist.

#### Getting a Value

```typescript
const value = config.store('myKey')
```

- If you call `store` with only the key, it returns the current value associated with that key, or `null` if it doesn't exist.

**Note**: Using a mutator function ensures that changes to the store are made atomically within a transaction, preventing race conditions and ensuring data consistency across threads.

### Managing Migrations

Use the `migrate` function from `PluginConfig` to define your migrations.

```typescript
export default definePlugin((config: PluginConfig) => {
  return {
    migrations() {
      return {
        create_users_table: config.migrate(
          (db) => {
            // Up migration: create table
          },
          (db) => {
            // Down migration: drop table
          }
        ),
      }
    },
  }
})
```

- **`config.migrate(up, down)`**: Creates a `MigrationSet` with `up` and `down` functions.
- **`db`**: A database builder for executing migration commands.

### Logging with `log`

Use `config.log` for logging within your plugin.

```typescript
export default definePlugin((config: PluginConfig) => {
  return {
    init() {
      config.log.info('Plugin initialized')
    },
  }
})
```

### File Operations with `files`

Define files to be copied during installation.

```typescript
import configFile from './config.txt'
export default definePlugin(() => {
  return {
    files() {
      return {
        'config/config.txt': configFile,
      }
    },
  }
})
```

- **Destination Path**: The key in the returned object.
- **File Content**: The value, usually imported as a string.
