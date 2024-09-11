import { dbg, log } from 'pocketbase-log'
import { RootCommand } from './RootCommand'
import { initPlugins } from './plugin/init'
export * as log from 'pocketbase-log'

log('Hello from pocodex CLI bootstrap')

export const Init = () => {
  const { rootCmd } = $app
  if (!rootCmd) {
    throw new Error('Root command not found')
  }
  rootCmd.addCommand(RootCommand())

  onAfterBootstrap((e) => {
    require(`pocodex/dist/pb`).InitPluginsHook(e)
  })
}

export const InitPluginsHook = (e: core.BootstrapEvent) => {
  dbg('InitPluginsHook')
  initPlugins(e.app.dao())
}
