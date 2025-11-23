import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';

import { defaultLocale } from '$lib/utils/locale';
import { resetLocale } from '$lib/stores/locale';

import useLocale from './useLocale';
import Test from './useLocale.test.svelte';

beforeEach(() => { resetLocale(); });
afterAll(() => { resetLocale(); });

describe('useLocale', () => {
  it('stores locale', () => {
    const { locale } = useLocale();
    const expected = { title : 'test' } as typeof defaultLocale;

    render(Test, { props : { setLocale : () => expected } });

    const actual = get(locale);
    expect(actual.title).toEqual(expected.title);
  });

  it('retrieves stored locale', () => {
    const { locale } = useLocale();
    const expected = { title : 'test' } as typeof defaultLocale;
    locale.set(expected);

    let actual : typeof defaultLocale | undefined;
    render(Test, { props : { getLocale : (locale) => { actual = locale; } } });

    expect(actual?.title).toEqual(expected.title);
  });

  it('retrieves default locale', () => {
    let actual : typeof defaultLocale | undefined;
    render(Test, { props : { getLocale : (locale) => { actual = locale; } } });

    expect(actual?.title).toEqual(defaultLocale.title);
  });
});
