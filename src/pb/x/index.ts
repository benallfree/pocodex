import { dbg } from 'pocketbase-log'
import { DisableCommand } from './DisableCommand'
import { EnableCommand } from './EnableCommand'
import { InstallCommand } from './InstallCommand'
import { ListCommand } from './ListCommand'
import { RootCommand } from './RootCommand'
import { UninstallCommand } from './UninstallCommand'
import { initPlugins } from './plugin/init'
export * as log from 'pocketbase-log'

export const Init = () => {
  const { rootCmd } = $app
  if (!rootCmd) {
    throw new Error('Root command not found')
  }
  rootCmd.addCommand(RootCommand())
  rootCmd.addCommand(InstallCommand())
  rootCmd.addCommand(EnableCommand())
  rootCmd.addCommand(DisableCommand())
  rootCmd.addCommand(UninstallCommand())
  rootCmd.addCommand(ListCommand())

  onAfterBootstrap((e) => {
    require(`pocodex/dist/pb`).InitPluginsHook(e)
  })
}

export const InitPluginsHook = (e: core.BootstrapEvent) => {
  dbg('InitPluginsHook')
  initPlugins(e.app.dao())
}
