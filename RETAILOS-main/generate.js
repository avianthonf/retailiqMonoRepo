const { execSync } = require('child_process');
try {
  console.log('Generating Prisma...');
  execSync('node_modules\\.bin\\prisma generate', { stdio: 'inherit' });
  console.log('Done');
} catch (e) {
  console.error(e.message);
  console.error(e.stack);
}
