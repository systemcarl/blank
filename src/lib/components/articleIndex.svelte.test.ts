import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { tryGet } from '$lib/utils/typing';
import { wrapOriginal } from '$lib/tests/component';
import type { WeblogIndex } from '$lib/utils/weblog';
import Grid from '$lib/materials/grid.svelte';
import Card from '$lib/materials/card.svelte';
import Heading from '$lib/materials/heading.svelte';
import Abstract from './abstract.svelte';
import ArticleIndex from './articleIndex.svelte';

const defaultIndex =
  vi.hoisted(() => ({ articles : {}, tags : {} } as WeblogIndex));
let setIndex : ((value : WeblogIndex) => void) = vi.hoisted(() => () => {});

vi.mock('$lib/hooks/useArticles', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  const writable = (await import('svelte/store')).writable;
  const index = writable<WeblogIndex>();
  setIndex = (value : WeblogIndex) => index.set(value);
  return {
    default : () => ({
      ...originalDefault(),
      index,
    }),
  };
});

vi.mock('$lib/materials/grid.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'grid' }) };
});
vi.mock('$lib/materials/card.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'card' }) };
});
vi.mock('$lib/materials/heading.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'heading' }) };
});
vi.mock('$lib/components/abstract.svelte', async (original) => {
  return { default : await wrapOriginal(original, {
    testId : p =>
      `abstract-${tryGet(p, 'link', s => (typeof s === 'string')) ?? 'none'}`,
  }) };
});

beforeEach(() => {
  vi.clearAllMocks();
  setIndex({ ...defaultIndex });
});

afterAll(() => { vi.restoreAllMocks(); });

describe('ArticleIndex', () => {
  it('renders index heading', async () => {
    setIndex({
      articles : {},
      tags : {
        test : { slug : 'test', name : 'Test', articles : [] },
      },
    });

    const { container } = render(ArticleIndex, { tag : 'test' });

    const heading = within(container).queryByTestId('heading') as HTMLElement;
    expect(heading).toBeInTheDocument();
    const headingText = within(heading).getByText('Test');
    expect(headingText).toBeInTheDocument();

    expect(Heading).toHaveBeenCalledTimes(1);
    expect(Heading).toHaveBeenCalledWithProps(
      expect.objectContaining({ level : 2 }),
    );
  });

  it('renders index heading with id', async () => {
    const { container } = render(ArticleIndex, { id : 'test' });

    const heading = within(container).queryByTestId('heading') as HTMLElement;
    expect(heading).toBeInTheDocument();

    expect(Heading).toHaveBeenCalledTimes(1);
    expect(Heading).toHaveBeenCalledWithProps(
      expect.objectContaining({ id : 'test' }),
    );
  });

  it('renders articles as abstracts', async () => {
    const index = {
      articles : {},
      tags : {
        test : {
          slug : 'test',
          name : 'Test',
          articles : [
            {
              slug : 'article-1',
              title : 'Article 1',
              abstract : 'This is article 1.',
            },
            {
              slug : 'article-2',
              title : 'Article 2',
              abstract : 'This is article 2.',
            },
          ],
        },
      },
    };
    setIndex(index);

    const { container } = render(ArticleIndex, { tag : 'test' });

    for (const article of index.tags.test?.articles || []) {
      const abstract = within(container)
        .queryByTestId(`abstract-/articles/${article.slug}`) as HTMLElement;
      expect(abstract).toBeInTheDocument();

      expect(Abstract).toHaveBeenCalledWithProps(
        expect.objectContaining({
          title : article.title,
          abstract : article.abstract,
          link : `/articles/${article.slug}`,
        }),
      );
    }
    expect(Abstract).toHaveBeenCalledTimes(2);
  });

  it('renders article in card', async () => {
    const index = {
      articles : {},
      tags : {
        test : {
          slug : 'test',
          name : 'Test',
          articles : [
            {
              slug : 'article-1',
              title : 'Article 1',
              abstract : 'This is article 1.',
            },
            {
              slug : 'article-2',
              title : 'Article 2',
              abstract : 'This is article 2.',
            },
          ],
        },
      },
    };
    setIndex(index);

    const { container } = render(ArticleIndex, { tag : 'test' });

    const cards = within(container).getAllByTestId('card') as HTMLElement[];
    expect(cards).toHaveLength(2);

    for (const article of index.tags.test?.articles || []) {
      const abstract = within(container)
        .queryByTestId(`abstract-/articles/${article.slug}`) as HTMLElement;
      expect(abstract).toBeInTheDocument();
      expect(cards.filter(c => c.contains(abstract)).length).toBe(1);
    }

    expect(Card).toHaveBeenCalledTimes(2);
  });

  it('renders article cards in grid', async () => {
    setIndex({
      articles : {},
      tags : {
        test : {
          slug : 'test',
          name : 'Test',
          articles : [
            {
              slug : 'article-1',
              title : 'Article 1',
              abstract : 'This is article 1.',
            },
            {
              slug : 'article-2',
              title : 'Article 2',
              abstract : 'This is article 2.',
            },
          ],
        },
      },
    });
    const { container } = render(ArticleIndex, { tag : 'test' });

    const grid = within(container).queryByTestId('grid') as HTMLElement;
    expect(grid).toBeInTheDocument();
    const cards = within(grid).queryAllByTestId('card') as HTMLElement[];
    expect(cards).toHaveLength(2);

    expect(Grid).toHaveBeenCalledTimes(1);
  });
});
