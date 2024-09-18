# Introduction to pocodex Plugin Authoring

Developing plugins for PocketBase doesn't have to be a headache. If you've ever tried extending PocketBase using JavaScript hooks directly—working "against the bare metal"—you know it can be painful. Regular migrations and hook files get scattered all over, making your project messy and hard to uninstall. But there's a better way.

## Why Choose pocodex?

- **Simplify Development**: pocodex abstracts away the quirks of PocketBase's JSVM environment, which isn't your typical browser or Node.js setup. No need to wrestle with bundling code for isolated Goja threads; pocodex handles it for you.

- **Reversible and Composable**: Install, upgrade, disable, or uninstall plugins with ease. pocodex keeps everything organized, so changes are clean and reversible—unlike manual hook files that spread across your project.

- **No Recompilation Needed**: Extend PocketBase using JavaScript hooks without diving into Golang extensions or recompiling the entire application. Share your plugins effortlessly, and users can benefit without custom builds.

- **All-in-One Management**: Manage file copying, removal, and access a persistent key/value store that might eliminate the need for migrations altogether. It's all streamlined within the plugin architecture.

- **Optimized Build System**: Let pocodex handle bundling and loading, so you can focus on writing code instead of managing build processes.

- **TypeScript-First Approach**: Enjoy type safety and a better developer experience with pocodex's TypeScript-friendly design.

- **Easy Distribution**: Publish your plugins as standard NPM packages and list them in the pocodex directory for others to discover.

- **Starter Kit Available**: Get up and running quickly with a starter kit that demonstrates all the features and best practices.
