import { info } from 'pocketbase-log'
import { RootCommand } from './RootCommand'

info('Hello from pocodex CLI bootstrap')

$app.rootCmd.addCommand(RootCommand())
