import { log } from 'pocketbase-log'
import { version } from '../../package.json'

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
