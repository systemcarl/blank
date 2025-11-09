import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import { loadAbstract, loadArticle } from './weblog';

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

describe('loadAbstract', () => {
  it('fetches article title and abstract', async () => {
    const fetch = vi.fn();
    const basePath = '/base';
    const path = 'test-article';
    const markdown = '# Title\n\nThis is the abstract.';
    const expected = { title : 'Title', body : 'This is the abstract.' };
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadAbstract(basePath, path, { fetch });
    expect(actual).toEqual(expected);
    expect(fetchResourceMock).toHaveBeenCalledTimes(1);
    expect(fetchResourceMock).toHaveBeenCalledWith(
      `${basePath}/abstracts/${path}.md`,
      { fetch },
    );
  });

  it('resolves abstract base paths with trailing slashes', async () => {
    const fetch = vi.fn();
    const basePath = '/base';
    const path = 'test-article';

    await loadAbstract(basePath + '/', path, { fetch });
    expect(fetchResourceMock).toHaveBeenCalledWith(
      `${basePath}/abstracts/${path}.md`,
      { fetch },
    );
  });

  it('returns empty title and body if fetch fails', async () => {
    fetchResourceMock.mockResolvedValue(null);
    const result = await loadAbstract('/base', 'article', { fetch : vi.fn() });
    expect(result).toEqual({ title : '', body : '' });
  });
});

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

  it('resolves article base paths with trailing slashes', async () => {
    const fetch = vi.fn();
    const basePath = '/base';
    const path = 'test-article';

    await loadArticle(basePath + '/', path, { fetch });
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

  it('removes .md extensions from inline links', async () => {
    const markdown = '[Link](./other-article.md)';
    const expected = '[Link](./other-article)';
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadArticle('/base', 'article', { fetch : vi.fn() });

    expect(actual).toEqual(expected);
  });

  it('removes .md extensions from inline links with anchors', async () => {
    const markdown = '[Link](./other-article.md#section)';
    const expected = '[Link](./other-article#section)';
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadArticle('/base', 'article', { fetch : vi.fn() });

    expect(actual).toEqual(expected);
  });

  it('removes .md extensions from inline links with query', async () => {
    const markdown = '[Link](./other-article.md?param=value)';
    const expected = '[Link](./other-article?param=value)';
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadArticle('/base', 'article', { fetch : vi.fn() });
    expect(actual).toEqual(expected);
  });

  it('does not alter absolute links', async () => {
    const markdown = '[Link](https://example.com/other-article.md)';
    const expected = '[Link](https://example.com/other-article.md)';
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadArticle('/base', 'article', { fetch : vi.fn() });

    expect(actual).toEqual(expected);
  });

  it('removes .md extensions from implied links', async () => {
    const markdown = '[Link]: ./other-article.md\n';
    const expected = '[Link]: ./other-article\n';
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadArticle('/base', 'article', { fetch : vi.fn() });

    expect(actual).toEqual(expected);
  });

  it('removes .md extensions from implied links with anchors', async () => {
    const markdown = '[Link]: ./other-article.md#section';
    const expected = '[Link]: ./other-article#section';
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadArticle('/base', 'article', { fetch : vi.fn() });

    expect(actual).toEqual(expected);
  });

  it('removes .md extensions from implied links with query', async () => {
    const markdown = '[Link]: ./other-article.md?param=value';
    const expected = '[Link]: ./other-article?param=value';
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadArticle('/base', 'article', { fetch : vi.fn() });

    expect(actual).toEqual(expected);
  });

  it('does not alter absolute implied links', async () => {
    const markdown = '[Link]: https://example.com/other-article.md';
    const expected = '[Link]: https://example.com/other-article.md';
    fetchResourceMock.mockResolvedValue(markdown);

    const actual = await loadArticle('/base', 'article', { fetch : vi.fn() });

    expect(actual).toEqual(expected);
  });
});
