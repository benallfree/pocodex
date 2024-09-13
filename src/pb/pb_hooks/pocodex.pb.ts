try {
  require('pocodex/dist/pb').Init()
} catch (e) {
  console.log(`WARNING: pocodex not loaded: ${e}`)
  if (e instanceof Error) {
    console.log(e.stack)
  }
}
