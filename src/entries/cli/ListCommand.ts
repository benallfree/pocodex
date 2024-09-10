import { dbg } from 'pocketbase-log'

export const ListCommand = () => {
  let listGlobal = false
  const listCommand = new Command({
    use: `list`,
    short: 'ls',

    run: (cmd, args) => {
      dbg(`Hello from pocodex list command!`, { listGlobal })
    },
  })
  listCommand.flags().boolVar(listGlobal, 'global', 'g', 'List global plugins')
  return listCommand
}
