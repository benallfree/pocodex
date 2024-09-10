#!/usr/bin/env node

export * from './types'

import { Command, program } from 'commander'

program
  .name(`pocodex`)
  .addCommand(new Command(`init`).action(() => console.log(`init`)))

program.parseAsync(process.argv)
