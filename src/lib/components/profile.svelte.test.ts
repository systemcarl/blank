import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import { tryGet } from '$lib/utils/typing';
import SplitStack from '$lib/materials/splitStack.svelte';
import TitleCard from '$lib/materials/titleCard.svelte';
import Tagline from '$lib/materials/tagline.svelte';
import NavLinks from '$lib/materials/navLinks.svelte';
import Frame from '$lib/materials/frame.svelte';
import Graphic from '$lib/materials/graphic.svelte';
import FavouriteList from '$lib/components/favouriteList.svelte';

import Profile from './profile.svelte';

const defaultConfig : { profileLinks : { href : string; text : string; }[]; } =
  vi.hoisted(() => ({ profileLinks : [] }));
let setConfig : ((value : unknown) => void) = vi.hoisted(() => () => {});

const locale = vi.hoisted(() => ({
  title : 'Test Title',
  subtitle : 'Test Subtitle',
  tagline : 'Test Tagline',
}));

vi.mock('$lib/hooks/useConfig', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  const writable = (await import('svelte/store')).writable;
  const config = writable<unknown>();
  setConfig = (value : unknown) => config.set(value);
  return {
    default : () => ({
      ...originalDefault(),
      config,
    }),
  };
});

vi.mock('$lib/hooks/useLocale', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  const writable = (await import('svelte/store')).writable;
  return {
    default : () => ({
      ...originalDefault(),
      locale : writable(locale),
    }),
  };
});

vi.mock('$lib/materials/splitStack.svelte', async (original) => {
  return {
    default : await wrapOriginal(original, {
      testId : (props) => {
        let id = 'splitStack';
        const order = tryGet(props, 'stackOrder', s => typeof s === 'string');
        const align = tryGet(props, 'alignment', s => typeof s === 'string');
        const divide = tryGet(props, 'divide', s => typeof s === 'boolean');
        if (order) { id += `-${order}`; }
        if (align) { id += `-${align}`; }
        if (divide) { id += `-divide`; }
        return id;
      },
    }),
  };
});
vi.mock('$lib/materials/titleCard.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'titleCard' }) };
});
vi.mock('$lib/materials/tagline.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'tagline' }) };
});
vi.mock('$lib/materials/navLinks.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'navLinks' }) };
});
vi.mock('$lib/materials/frame.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'frame' }) };
});
vi.mock('$lib/materials/graphic.svelte', async (original) => {
  return {
    default : await wrapOriginal(original, {
      testId : p =>
        `graphic-${tryGet(p, 'graphic', s => typeof s === 'string') ?? 'none'}`,
    }),
  };
});
vi.mock('$lib/components/favouriteList.svelte', async (original) => {
  return {
    default : await wrapOriginal(original, {
      testId : p =>
        `favourites-${tryGet(p, 'rank', s => typeof s === 'string') ?? 'none'}`,
    }),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  setConfig(defaultConfig);
});
afterAll(() => { vi.restoreAllMocks(); });

describe('Profile', () => {
  it('displays profile locale in title card', () => {
    render(Profile);
    expect(TitleCard).toHaveBeenCalledOnce();
    expect(TitleCard).toHaveBeenCalledWithProps(expect.objectContaining({
      title : locale.title,
      subtitle : locale.subtitle,
    }));
  });

  it('renders avatar graphic', () => {
    render(Profile);
    expect(Graphic).toHaveBeenCalledWithProps(expect.objectContaining({
      graphic : 'avatar',
    }));
  });

  it('frames avatar graphic', () => {
    const { container } = render(Profile);
    const frame = within(container).queryByTestId('frame') as HTMLElement;
    expect(frame).toBeInTheDocument();
    const graphic = within(frame)
      .queryByTestId('graphic-avatar') as HTMLElement;
    expect(graphic).toBeInTheDocument();
  });

  it('rotates avatar frame 45 degrees', () => {
    render(Profile);
    expect(Frame).toHaveBeenCalledOnce();
    expect(Frame).toHaveBeenCalledWithProps(expect.objectContaining({
      rotation : 45,
    }));
  });

  it('renders title layout in split stack', () => {
    const { container } = render(Profile);

    const splitStack = within(container)
      .queryByTestId('splitStack-reverse') as HTMLElement;
    expect(splitStack).toBeInTheDocument();
    const titleCard = within(splitStack)
      .queryByTestId('titleCard') as HTMLElement;
    expect(titleCard).toBeInTheDocument();
    const frame = within(splitStack).queryByTestId('frame') as HTMLElement;
    expect(frame).toBeInTheDocument();

    expect(SplitStack).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stackOrder : 'reverse',
        stack : expect.arrayContaining(['mobile', 'tablet']),
      }),
    );
  });

  it('displays locale tagline', () => {
    const { container } = render(Profile);

    const tagline = within(container)
      .queryByTestId('tagline') as HTMLElement;
    expect(tagline).toBeInTheDocument();
    expect(tagline).toHaveTextContent(locale.tagline);

    expect(Tagline).toHaveBeenCalledOnce();
  });

  it('renders title layout and tagline in split stack', () => {
    const { container } = render(Profile);

    const splitStack = within(container)
      .queryByTestId('splitStack') as HTMLElement;
    expect(splitStack).toBeInTheDocument();
    const titleLayout = within(splitStack)
      .queryByTestId('splitStack-reverse') as HTMLElement;
    expect(titleLayout).toBeInTheDocument();
    const tagline = within(splitStack)
      .queryByTestId('tagline') as HTMLElement;
    expect(tagline).toBeInTheDocument();

    expect(SplitStack).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stack : expect.arrayContaining(['mobile', 'tablet', 'desktop', 'wide']),
      }),
    );
  });

  it ('renders likes list', () => {
    const { container } = render(Profile);

    const likesList = within(container)
      .queryByTestId('favourites-most') as HTMLElement;
    expect(likesList).toBeInTheDocument();

    expect(FavouriteList).toHaveBeenCalledWithProps(expect.objectContaining({
      rank : 'most',
      headingElement : 'h2',
    }));
  });

  it ('renders dislikes list', () => {
    const { container } = render(Profile);

    const dislikesList = within(container)
      .queryByTestId('favourites-least') as HTMLElement;
    expect(dislikesList).toBeInTheDocument();

    expect(FavouriteList).toHaveBeenCalledWithProps(expect.objectContaining({
      rank : 'least',
      headingElement : 'h2',
    }));
  });

  it('renders likes, dislikes lists in split stack', () => {
    const { container } = render(Profile);

    const splitStack = within(container)
      .queryByTestId('splitStack-start') as HTMLElement;
    expect(splitStack).toBeInTheDocument();
    const likesList = within(splitStack)
      .queryByTestId('favourites-most') as HTMLElement;
    expect(likesList).toBeInTheDocument();
    const dislikesList = within(splitStack)
      .queryByTestId('favourites-least') as HTMLElement;
    expect(dislikesList).toBeInTheDocument();

    expect(SplitStack).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        alignment : 'start',
        stack : expect.arrayContaining(['mobile', 'wide']),
      }),
    );
  });

  it('renders favourites layout in divided split stack', () => {
    const { container } = render(Profile);

    const splitStack = within(container)
      .queryByTestId('splitStack-divide') as HTMLElement;
    expect(splitStack).toBeInTheDocument();
    const first = within(splitStack).queryByTestId('splitStack') as HTMLElement;
    expect(first).toBeInTheDocument();
    const second = within(splitStack)
      .queryByTestId('splitStack-start') as HTMLElement;
    expect(second).toBeInTheDocument();

    expect(SplitStack).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        divide : true,
        stack : expect.arrayContaining(['mobile', 'tablet', 'desktop']),
      }),
    );
  });

  it('does not render nav links if not configured', () => {
    setConfig({ profileLinks : [] });

    const { container } = render(Profile);

    const nav = within(container).queryByTestId('navLinks') as HTMLElement;
    expect(nav).not.toBeInTheDocument();
    expect(NavLinks).not.toHaveBeenCalled();
  });

  it('renders configured nav links', () => {
    const expectedLinks = [
      { href : '/test1', text : 'Test Link 1' },
      { href : '/test2', text : 'Test Link 2' },
    ];
    setConfig({ profileLinks : expectedLinks });

    const { container } = render(Profile);

    const nav = within(container).queryByTestId('navLinks') as HTMLElement;
    expect(nav).toBeInTheDocument();

    expect(NavLinks).toHaveBeenCalledOnce();
    expect(NavLinks).toHaveBeenCalledWithProps(expect.objectContaining({
      links : expectedLinks,
      justify : 'start',
    }));
  });
});
