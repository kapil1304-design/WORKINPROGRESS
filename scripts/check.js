import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
for (const directory of ['server', 'web', 'test', 'scripts']) {
  for (const name of readdirSync(directory).filter(name => name.endsWith('.js'))) {
    const result = spawnSync(process.execPath, ['--check', join(directory, name)], { stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status || 1);
  }
}
console.log('All application JavaScript files parsed successfully.');
