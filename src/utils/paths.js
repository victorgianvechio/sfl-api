import { resolve } from 'path';
import fs from 'fs';

export const ROOT_PATH = resolve(__dirname, '..', '..');
export const PUBLIC_PATH = resolve(ROOT_PATH, 'public');
export const CACHE_PATH = resolve(ROOT_PATH, 'cache');

export function createPublicDir() {
  if (!fs.existsSync(PUBLIC_PATH)) {
    fs.mkdirSync(PUBLIC_PATH);
  }
}

export function createCacheDir() {
  if (!fs.existsSync(CACHE_PATH)) {
    fs.mkdirSync(CACHE_PATH);
  }
}
