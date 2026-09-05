import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import type { CurrentProgress, ProgressHistory, TimelineData } from './types';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));

async function readJson<T>(relativePath: string): Promise<T> {
  const file = await readFile(`${repoRoot}${relativePath}`, 'utf8');
  return JSON.parse(file) as T;
}

export const loadCurrentProgress = () =>
  readJson<CurrentProgress>('data/current.json');

export const loadProgressHistory = () =>
  readJson<ProgressHistory>('data/history.json');

export const loadTimeline = () =>
  readJson<TimelineData>('data/timeline.json');
