import { beforeEach, describe, it, afterAll, expect, vi } from 'vitest';
import { Cache } from './cache';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
});

afterAll(() => { vi.useRealTimers(); });

describe('cache', () => {
  it('loads when not set', async () => {
    const expected = 42;
    const loader = vi.fn().mockReturnValue(42);

    const cache = Cache<number>(1000);

    const result = await cache.get('key', loader);

    expect(result).toBe(expected);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('returns cache within TTL', async () => {
    const expected = 42;
    const ttl = 1000;
    const loader = vi.fn().mockReturnValue(42);

    const cache = Cache<number>(1000);
    await cache.get('key', loader);

    vi.setSystemTime(ttl / 2);
    const result = await cache.get('key', loader);

    expect(result).toBe(expected);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('reloads cache after TTL', async () => {
    const expected = 42;
    const ttl = 1000;
    const loader = vi.fn().mockReturnValue(42);

    const cache = Cache<number>(1000);
    await cache.get('key', loader);

    vi.setSystemTime(ttl + 1);
    const result = await cache.get('key', loader);

    expect(result).toBe(expected);
    expect(loader).toHaveBeenCalledTimes(2);
  });
});
