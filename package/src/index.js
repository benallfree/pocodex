console.log('Hello from PocketBase Codex bootstrap')

$app.rootCmd.addCommand(
  new Command({
    use: 'codex',
    run: (cmd, args) => {
      console.log('Hello from codex command!')
    },
  })
)
