import { error, dbg, warn } from 'pocketbase-log'
try {
  dbg(`pocodex bootstrap`)
  dbg(`loading CLI`)
  require('pocodex/dist/pb').Init()
  dbg('pocodex loaded')
} catch (e) {
  warn(`WARNING: pocodex not loaded: ${e}`)
  warn(e.stack)
}
