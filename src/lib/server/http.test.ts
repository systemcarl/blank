import { beforeEach, afterAll, describe, expect, it, vi } from 'vitest';

import { log } from './logs';
import { fetchResource, fetchJsonResource } from './http';

let baseUrl : string | undefined = vi.hoisted(() => '/');

vi.mock('$env/dynamic/private', () => ({
  get env() { return { BASE_URL : baseUrl }; },
}));
vi.mock('./logs', () => ({
  log : vi.fn(),
}));

const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  baseUrl = '/';
  fetchMock.mockReturnValue(Promise.resolve({
    ok : true,
    text : () => Promise.resolve('fetched text'),
    json : () => Promise.resolve({ fetched : 'json' }),
  }));
});

afterAll(() => { vi.restoreAllMocks(); });

describe('fetchResource', () => {
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
  ])('fetches from local folder with %s', async (_, base, res, expected) => {
    baseUrl = base;
    await fetchResource(res, { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith(expected);
  });

  it('fetches from relative URL', async () => {
    baseUrl = 'http://example.com/';
    await fetchResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith(new URL('/resource', baseUrl));
  });

  it('fetches from absolute URL', async () => {
    baseUrl = 'http://example.com/';
    await fetchResource('http://example.org/resource', { fetch : fetchMock });
    expect(fetchMock)
      .toHaveBeenCalledWith(new URL('http://example.org/resource'));
  });

  it('returns response text', async () => {
    fetchMock.mockResolvedValue({
      ok : true,
      text : () => Promise.resolve('fetched text'),
    });
    const result = await fetchResource('/resource', { fetch : fetchMock });
    expect(result).toEqual('fetched text');
  });

  it('returns null on fetch error', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));
    const result = await fetchResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
  });

  it('logs a warning on fetch error', async () => {
    const error = new Error('Network error');
    fetchMock.mockRejectedValue(error);
    await fetchResource('/resource', { fetch : fetchMock });
    expect(log).toHaveBeenCalledWith({
      message : 'Error fetching resource',
      resource : '/resource',
      error,
    }, { level : 'warn' });
  });

  it('returns null when fetch not ok', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));
    const result = await fetchResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
  });

  it('logs a warning when fetch not ok', async () => {
    fetchMock.mockResolvedValue({ ok : false, status : 404 });
    const result = await fetchResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
    expect(log).toHaveBeenCalledWith({
      message : 'Failed to fetch resource',
      resource : '/resource',
      response : { status : 404 },
    }, { level : 'warn' });
  });

  it('returns null when text parsing fails', async () => {
    fetchMock.mockResolvedValue({
      ok : true,
      text : async () => { throw new Error('Text parsing error'); },
    });
    const result = await fetchResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
  });

  it('logs a warning when text parsing fails', async () => {
    const error = new Error('Text parsing error');
    fetchMock.mockResolvedValue({
      ok : true,
      status : 200,
      text : async () => { throw error; },
    });
    const result = await fetchResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
    expect(log).toHaveBeenCalledWith({
      message : 'Error reading response',
      resource : '/resource',
      response : { status : 200 },
      error,
    }, { level : 'warn' });
  });
});

describe('fetchJsonResource', () => {
  it.each([
    ['with base url undefined', undefined, 'res', '/res'],
    ['with base url empty', '', 'res', '/res'],
    ['with base url slash', '/', 'res', '/res'],
    ['with relative root url', './base', 'res', '/base/res'],
    ['with base url without slash', 'base', 'res', '/base/res'],
    ['with base url with leading slash', '/base', '/res', '/base/res'],
    ['with base url with trailing slash', 'base/', 'res', '/base/res'],
    ['with base url with double slashes', '/base/', '/res', '/base/res'],
    ['with relative url', './base', './res', '/base/res'],
  ])('fetches from local folder %s', async (_, base, resource, expected) => {
    baseUrl = base;
    await fetchJsonResource(resource, { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith(expected);
  });

  it('fetches from relative URL', async () => {
    baseUrl = 'http://example.com/';
    await fetchJsonResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith(new URL('/resource', baseUrl));
  });

  it('fetches from absolute URL', async () => {
    baseUrl = 'http://example.com/';
    await fetchJsonResource(
      'http://example.org/resource',
      { fetch : fetchMock },
    );
    expect(fetchMock)
      .toHaveBeenCalledWith(new URL('http://example.org/resource'));
  });

  it('returns JSON response', async () => {
    fetchMock.mockResolvedValue({
      ok : true,
      json : () => Promise.resolve({ fetched : 'json' }),
    });
    const result = await fetchJsonResource('/resource', { fetch : fetchMock });
    expect(result).toEqual({ fetched : 'json' });
  });

  it('returns null on fetch error', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));
    const result = await fetchJsonResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
  });

  it('logs a warning on fetch error', async () => {
    const error = new Error('Network error');
    fetchMock.mockRejectedValue(error);
    await fetchJsonResource('/resource', { fetch : fetchMock });
    expect(log).toHaveBeenCalledWith({
      message : 'Error fetching resource',
      resource : '/resource',
      error,
    }, { level : 'warn' });
  });

  it('returns null when fetch not ok', async () => {
    fetchMock.mockResolvedValue({ ok : false, status : 404 });
    const result = await fetchJsonResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
  });

  it('logs a warning when fetch not ok', async () => {
    fetchMock.mockResolvedValue({ ok : false, status : 404 });
    const result = await fetchJsonResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
    expect(log).toHaveBeenCalledWith({
      message : 'Failed to fetch resource',
      resource : '/resource',
      response : { status : 404 },
    }, { level : 'warn' });
  });

  it('returns null when JSON parsing fails', async () => {
    fetchMock.mockResolvedValue({
      ok : true,
      json : async () => { throw new Error('Error reading JSON'); },
    });
    const result = await fetchJsonResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
  });

  it('logs a warning when JSON parsing fails', async () => {
    const error = new Error('Error reading JSON');
    fetchMock.mockResolvedValue({
      ok : true,
      status : 200,
      json : async () => { throw error; },
    });
    const result = await fetchJsonResource('/resource', { fetch : fetchMock });
    expect(fetchMock).toHaveBeenCalledWith('/resource');
    expect(result).toBeNull();
    expect(log).toHaveBeenCalledWith({
      message : 'Error reading JSON response',
      resource : '/resource',
      response : { status : 200 },
      error,
    }, { level : 'warn' });
  });
});
