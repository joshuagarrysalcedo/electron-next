#!/usr/bin/env node

/**
 * This script patches the dmg-license module to work on non-macOS platforms
 */

const fs = require('fs');
const path = require('path');

// Paths to the files we need to patch
const labelsPath = path.join(process.cwd(), 'node_modules/dmg-license/lib/Labels.js');
const assembleLicensesPath = path.join(process.cwd(), 'node_modules/dmg-license/lib/assembleLicenses.js');

function patchLabelsFile() {
  if (!fs.existsSync(labelsPath)) {
    console.log('Labels.js file not found, skipping patch');
    return;
  }

  let content = fs.readFileSync(labelsPath, 'utf8');
  
  // Replace the iconv-corefoundation import with a conditional import
  content = content.replace(
    "const IconvLite = require('iconv-corefoundation');",
    "// Skip iconv-corefoundation import on non-macOS platforms\nconst IconvLite = process.platform === 'darwin' ? require('iconv-corefoundation') : { encodingExists: () => false, convert: (str) => Buffer.from(str, 'utf8') };"
  );
  
  fs.writeFileSync(labelsPath, content);
  console.log('Patched Labels.js successfully');
}

function patchAssembleLicensesFile() {
  if (!fs.existsSync(assembleLicensesPath)) {
    console.log('assembleLicenses.js file not found, skipping patch');
    return;
  }

  let content = fs.readFileSync(assembleLicensesPath, 'utf8');
  
  // Replace the iconv-corefoundation import with a conditional import
  content = content.replace(
    "const { encodingExists } = require('iconv-corefoundation');",
    "// Skip iconv-corefoundation import on non-macOS platforms\nlet encodingExists = () => false;\n\n// Only attempt to load on macOS\nif (process.platform === 'darwin') {\n  try {\n    ({ encodingExists } = require('iconv-corefoundation'));\n  } catch (e) {}\n}"
  );
  
  fs.writeFileSync(assembleLicensesPath, content);
  console.log('Patched assembleLicenses.js successfully');
}

// Run both patches
try {
  patchLabelsFile();
  patchAssembleLicensesFile();
  console.log('dmg-license patching completed successfully');
} catch (error) {
  console.error('Error patching dmg-license:', error);
  process.exit(1);
}
