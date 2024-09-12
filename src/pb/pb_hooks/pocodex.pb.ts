import { log } from 'pocketbase-log'

try {
  log(`pocodex bootstrap`)
  log(`loading CLI`)
  require('pocodex/dist/pb').Init()
  log('pocodex loaded')
} catch (e) {
  log(`WARNING: pocodex not loaded: ${e}`)
  log(e)
}
