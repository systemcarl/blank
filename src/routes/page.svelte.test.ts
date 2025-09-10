import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { tryGet } from '$lib/utils/typing';
import { wrapOriginal } from '$lib/tests/component';
import Content from '$lib/materials/content.svelte';
import Profile from '$lib/components/profile.svelte';

import HomePage from './+page.svelte';

vi.mock('$lib/materials/content.svelte', async (original) => {
  return {
    default : await wrapOriginal(original, {
      testId : p =>
        `content-${tryGet(p, 'section', s => typeof s === 'string') ?? 'none'}`,
    }),
  };
});
vi.mock('$lib/components/profile.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'profile' }) };
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('+page.svelte', () => {
  it('renders profile', () => {
    const { container } = render(HomePage);

    const profile = within(container).queryByTestId('profile') as HTMLElement;
    expect(profile).toBeInTheDocument();

    expect(Profile).toHaveBeenCalledOnce();
  });

  it('set profile theme section', () => {
    const { container } = render(HomePage);

    const content = within(container)
      .queryByTestId('content-profile') as HTMLElement;
    expect(content).toBeInTheDocument();
    const profile = within(content).queryByTestId('profile') as HTMLElement;
    expect(profile).toBeInTheDocument();

    expect(Content).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ section : 'profile' }),
    );
  });

  it('centers profile content', () => {
    const { container } = render(HomePage);

    const content = within(container)
      .queryByTestId('content-profile') as HTMLElement;
    expect(content).toBeInTheDocument();
    const profile = within(content).queryByTestId('profile') as HTMLElement;
    expect(profile).toBeInTheDocument();

    expect(Content).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ verticalAlignment : 'centre' }),
    );
  });
});
