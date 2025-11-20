import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';

import { defaultLocale, buildLocale } from './locale';

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('buildLocale', () => {
  it('returns default locale if no locale provided', () => {
    const result = buildLocale(undefined);
    expect(result).toEqual(defaultLocale);
  });

  it('returns default locale if non-object locale provided', () => {
    const result = buildLocale('locale');
    expect(result).toEqual(defaultLocale);
  });

  it('resolves locale value', () => {
    const locale = { title : 'Test' };
    const result = buildLocale(locale);
    expect(result.title).toBe('Test');
  });

  it('resolves locale value to default if not provided', () => {
    const locale = {};
    const result = buildLocale(locale);
    expect(result.title).toBe(defaultLocale.title);
  });

  it('resolves nested locale value', () => {
    const locale = { errors : { default : 'I\'m a teapot' } };
    const result = buildLocale(locale);
    expect(result.errors.default).toBe('I\'m a teapot');
  });

  it('resolves nested locale value to default if not provided', () => {
    const locale = { errors : {} };
    const result = buildLocale(locale);
    expect(result.errors.default).toBe(defaultLocale.errors.default);
  });

  it('resolves local map', () => {
    const expectedHighlights = { highlight1 : 'Highlight One' };
    const locale = { nav : { highlights : expectedHighlights } };
    const result = buildLocale(locale);
    expect(result.nav.highlights.highlight1)
      .toBe(expectedHighlights.highlight1);
  });

  it('resolves locale map to default if not provided', () => {
    const locale = { nav : {} };
    const result = buildLocale(locale);
    expect(result.nav.highlights.highlight1).toBeUndefined();
  });

  it('ignores unexpected string values', () => {
    const locale = { errors : 'I\'m a teapot' };
    const result = buildLocale(locale);
    expect(result.errors.default).toBe(defaultLocale.errors.default);
  });
});
