import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import type { RequestEvent } from '../$types';
import { GET } from './+server';

const defaultThemes = vi.hoisted(() => ({}));
let setThemes : ((value : unknown) => void) = vi.hoisted(() => () => {});

const compileStylesMock = vi.hoisted(() => vi.fn());

vi.mock('$lib/utils/styles', () => ({
  compileStyles : compileStylesMock,
}));
vi.mock('$lib/stores/theme', async (original) => {
  const originalModule =
    (await original()) as typeof import('$lib/stores/theme');
  const writable = (await import('svelte/store')).writable;
  const themes = writable<unknown>();
  setThemes = (value : unknown) => themes.set(value);
  return {
    ...originalModule,
    themes,
  };
});

beforeEach(() => {
  setThemes(defaultThemes);
  compileStylesMock.mockReturnValue('');
});

afterAll(() => { vi.restoreAllMocks(); });

describe('theme.css', () => {
  it('returns css file', async () => {
    const response = await GET({} as RequestEvent);
    expect(response.headers.get('Content-Type')).toBe('text/css');
  });

  it('returns theme css', async () => {
    const themes = { test : {} };
    setThemes(themes);
    const css = '.test {\n\n}\n';
    compileStylesMock.mockReturnValue(css);

    const response = await GET({} as RequestEvent);

    expect(compileStylesMock).toHaveBeenCalledWith(themes);
    expect(await response.text()).toBe('.test {\n\n}\n');
  });
});
