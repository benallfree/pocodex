#!/bin/bash
set -x
clear
rm -rf pb_* bun.logb
pocketbase  --dev
bun add pocodex@link:pocodex --verbose
./node_modules/.bin/pocodex init --link
ls -lah node_modules
ls -lah node_modules/.bin
pocketbase migrate
pocketbase x  --dev
pocketbase x install pocketbase-otp@link:pocketbase-otp --dev
ls -lah node_modules
