import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { tryGet } from '$lib/utils/typing';
import { wrapOriginal } from '$lib/tests/component';
import Text from '$lib/materials/text.svelte';
import ListItem from '$lib/materials/listItem.svelte';
import FavouriteList from './favouriteList.svelte';

const defaultConfig = vi.hoisted(() => ({
  likes : [
    { icon : 'icon1', text : 'like1' },
    { icon : 'icon2', text : 'like2' },
  ],
  dislikes : [
    { icon : 'icon3', text : 'dislike1' },
    { icon : 'icon4', text : 'dislike2' },
  ],
}));
let config = vi.hoisted(() => ({ ...defaultConfig }));

const locale = vi.hoisted(() => ({
  favourites : {
    header : 'Favourites',
    most : 'Most Favourite',
    least : 'Least Favourite',
  },
}));

vi.mock('$lib/hooks/useConfig', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  return {
    default : () => ({
      ...originalDefault(),
      getConfig : vi.fn(() => config),
    }),
  };
});
vi.mock('$lib/hooks/useLocale', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  return {
    default : () => ({
      ...originalDefault(),
      getLocale : vi.fn(() => locale),
    }),
  };
});

vi.mock('$lib/materials/text.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'text' }) };
});
vi.mock('$lib/materials/listItem.svelte', async (original) => {
  return {
    default : await wrapOriginal(original, {
      testId : p =>
        `item-${tryGet(p, 'icon', s => typeof s === 'string') ?? 'none'}`,
    }),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  config = { ...defaultConfig };
});

afterAll(() => { vi.restoreAllMocks(); });

describe('FavouriteList', () => {
  it.each([
    ['likes', 'most'],
    ['dislikes', 'least'],
  ])('does not render if no %s configured', (key, rank) => {
    config[key as 'likes' | 'dislikes'] = [];

    const { container } = render(FavouriteList, {
      rank : rank as 'most' | 'least',
    });

    const child = container.children[0];
    expect(child).toBeUndefined();

    expect(Text).not.toHaveBeenCalled();
    expect(ListItem).not.toHaveBeenCalled();
  });

  it.each(['most', 'least'])('renders %s favourites heading', (rank) => {
    const { container } = render(FavouriteList, {
      rank : rank as 'most' | 'least',
      headingElement : 'h1',
    });

    const heading = within(container).queryByRole('heading', { level : 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(locale.favourites.header);
  });

  it.each(['most', 'least'])('renders %s heading', (rank) => {
    const { container } = render(FavouriteList, {
      rank : rank as 'most' | 'least',
      headingElement : 'h2',
    });

    const heading = within(container).queryByRole('heading', { level : 2 });
    expect(heading).toBeInTheDocument();
    expect(heading)
      .toHaveTextContent(locale.favourites[rank as 'most' | 'least']);
  });

  it.each(['most', 'least'])('renders %s list items', (rank) => {
    const { container } = render(FavouriteList, {
      rank : rank as 'most' | 'least',
    });

    const list = within(container).queryByRole('list') as HTMLElement;
    expect(list).toBeInTheDocument();

    const items = within(list).queryAllByRole('listitem');
    expect(items)
      .toHaveLength(config[rank === 'most' ? 'likes' : 'dislikes'].length);
    for (const item of items) expect(item).toBeInTheDocument();

    for (const fav of config[rank === 'most' ? 'likes' : 'dislikes']) {
      const item = within(list)
        .queryByTestId(`item-${fav.icon}`) as HTMLElement;
      expect(item).toBeInTheDocument();

      expect(item).toHaveTextContent(fav.text);

      expect(ListItem).toHaveBeenCalledWithProps(expect.objectContaining({
        icon : fav.icon,
      }));
    }
  });
});
