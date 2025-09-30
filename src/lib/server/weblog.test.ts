import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import { loadArticle } from './weblog';

const fetchResourceMock = vi.hoisted(() => vi.fn());
const FetchJsonResourceMock = vi.hoisted(() => vi.fn());

vi.mock('./http', () => ({
  fetchResource : fetchResourceMock,
  fetchJsonResource : FetchJsonResourceMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
  fetchResourceMock.mockResolvedValue('');
});

afterAll(() => { vi.restoreAllMocks(); });

describe('loadArticle', () => {
  it('fetches article markdown', async () => {
    const fetch = vi.fn();
    const basePath = '/base';
    const path = 'test-article';
    const expected = 'content';
    fetchResourceMock.mockResolvedValue(expected);

    const actual = await loadArticle(basePath, path, { fetch });

    expect(actual).toEqual(expected);
    expect(fetchResourceMock).toHaveBeenCalledTimes(1);
    expect(fetchResourceMock).toHaveBeenCalledWith(
      `${basePath}/articles/${path}.md`,
      { fetch },
    );
  });

  it('returns empty string if fetch fails', async () => {
    fetchResourceMock.mockResolvedValue(null);
    const result = await loadArticle('/base', 'article', { fetch : vi.fn() });
    expect(result).toEqual('');
  });
});
