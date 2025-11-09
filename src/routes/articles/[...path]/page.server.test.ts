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

const loadAbstractMock = vi.hoisted(() => vi.fn());
const loadArticleMock = vi.hoisted(() => vi.fn());

vi.mock('$lib/stores/config', async original => ({
  ...(await original()),
  getConfig : () => ({ weblog : { url : 'test-weblog' } }),
}));
vi.mock('$lib/server/weblog', async original => ({
  ...(await original()),
  loadAbstract : loadAbstractMock,
  loadArticle : loadArticleMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
  loadAbstractMock.mockResolvedValue({ title : '', body : '' });
  loadArticleMock.mockResolvedValue('Test Content');
});
afterAll(() => { vi.restoreAllMocks(); });

describe('load', () => {
  it('retrieves article title and abstract', async () => {
    loadAbstractMock.mockResolvedValue({
      title : 'Test Article',
      body : 'This is a test abstract.',
    });

    const result = await load(event);

    expect(result).toEqual(expect.objectContaining({
      title : 'Test Article',
      abstract : 'This is a test abstract.',
    }));
    expect(loadAbstractMock).toHaveBeenCalledWith(
      'test-weblog',
      'test/path',
      { fetch : event.fetch },
    );
  });

  it('retrieves article contents', async () => {
    loadArticleMock.mockResolvedValue('Article Content');

    const result = await load(event);

    expect(result).toEqual(expect.objectContaining({
      markdown : 'Article Content',
    }));
    expect(loadArticleMock).toHaveBeenCalledWith(
      'test-weblog',
      'test/path',
      { fetch : event.fetch },
    );
  });

  it('raises 404 error when article not found', async () => {
    loadArticleMock.mockResolvedValue('');

    await expect(load(event)).rejects
      .toMatchObject(expect.objectContaining({ status : 404 }));
  });
});
