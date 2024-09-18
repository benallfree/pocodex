# Managing Migrations

When developing plugins for PocketBase using pocodex, managing data and schema changes is crucial. Here's how to handle storage and migrations effectively.

## Volatile vs. Persistent Storage

- **Volatile, Non-Persistent Storage**: Use `$app.store()` from the PocketBase JSVM API for thread-safe global storage that lasts as long as PocketBase is running. You can store any string key/value pairs here.

- **Persistent Storage**: For storage that survives restarts and shutdowns, pocodex provides a `store` object passed to your plugin at startup. It works like `$app.store()` but is persistent across sessions.

## Handling Migrations

If you need actual collections and a 1st class schema:

1. **Create Migrations via PocketBase Admin**: Use the PocketBase admin UI to create your collections and schema. This generates migration files in `pb_migrations`.

2. **Integrate Migrations into Your Plugin**: Instead of distributing the `pb_migrations` files, move the `migrate(...)` commands from these files into the `migrations` array in your plugin's `plugin.ts`.

3. **pocodex Migration Management**: pocodex will manage the application of these migrations during plugin installation, updates, and uninstallation.

### Important Notes

- **Data Loss on Uninstallation**: When a user uninstalls your plugin, pocodex runs the down migrations, which can result in data loss. Persistent storage and metadata are also removed.

## Migration Guidelines

- **Modify Only Your Own Collections**: Never alter collections or tables that don't belong to your plugin.

- **Ensure Backward Compatibility**: Avoid removing old columns or changing column types to incompatible ones. This helps prevent issues during upgrades.

- **Migration Order**: Migrations are applied in the order they appear in your `migrations` array, after the standard PocketBase migrations have run.

- **Uninstallation Process**: During uninstallation, all down migrations are applied to reverse the changes made by your plugin.

- **Avoid User Modifications**: Encourage users not to modify your plugin's tables. Changes made by users can cause conflicts, especially if PocketBase generates migrations for tables that may not exist for others.

By following these practices, you can ensure that your plugin's data management is robust, reversible, and integrates smoothly with PocketBase.
