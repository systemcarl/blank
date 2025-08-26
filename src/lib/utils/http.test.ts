import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import { resolveUrl } from './http';

let baseUrl : string | undefined = vi.hoisted(() => '/');

vi.mock('$env/dynamic/public', () => ({
  get env() { return { PUBLIC_BASE_URL : baseUrl }; },
}));

beforeEach(() => {
  vi.clearAllMocks();
  baseUrl = '/';
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('http', () => {
  it.each([
    ['base url undefined', undefined, 'resource', '/resource'],
    ['base url empty', '', 'resource', '/resource'],
    ['base url slash', '/', 'resource', '/resource'],
    ['relative root url', './base', 'resource', '/base/resource'],
    ['base url without slash', 'base', 'resource', '/base/resource'],
    ['base url with leading slash', '/base', '/resource', '/base/resource'],
    ['base url with trailing slash', 'base/', 'resource', '/base/resource'],
    ['base url with double slashes', '/base/', '/resource', '/base/resource'],
    ['relative url', './base', './resource', '/base/resource'],
  ])('resolves local URL with env %s', async (_, base, res, expected) => {
    baseUrl = base;
    const url = resolveUrl(res);
    expect(url).toBe(expected);
  });

  it.each([
    ['base url undefined', undefined, 'resource', '/resource'],
    ['base url empty', '', 'resource', '/resource'],
    ['base url slash', '/', 'resource', '/resource'],
    ['relative root url', './base', 'resource', '/base/resource'],
    ['base url without slash', 'base', 'resource', '/base/resource'],
    ['base url with leading slash', '/base', '/resource', '/base/resource'],
    ['base url with trailing slash', 'base/', 'resource', '/base/resource'],
    ['base url with double slashes', '/base/', '/resource', '/base/resource'],
    ['relative url', './base', './resource', '/base/resource'],
  ])('resolves local URL with explicit %s', async (_, base, res, expected) => {
    const url = resolveUrl(res, base);
    expect(url).toBe(expected);
  });

  it('fetches from env relative URL', async () => {
    baseUrl = 'http://example.com/';
    const url = resolveUrl('/resource');
    expect(url).toEqual(new URL('/resource', baseUrl));
  });

  it('fetches from explicit relative URL', async () => {
    const url = resolveUrl('/resource', 'http://example.com/');
    expect(url).toEqual(new URL('/resource', 'http://example.com/'));
  });

  it('fetches from absolute URL', async () => {
    baseUrl = '/';
    const url = resolveUrl('http://example.org/resource');
    expect(url).toEqual(new URL('http://example.org/resource'));
  });
});
