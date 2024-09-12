import { log } from 'pocketbase-log'
import { version } from '../../package.json'
import { DisableCommand } from './DisableCommand'
import { EnableCommand } from './EnableCommand'
import { InstallCommand } from './InstallCommand'
import { ListCommand } from './ListCommand'
import { UninstallCommand } from './UninstallCommand'

export const logo = () => {
  const logo = `
                           _
                          | |          
 _ __   ___   ___ ___   __| | _____  __
| '_ \\ / _ \\ / __/ _ \\ / _\\ |/ _ \\ \\/ /
| |_) | (_) | (_| (_) | (_| |  __/>  < 
| .__/ \\___/ \\___\\___/ \\__,_|\\___/_/\\_\\
| |                                    
|_|                      pocodex v${version}               

the unofficial PocketBase Code Exchange
    plugins, starter kits, and more
                        
  `
  log(logo)
}

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
