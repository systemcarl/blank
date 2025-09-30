import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import type { PageServerLoadEvent } from './$types';
import { load } from './+page.server';

const event = {
  request : new Request('http://localhost/articles/test/path', {
    method : 'GET',
    headers : { 'Content-Type' : 'application/json' },
  }),
  params : { path : 'test/path' },
  url : new URL('http://localhost/articles/test/path'),
  fetch : vi.fn(),
} as unknown as PageServerLoadEvent;

const loadArticleMock = vi.hoisted(() => vi.fn());

vi.mock('$lib/stores/config', async original => ({
  ...(await original()),
  getConfig : () => ({ weblog : { url : 'test-weblog' } }),
}));
vi.mock('$lib/server/weblog', async original => ({
  ...(await original()),
  loadArticle : loadArticleMock,
}));

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('load', () => {
  it('retrieves article contents', async () => {
    loadArticleMock.mockResolvedValue('Article Content');

    const result = await load(event);

    expect(result).toEqual({ markdown : 'Article Content' });
    expect(loadArticleMock).toHaveBeenCalledWith(
      'test-weblog',
      'test/path',
      { fetch : event.fetch },
    );
  });
});
