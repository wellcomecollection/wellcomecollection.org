#!/usr/bin/env node

/**
 * Helper script to generate the variant imports for index.tsx
 * Run this after adding your variant JSON files to auto-generate the import code
 */

const fs = require('fs');
const path = require('path');

const variantsDir = path.join(__dirname, 'variants');
const files = fs.readdirSync(variantsDir);

// Find all JSON files in the variants directory
const variantFiles = files.filter(f => f.endsWith('.json')).sort();

if (variantFiles.length === 0) {
  console.log('No variant files found in the variants/ directory.');
  process.exit(1);
}

console.log(`Found ${variantFiles.length} variant files:`);
variantFiles.forEach(f => console.log(`  - ${f}`));
console.log('');

// Generate the import code
console.log('Copy this code into index.tsx (in the variantFiles object):');
console.log('');
console.log('const variantFiles: Record<string, Work[]> = {');

variantFiles.forEach(file => {
  const variantName = file.replace('.json', '');
  console.log(`  "${variantName}": require('./variants/${file}'),`);
});

console.log('};');
console.log('');

// Generate query strings template
console.log('// Optional - add custom queries per variant:');
console.log('const variantQueries: Record<string, string> = {');
variantFiles.forEach(file => {
  const variantName = file.replace('.json', '');
  console.log(`  ${variantName}: 'your search query here',`);
});
console.log('};');
