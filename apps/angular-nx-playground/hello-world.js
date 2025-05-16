console.log('\n===================================================');
console.log('                  HELLO WORLD                      ');
console.log('===================================================\n');
console.log('Hello from the hello-world.js script!');
console.log('This script runs during both build and serve commands');

if (Math.random() < 0.5) {
  console.error('[HELLO-SCRIPT] ERROR: Random chance (50%) triggered an error! Attempting to stop the process.');
  console.log('===================================================\n');
  process.exit(1); // Exit with a failure code
} else {
  console.log('[HELLO-SCRIPT] LOG: Random chance (50%) allowed script to pass successfully.');
  console.log('===================================================\n');
}

