# Writing Your First Plugin

Follow these steps to create your first pocodex plugin.

## 1. Clone the Minimal Starter Kit

Clone the minimal starter kit using:

```bash
bunx degit benallfree/pocodex/starters/minimal my-plugin
```

Replace `my-plugin` with your desired plugin directory name.

**Note**: If you don't have `degit` installed, you can install it globally:

```bash
npm install -g degit
```

Or use `npx`:

```bash
npx degit benallfree/pocodex/starters/minimal my-plugin
```

## 2. Explore the Starter Kit

The minimal starter kit includes:

- **`src/plugin.ts`**: Defines the plugin metadata, including migrations, file operations, installation, and uninstallation steps.

- **`src/main.ts`**: The main plugin entry point where your custom code goes. You can export multiple entry points if needed.

- **`src/hooks.pb.ts`** _(Optional)_: Use this file if you need to hook into specific PocketBase hooks (useful for low-level operations).

## 3. Develop Your Plugin

The starter kit includes a PocketBase binary as an NPM dependency, allowing you to use development commands:

- **`bun run build`**: Builds your plugin for production.

- **`bun run watch`**: Watches your source files and rebuilds on changes.

- **`bun run dev`**: Starts a PocketBase development server and watches for code changes, reloading as necessary.

Ensure you have [Bun](https://bun.sh/) installed to use these commands.

## 4. Publish Your Plugin

When ready to share your plugin:

1. **Build your plugin**:

   ```bash
   bun run build
   ```

2. **Publish to NPM**:

   ```bash
   npm publish
   ```

## 5. Submit Your Plugin to pocodex

After publishing, visit [pocodex.dev](https://pocodex.dev) to submit your plugin:

- **Prove Repository Ownership**: Follow the instructions to verify ownership of your repository.

- **Automatic Tracking**: pocodex will track your GitHub stars and NPM releases.

- **README Integration**: Your package's README will be automatically pulled and displayed on pocodex.
