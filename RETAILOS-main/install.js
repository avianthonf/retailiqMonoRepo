const { execSync } = require('child_process');
try {
  console.log('Running npm install...');
  execSync('npm install --no-fund --no-audit', { stdio: 'inherit' });
  console.log('Finished npm install');
} catch (e) {
  console.error(e);
}
