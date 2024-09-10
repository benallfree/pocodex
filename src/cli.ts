#!/usr/bin/env node

export * from './types'

import { Command, program } from 'commander'

program
  .name(`pocodex`)
  .addCommand(new Command(`init`).action(() => console.log(`init`)))
  .addCommand(new Command(`build`).action(() => console.log(`run`)))
  .addCommand(new Command(`watch`).action(() => console.log(`run`)))

program.parseAsync(process.argv)
