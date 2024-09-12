import { log } from 'pocketbase-log'
import { child_process, fs, path, process } from 'pocketbase-node'

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

function installPackage(manager: string, packageSpec: string) {
  const finalPackageName = packageSpec
  const command =
    manager === 'npm'
      ? `npm install ${finalPackageName}`.split(' ')
      : manager === 'yarn'
        ? `yarn add ${finalPackageName}`.split(' ')
        : manager === 'pnpm'
          ? `pnpm add ${finalPackageName}`.split(' ')
          : manager === 'bun'
            ? `bun add ${finalPackageName}`.split(' ')
            : null

  if (!command) {
    throw new Error('Unsupported package manager')
  }

  log(`Running command: ${command.join(' ')}`)
  const output = child_process.execSync(command)
  return output
}

function uninstallPackage(manager: string, packageName: string) {
  const finalPackageName = packageName
  const command =
    manager === 'npm'
      ? `npm remove ${finalPackageName}`.split(' ')
      : manager === 'yarn'
        ? `yarn remove ${finalPackageName}`.split(' ')
        : manager === 'pnpm'
          ? `pnpm remove ${finalPackageName}`.split(' ')
          : manager === 'bun'
            ? `bun remove ${finalPackageName}`.split(' ')
            : null

  if (!command) {
    throw new Error('Unsupported package manager')
  }

  log(`Running command: ${command.join(' ')}`)
  const output = child_process.execSync(command)
  return output
}

export { getPackageManager, installPackage, uninstallPackage }
