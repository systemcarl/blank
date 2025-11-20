import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import { buildConfig } from '$lib/utils/config';
import { loadConfig } from './config';

const FetchJsonResourceMock = vi.hoisted(() => vi.fn());

vi.mock('$lib/utils/config', () => ({
  buildConfig : vi.fn(data => data),
}));
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

  it('returns built config', async () => {
    const config = { key : 'value' };
    FetchJsonResourceMock.mockResolvedValue(config);
    const result = await loadConfig({ fetch : vi.fn() });

    expect(result).toEqual(config);
    expect(buildConfig).toHaveBeenCalledWith(config);
  });
});
