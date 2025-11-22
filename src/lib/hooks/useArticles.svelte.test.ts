import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';

import type { WeblogIndex } from '$lib/utils/weblog';
import { resetIndex } from '$lib/stores/articles';

import useArticles from './useArticles';
import Test from './useArticles.test.svelte';

beforeEach(() => { resetIndex(); });
afterAll(() => { resetIndex(); });

describe('useArticles', () => {
  it('stores index', () => {
    const { index } = useArticles();
    const expected : WeblogIndex = { articles : {
      'test-article' : {
        slug : 'test-article',
        title : 'Test Article',
        abstract : 'Test abstract.',
      },
    }, tags : {} };

    render(Test, { props : { setIndex : () => expected } });

    const actual = get(index);
    expect(actual).toEqual(expected);
  });

  it('retrieves stored index', () => {
    const { index } = useArticles();
    const expected : WeblogIndex = { articles : {
      'test-article' : {
        slug : 'test-article',
        title : 'Test Article',
        abstract : 'Test abstract.',
      },
    }, tags : {} };
    index.set(expected);

    let actual : WeblogIndex | undefined;
    render(Test, { props : { getIndex : (index) => { actual = index; } } });

    expect(actual).toEqual(expected);
  });
});
