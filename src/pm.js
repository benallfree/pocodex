const { path, fs, child_process, process } = require('pocketbase-node')
const { error, dbg } = require('pocketbase-node/log')

function getPackageManager() {
  const lockFiles = {
    'package-lock.json': 'npm',
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm',
    'bun.lockb': 'bun',
  }

  for (const [file, manager] of Object.entries(lockFiles)) {
    const lockFile = path.join(process.cwd(), file)
    // dbg(`Searching for ${lockFile}`)
    if (fs.existsSync(lockFile)) {
      return manager
    }
  }

  return `npm` // No lock file found
}

function installPackage(manager, packageName) {
  const command =
    manager === 'npm'
      ? `npm install ${packageName}`.split(' ')
      : manager === 'yarn'
      ? `yarn add ${packageName}`.split(' ')
      : manager === 'pnpm'
      ? `pnpm add ${packageName}`.split(' ')
      : manager === 'bun'
      ? `bun add ${packageName}`.split(' ')
      : null

  if (!command) {
    error('Unsupported package manager')
    return
  }

  const output = child_process.execSync(command)
  return output
}

module.exports = {
  getPackageManager,
  installPackage,
}
