# File Copying

When developing your plugin, you might need to copy files to specific locations upon installation. pocodex allows you to do this using the `files()` function in your `plugin.ts`. It's important to note that `definePlugin` is a factory function that receives a plugin API.

## Using the `files()` Function

The `files()` function returns an object where each key is the destination path, and each value is the content of the file as a string. Since `definePlugin` is a factory function, it receives the plugin API, which you can use within your plugin definition.

### Example

```typescript
// src/plugin.ts
import myFileContent from './assets/myfile.txt'
export default definePlugin((api) => {
  return {
    // ...other plugin metadata
    files() {
      return {
        'path/to/destination/myfile.txt': myFileContent,
        // Add more files as needed
      }
    },
  }
})
```

In this example:

- **`definePlugin`**: A factory function that receives the plugin API (`api`) and returns the plugin configuration.
- **Destination Path**: `'path/to/destination/myfile.txt'` is where the file will be copied upon plugin installation.
- **File Content**: `myFileContent` is the actual content of the file, imported as a string.

## Importing File Contents

Since everything runs inside an isolated Goja thread, all resources must be bundled within your plugin. To include file contents:

- **Use ES6 Imports**: Import the file content directly into your code.

  ```typescript
  import myFileContent from './assets/myfile.txt'
  ```

- **File Extensions**: Name your files with a `.txt` extension (or configure your bundler accordingly) so pocodex can correctly import and serialize them as strings.

## Important Notes

- **All Content Must Be Bundled**: You cannot read external files at runtime. Everything your plugin needs must be included at build time.

- **Isolated Environment**: The isolated Goja thread can't access files outside the bundle. Ensure all necessary files are imported and included in the `files()` function.

- **Accessing Copied Files**: Once the files are copied to their destinations, you can access them using PocketBase's `$os` file system APIs or other standard methods available in the JSVM.

## Example with Multiple Files

```typescript
// src/plugin.ts
import configContent from './assets/config.txt'
import scriptContent from './assets/script.txt'
export default definePlugin((api) => {
  return {
    // ...other plugin metadata
    files() {
      return {
        'config/config.txt': configContent,
        'scripts/init.txt': scriptContent,
      }
    },
  }
})
```

In this example, two files are specified:

- **`config/config.txt`**: Contains the content from `configContent`.
- **`scripts/init.txt`**: Contains the content from `scriptContent`.

## Summary

- **Define Files in `files()`**: Use the `files()` function within your plugin definition to specify destination paths and file contents.

- **Bundle Everything**: Include all necessary files in your plugin bundle by importing them. This ensures they are accessible within the isolated environment.

- **No External File Access**: Avoid relying on external file paths at runtime; import what you need at build time.

By managing file copying through the `files()` function and correctly using `definePlugin` as a factory function that receives the plugin API, you keep your plugin self-contained and compatible with PocketBase's execution environment.
