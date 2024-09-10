import { InstallCommand } from './InstallCommand'
import { EnableCommand } from './EnableCommand'
import { DisableCommand } from './DisableCommand'
import { UninstallCommand } from './UninstallCommand'
import { ListCommand } from './ListCommand'

export const RootCommand = () => {
  const cmd = new Command({
    use: 'pocodex',
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
