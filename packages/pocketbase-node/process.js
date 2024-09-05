const cwd = () => $os.getwd()

module.exports = { ...process, cwd }
