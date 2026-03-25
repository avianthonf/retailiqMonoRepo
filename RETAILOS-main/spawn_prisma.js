const { spawn } = require('child_process');
const path = require('path');

const root = __dirname;
const prismaBin = path.join(root, 'node_modules', '.bin', 'prisma.cmd');
const schema = path.join(root, 'prisma', 'schema.prisma');

console.log('--- SPAWN GENERATE ---');
console.log('Root:', root);
console.log('Prisma:', prismaBin);
console.log('Schema:', schema);

const child = spawn(prismaBin, ['generate', '--schema=' + schema], {
  cwd: root,
  stdio: 'inherit'
});

child.on('error', (err) => {
  console.error('Failed to start process:', err);
});

child.on('close', (code) => {
  console.log('Process exited with code:', code);
});
