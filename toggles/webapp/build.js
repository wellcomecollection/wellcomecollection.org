#!/usr/bin/env node
const fs = require('fs');
const toggles = require('./toggles');
const json = JSON.stringify(toggles);

fs.writeFile('toggles.json', json, err => {
  if (err) throw err;
  console.log('Toggles JSONified!');
});
