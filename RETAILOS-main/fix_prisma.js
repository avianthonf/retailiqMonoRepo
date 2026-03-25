const { execSync } = require('child_process');
const path = require('path');

const root = __dirname;
const prismaBin = path.join(root, 'node_modules', '.bin', 'prisma.cmd');
const schema = path.join(root, 'prisma', 'schema.prisma');

console.log('Root:', root);
console.log('Prisma Bin:', prismaBin);
console.log('Schema:', schema);

try {
  console.log('Running prisma generate...');
  const output = execSync(`"${prismaBin}" generate --schema="${schema}"`, { 
    encoding: 'utf8',
    cwd: root 
  });
  console.log('SUCCESS:');
  console.log(output);
} catch (e) {
  console.error('FAILURE:');
  console.error(e.message);
  if (e.stdout) console.log('STDOUT:', e.stdout);
  if (e.stderr) console.error('STDERR:', e.stderr);
}
