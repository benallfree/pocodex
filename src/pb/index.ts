import { info } from 'pocketbase-log'
import { RootCommand } from './RootCommand'
import { initPlugins } from './plugin-helpers'

info('Hello from pocodex CLI bootstrap')

export const Init = () => {
  const { rootCmd } = $app
  if (!rootCmd) {
    throw new Error('Root command not found')
  }
  rootCmd.addCommand(RootCommand())

  initPlugins($app.dao())
}
