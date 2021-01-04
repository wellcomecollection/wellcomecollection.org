#!/usr/bin/env ts-node-script

import fs from 'fs';
import toggles from './toggles';

const json = JSON.stringify(toggles);

fs.writeFile('toggles.json', json, err => {
  if (err) throw err;
  console.log('Toggles JSONified!');
});
