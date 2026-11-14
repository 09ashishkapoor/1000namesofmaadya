// Injects the shared names dataset into the three direction prototypes.
import { readFileSync, writeFileSync } from 'node:fs';

const names = readFileSync('_tools/names.js', 'utf8');
for (const f of ['dir-1.html', 'dir-2.html', 'dir-3.html']) {
  try {
    const src = readFileSync(f, 'utf8');
    if (!src.includes('/*__NAMES__*/')) { console.log('skip (no marker):', f); continue; }
    writeFileSync(f, src.replace('/*__NAMES__*/', names), 'utf8');
    console.log('injected:', f, '→', names.length, 'chars');
  } catch (e) {
    console.log('missing:', f);
  }
}
