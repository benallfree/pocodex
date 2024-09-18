# Overview

pocodex is a PocketBase plugin architecture and ecosystem. It is a central location where developers can submit and maintain pocodex-compatible plugins that extend the core functionality of PocketBase. pocodex extends the PocketBase CLI, adding commands to manage plugins. These commands are available at the root level and under the `pocodex` namespace, making it easy to manage plugins.

## Installation

To install pocodex, use the following command:

```bash
bunx pocodex init --trust
```

## Usage

Once installed, you can use the `pocketbase` command to manage plugins. For convenience, all plugin management commands are available at the root level and also under the `pocodex` namespace.

- **List all available plugins (global)**:

  ```bash
  pocketbase list --global
  # or
  pocketbase pocodex list --global
  ```

- **List installed plugins**:

  ```bash
  pocketbase list
  # or
  pocketbase pocodex list
  ```

- **Install a plugin**:

  ```bash
  pocketbase install <plugin>
  # or
  pocketbase pocodex install <plugin>
  ```

- **Uninstall a plugin**:

  ```bash
  pocketbase uninstall <plugin>
  # or
  pocketbase pocodex uninstall <plugin>
  ```

- **Search for plugins by keyword**:

  ```bash
  pocketbase search <keyword>
  # or
  pocketbase pocodex search <keyword>
  ```

- **Enable a disabled plugin**:

  ```bash
  pocketbase enable <plugin>
  # or
  pocketbase pocodex enable <plugin>
  ```

- **Disable a plugin without uninstalling**:

  ```bash
  pocketbase disable <plugin>
  # or
  pocketbase pocodex disable <plugin>
  ```

## Creating Plugins

See the [Plugin Authoring Guide](/authoring)
