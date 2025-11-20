import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { loadConfig } from '$lib/server/config';
import { loadLocale } from '$lib/server/locale';
import { loadGraphics, loadThemes } from '$lib/server/theme';
import { loadIndex } from '$lib/server/weblog';

import type { LayoutServerLoadEvent } from './$types';
import { load } from './+layout.server';

const event = {
  request : new Request('http://localhost/test', {
    method : 'GET',
    headers : { 'Content-Type' : 'application/json' },
  }),
  url : new URL('http://localhost/'),
  fetch : vi.fn(),
} as unknown as LayoutServerLoadEvent;

const loadConfigMock = vi.hoisted(() => vi.fn());
const loadLocaleMock = vi.hoisted(() => vi.fn());
const loadThemesMock = vi.hoisted(() => vi.fn());
const loadGraphicsMock = vi.hoisted(() => vi.fn());
const loadIndexMock = vi.hoisted(() => vi.fn());

vi.mock('$lib/server/config', async original => ({
  ...(await original()),
  loadConfig : loadConfigMock,
}));
vi.mock('$lib/server/locale', async original => ({
  ...(await original()),
  loadLocale : loadLocaleMock,
}));
vi.mock('$lib/server/theme', async original => ({
  ...(await original()),
  loadThemes : loadThemesMock,
  loadGraphics : loadGraphicsMock,
}));
vi.mock('$lib/server/weblog', async original => ({
  ...(await original()),
  loadIndex : loadIndexMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
  loadConfigMock.mockResolvedValue({
    weblog : { url : '/weblog/' },
  });
});

afterAll(() => { vi.restoreAllMocks(); });

describe('+layout.server.ts', () => {
  it('loads config', async () => {
    const fetch = vi.fn();
    await load({ ...event, fetch });
    expect(loadConfig).toHaveBeenCalledWith({ fetch });
  });

  it('returns config data', async () => {
    const expected = { test : {}, weblog : { url : '/weblog/' } };
    loadConfigMock.mockResolvedValueOnce(expected);
    const result = await load(event) as { config : object; };
    expect(result.config).toEqual(expected);
  });

  it('loads locale', async () => {
    const fetch = vi.fn();
    await load({ ...event, fetch });
    expect(loadLocale).toHaveBeenCalledWith({ fetch });
  });

  it('returns locale data', async () => {
    const expected = { test : {} };
    loadLocaleMock.mockResolvedValueOnce(expected);
    const result = await load(event) as { locale : object; };
    expect(result.locale).toEqual(expected);
  });

  it('loads themes', async () => {
    const fetch = vi.fn();
    await load({ ...event, fetch });
    expect(loadThemes).toHaveBeenCalledWith({ fetch });
  });

  it('returns themes data', async () => {
    const expected = { test : {} };
    loadThemesMock.mockResolvedValueOnce(expected);
    const result = await load(event) as { themes : object; };
    expect(result.themes).toEqual(expected);
  });

  it('loads graphics', async () => {
    const expected = { test : {} };
    const fetch = vi.fn();
    loadThemesMock.mockResolvedValueOnce(expected);
    await load({ ...event, fetch });
    expect(loadGraphics).toHaveBeenCalledWith(expected, { fetch });
  });

  it('returns graphic data', async () => {
    const expected = { test : '<svg></svg>' };
    loadGraphicsMock.mockResolvedValueOnce(expected);
    const result = await load(event) as { graphics : object; };
    expect(result.graphics).toEqual(expected);
  });

  it('loads weblog index', async () => {
    const expectedUrl = '/test-weblog/';
    const fetch = vi.fn();
    loadConfigMock.mockResolvedValueOnce({ weblog : { url : expectedUrl } });
    await load({ ...event, fetch });
    expect(loadIndex).toHaveBeenCalledWith(expectedUrl, { fetch });
  });

  it('returns weblog index data', async () => {
    const expected = { articles : [] };
    loadIndexMock.mockResolvedValueOnce(expected);
    const result = await load(event) as { articleIndex : object; };
    expect(result.articleIndex).toEqual(expected);
  });
});
