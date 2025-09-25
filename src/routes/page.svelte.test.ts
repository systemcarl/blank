import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { tryGet } from '$lib/utils/typing';
import { wrapOriginal } from '$lib/tests/component';
import Content from '$lib/materials/content.svelte';
import Nav from '$lib/components/nav.svelte';
import Profile from '$lib/components/profile.svelte';
import Contact from '$lib/components/contact.svelte';

import HomePage from './+page.svelte';

vi.mock('$lib/materials/content.svelte', async (original) => {
  return {
    default : await wrapOriginal(original, {
      testId : p =>
        `content-${tryGet(p, 'section', s => typeof s === 'string') ?? 'none'}`,
    }),
  };
});
vi.mock('$lib/components/nav.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'nav' }) };
});
vi.mock('$lib/components/profile.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'profile' }) };
});
vi.mock('$lib/components/contact.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'contact' }) };
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

  it('renders profile main navigation', () => {
    const { container } = render(HomePage);

    const content = within(container)
      .queryByTestId('content-profile') as HTMLElement;
    expect(content).toBeInTheDocument();
    const nav = within(content).queryByTestId('nav') as HTMLElement;
    expect(nav).toBeInTheDocument();

    expect(Nav).toHaveBeenCalledOnce();
    expect(Nav).toHaveBeenCalledWithProps(expect.objectContaining({
      contact : true,
    }));
  });

  it('renders contact', () => {
    const { container } = render(HomePage);

    const contact = within(container).queryByTestId('contact') as HTMLElement;
    expect(contact).toBeInTheDocument();

    expect(Contact).toHaveBeenCalledOnce();
    expect(Contact).toHaveBeenCalledWithProps(expect.objectContaining({
      id : 'contact',
    }));
  });

  it('set contact theme section', () => {
    const { container } = render(HomePage);

    const content = within(container)
      .queryByTestId('content-contact') as HTMLElement;
    expect(content).toBeInTheDocument();
    const contact = within(content).queryByTestId('contact') as HTMLElement;
    expect(contact).toBeInTheDocument();

    expect(Content).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ section : 'contact' }),
    );
  });
});
