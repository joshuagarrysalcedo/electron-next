#!/usr/bin/env node

/**
 * This script fixes problematic native dependencies for Electron builds.
 * It creates mock modules for native dependencies that cause issues on non-macOS platforms.
 */

const fs = require('fs');
const path = require('path');

function fixIconvCorefoundation() {
  console.log('Creating mock for iconv-corefoundation...');
  
  const nativeJsPath = path.join(process.cwd(), 'node_modules/iconv-corefoundation/lib/native.js');
  const indexJsPath = path.join(process.cwd(), 'node_modules/iconv-corefoundation/lib/index.js');
  
  // Check if the directory exists
  const libDir = path.dirname(nativeJsPath);
  if (!fs.existsSync(libDir)) {
    console.log('iconv-corefoundation not found, skipping.');
    return;
  }
  
  // Create a mock native.js file
  const mockNativeJs = `
// Mock native module for non-macOS platforms
const nativeModule = {
  encodingExists: () => false,
  convert: (str) => Buffer.from(str, 'utf8')
};

module.exports = nativeModule;
`;

  fs.writeFileSync(nativeJsPath, mockNativeJs);
  console.log('Created mock native.js for iconv-corefoundation');
  
  // Check if we need to modify the index.js file
  if (fs.existsSync(indexJsPath)) {
    const indexContent = fs.readFileSync(indexJsPath, 'utf8');
    
    // Only modify if it hasn't been patched already
    if (indexContent.includes('require("./native")') && !indexContent.includes('try {')) {
      const patchedIndex = indexContent.replace(
        'const native = require("./native");',
        `let native;
try {
  native = require("./native");
} catch (err) {
  // Fallback for non-macOS platforms
  native = {
    encodingExists: () => false,
    convert: (str) => Buffer.from(str, 'utf8')
  };
}`
      );
      
      fs.writeFileSync(indexJsPath, patchedIndex);
      console.log('Patched index.js for iconv-corefoundation');
    }
  }
}

function fixDependencies() {
  console.log('Fixing dependencies for Electron build...');
  
  // Fix iconv-corefoundation
  fixIconvCorefoundation();
  
  console.log('Dependencies fixed successfully!');
}

// Run the function
fixDependencies();
