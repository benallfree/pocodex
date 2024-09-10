import { info } from 'pocketbase-log'
import { RootCommand } from './RootCommand'

info('Hello from pocodex CLI bootstrap')

export const Init = () => {
  $app.rootCmd.addCommand(RootCommand())
}
