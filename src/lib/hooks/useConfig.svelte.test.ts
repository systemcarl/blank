import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';

import { defaultConfig } from '$lib/utils/config';
import { resetConfig } from '$lib/stores/config';

import useConfig from './useConfig';
import Test from './useConfig.test.svelte';

beforeEach(() => { resetConfig(); });
afterAll(() => { resetConfig(); });

describe('useConfig', () => {
  it('stores config', () => {
    const { config } = useConfig();
    const expected = {
      likes : [{ icon : 'icon', text : 'test' }],
    } as typeof defaultConfig;

    render(Test, { props : { setConfig : () => expected } });

    const actual = get(config);
    expect(actual.likes).toEqual(expected.likes);
  });

  it('retrieves stored config', () => {
    const { config } = useConfig();
    const expected = {
      likes : [{ icon : 'icon', text : 'test' }],
    } as typeof defaultConfig;
    config.set(expected);

    let actual : typeof defaultConfig | undefined;
    render(Test, { props : { getConfig : (config) => { actual = config; } } });

    expect(actual?.likes).toEqual(expected.likes);
  });

  it('retrieves default config', () => {
    let actual : typeof defaultConfig | undefined;
    render(Test, { props : { getConfig : (config) => { actual = config; } } });

    expect(actual?.likes).toEqual(defaultConfig.likes);
  });
});
