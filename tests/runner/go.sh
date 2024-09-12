#!/bin/bash
set -x
clear
rm -rf pb_* bun.logb
pocketbase 
bun add pocodex@link:pocodex --verbose
./node_modules/.bin/pocodex init --link
ls -lah node_modules
ls -lah node_modules/.bin
pocketbase migrate
pocketbase x 
pocketbase x install pocketbase-otp@link:pocketbase-otp
ls -lah node_modules
pocketbase x install pocketbase-otp@link:pocketbase-otp
pocketbase x install pocketbase-otp@link:pocketbase-otp --force
pocketbase x uninstall pocketbase-otp