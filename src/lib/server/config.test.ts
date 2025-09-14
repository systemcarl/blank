import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import { loadConfig } from './config';

const FetchJsonResourceMock = vi.hoisted(() => vi.fn());

vi.mock('./http', () => ({
  fetchJsonResource : FetchJsonResourceMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
  FetchJsonResourceMock.mockResolvedValue({});
});

afterAll(() => { vi.restoreAllMocks(); });

describe('loadConfig', () => {
  it('fetches config.json', async () => {
    const fetch = vi.fn();
    await loadConfig({ fetch });
    expect(FetchJsonResourceMock)
      .toHaveBeenCalledWith('/config.json', { fetch });
  });

  it('returns fetched config', async () => {
    const config = { key : 'value' };
    FetchJsonResourceMock.mockResolvedValue(config);
    const result = await loadConfig({ fetch : vi.fn() });
    expect(result).toEqual(config);
  });

  it('returns empty config if fetch fails', async () => {
    FetchJsonResourceMock.mockResolvedValue(null);
    const result = await loadConfig({ fetch : vi.fn() });
    expect(result).toEqual({});
  });
});
