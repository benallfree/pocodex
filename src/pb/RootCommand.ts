import { DisableCommand } from './DisableCommand'
import { EnableCommand } from './EnableCommand'
import { InstallCommand } from './InstallCommand'
import { ListCommand } from './ListCommand'
import { UninstallCommand } from './UninstallCommand'

export const RootCommand = () => {
  const cmd = new Command({
    use: 'x',
    short:
      'pocodex, the unofficial PocketBase Code Exchange: plugins, starter kits, and more',
  })
  cmd.addCommand(InstallCommand())
  cmd.addCommand(EnableCommand())
  cmd.addCommand(DisableCommand())
  cmd.addCommand(UninstallCommand())
  cmd.addCommand(ListCommand())
  return cmd
}
