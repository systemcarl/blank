import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import { tryGet } from '$lib/utils/typing';
import SplitStack from '$lib/materials/splitStack.svelte';
import TitleCard from '$lib/materials/titleCard.svelte';
import Frame from '$lib/materials/frame.svelte';
import Graphic from '$lib/materials/graphic.svelte';

import Profile from './profile.svelte';

const locale = vi.hoisted(() => ({
  title : 'Test Title',
  subtitle : 'Test Subtitle',
}));

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

vi.mock('$lib/materials/splitStack.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'splitStack' }) };
});
vi.mock('$lib/materials/titleCard.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'titleCard' }) };
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

beforeEach(() => { vi.clearAllMocks(); });
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
      .queryByTestId('splitStack') as HTMLElement;
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
        breakpoint : 'desktop',
      }),
    );
    expect(TitleCard).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ divide : true }),
    );
  });
});
