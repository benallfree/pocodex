module.exports = (context) => {
  return {
    version: require(`${__hooks}/../package.json`).version,
  }
}
