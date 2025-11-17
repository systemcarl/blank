import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import { buildLocale } from '$lib/utils/locale';
import { loadLocale } from './locale';

const FetchJsonResourceMock = vi.hoisted(() => vi.fn());

vi.mock('$lib/utils/locale', () => ({
  buildLocale : vi.fn(data => data),
}));
vi.mock('./http', () => ({
  fetchJsonResource : FetchJsonResourceMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
  FetchJsonResourceMock.mockResolvedValue({});
});

afterAll(() => { vi.restoreAllMocks(); });

describe('loadLocale', () => {
  it('fetches locale.json', async () => {
    const fetch = vi.fn();
    await loadLocale({ fetch });
    expect(FetchJsonResourceMock)
      .toHaveBeenCalledWith('/locale.json', { fetch });
  });

  it('returns built locale', async () => {
    const locale = { key : 'value' };
    FetchJsonResourceMock.mockResolvedValue(locale);
    const result = await loadLocale({ fetch : vi.fn() });

    expect(result).toEqual(locale);
    expect(buildLocale).toHaveBeenCalledWith(locale);
  });
});
