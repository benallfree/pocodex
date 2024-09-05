/**
 *
 * @param {string[]} cmdArr This is NONSTANDARD. It is an array of strings that will be joined with spaces to form the command to execute rather than a simple string like nodejs
 * @returns {string}
 */
const execSync = (cmdArr) => {
  // prepare the command to execute
  const _cmd = $os.cmd(...cmdArr)

  // execute the command and return its standard output as string
  const output = String.fromCharCode(..._cmd.output())
  return output
}

module.exports = { execSync }
