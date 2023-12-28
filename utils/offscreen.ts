import * as fs from 'fs';
import { resolve } from 'path';

export const getOffscreenFiles = (offscreenDir: string, map) => {
  if (!fs.existsSync(offscreenDir)) return;

  const files = fs.readdirSync(offscreenDir);
  files.forEach((file) => {
    const name = file.split('.')[0];
    map[`offscreen-${name}`] = resolve(offscreenDir, file, 'index.html');
  });
  return map;
}