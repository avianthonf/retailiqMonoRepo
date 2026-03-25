const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('c:', 'Users', 'nathan', 'Documents', 'website build with claude', 'retailos');
process.chdir(targetDir);

console.log('Current working directory:', process.cwd());

try {
  if (fs.existsSync('prisma/schema.prisma')) {
    console.log('Schema found at:', path.resolve('prisma/schema.prisma'));
    console.log('Running npx prisma generate...');
    // Use --no-install to avoid y/n prompt if it's already there
    const out = execSync('npx prisma generate', { stdio: 'inherit', encoding: 'utf8' });
    console.log('Output:', out);
  } else {
    console.error('Schema NOT found in', process.cwd());
  }
} catch (e) {
  console.error('Execution failed:', e.message);
}
