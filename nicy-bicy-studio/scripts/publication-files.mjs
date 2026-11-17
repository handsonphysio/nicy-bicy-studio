import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const mode = process.argv[2] || 'list';
const fixed = ['.gitignore', '.github/workflows/deploy.yml', 'README.md', 'nicy-bicy-studio/package.json', 'nicy-bicy-studio/DOMAIN-SETUP.md', 'nicy-bicy-studio/BOOKS.md', 'nicy-bicy-studio/scripts/serve.mjs', 'nicy-bicy-studio/scripts/publication-files.mjs'];
async function walk(relative) {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const file = `${relative}/${entry.name}`;
    if (entry.isDirectory()) return walk(file);
    if (!entry.isFile() || entry.name.startsWith('_')) return [];
    return [file];
  }));
  return nested.flat();
}
const files = [...fixed, ...await walk('nicy-bicy-studio/dist')].sort();
const binary = (file) => /\.(?:woff2|png|ico)$/i.test(file);
if (mode === 'list') process.stdout.write(JSON.stringify(files));
else if (mode === 'text') {
  const entries = await Promise.all(files.filter((file) => !binary(file)).map(async (file) => ({path:file, mode:'100644', type:'blob', content:await readFile(path.join(root,file),'utf8')})));
  process.stdout.write(JSON.stringify(entries));
} else if (mode === 'binary-list') process.stdout.write(JSON.stringify(files.filter(binary)));
else if (files.includes(mode) && binary(mode)) {
  const content = (await readFile(path.join(root,mode))).toString('base64');
  const offset = process.argv[3] === undefined ? 0 : Number(process.argv[3]);
  const length = process.argv[4] === undefined ? content.length : Number(process.argv[4]);
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(length) || length < 1) throw new Error('Invalid binary chunk range.');
  process.stdout.write(content.slice(offset, offset + length));
}
else throw new Error('Unknown publication input.');
