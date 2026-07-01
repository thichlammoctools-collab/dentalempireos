#!/usr/bin/env node
const { execSync } = require('child_process');
process.chdir('c:/dentalempireos');
execSync('npm install 2>&1', { stdio: 'inherit', timeout: 120000 });
