#!/usr/bin/env node
import { execSync } from 'node:child_process';
process.chdir('c:/dentalempireos');
execSync('npm install 2>&1', { stdio: 'inherit', timeout: 120000 });
