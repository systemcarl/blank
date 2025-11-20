import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import NavLinks from '$lib/materials/navLinks.svelte';

import Nav from './nav.svelte';

const navConfig = vi.hoisted(() => ({
  highlights : [
    { id : 'highlight1', type : 'tag', key : 'tag1', section : 'section1' },
    { id : 'highlight2', type : 'tag', key : 'tag2', section : 'section2' },
  ],
}));
const navLocale = vi.hoisted(() => ({
  nav : {
    home : 'Test Home',
    highlights : {
      highlight1 : 'Highlight One',
      highlight2 : 'Highlight Two',
    },
    contact : 'Test Contact',
  } as Record<string, unknown>,
}));

vi.mock('$lib/hooks/useConfig', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  return {
    default : () => ({
      ...originalDefault(),
      getConfig : vi.fn(() => navConfig),
    }),
  };
});
vi.mock('$lib/hooks/useLocale', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  return {
    default : () => ({
      ...originalDefault(),
      getLocale : vi.fn(() => navLocale),
    }),
  };
});

vi.mock('$lib/materials/navLinks.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'navLinks' }) };
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('Nav', () => {
  it('renders nav links', () => {
    const { container } = render(Nav);

    const navLinks = within(container).queryByTestId('navLinks') as HTMLElement;
    expect(navLinks).toBeInTheDocument();

    expect(NavLinks).toHaveBeenCalledOnce();
    expect(NavLinks).toHaveBeenCalledWithProps(expect.objectContaining({
      justify : 'end',
      links : [],
    }));
  });

  it('populates nav links with highlights from config', () => {
    const { container } = render(Nav, { highlights : true });

    const navLinks = within(container).queryByTestId('navLinks') as HTMLElement;
    expect(navLinks).toBeInTheDocument();

    expect(NavLinks).toHaveBeenCalledOnce();
    expect(NavLinks).toHaveBeenCalledWithProps(expect.objectContaining({
      links : [
        { text : 'Highlight One', href : '/#highlight1' },
        { text : 'Highlight Two', href : '/#highlight2' },
      ],
    }));
  });

  it('populates nav links with home locale', () => {
    const { container } = render(Nav, { home : true });

    const navLinks = within(container).queryByTestId('navLinks') as HTMLElement;
    expect(navLinks).toBeInTheDocument();

    expect(NavLinks).toHaveBeenCalledOnce();
    expect(NavLinks).toHaveBeenCalledWithProps(expect.objectContaining({
      links : [{ text : 'Test Home', href : '/' }],
    }));
  });

  it('populates nav links with contact locale', () => {
    const { container } = render(Nav, { contact : true });

    const navLinks = within(container).queryByTestId('navLinks') as HTMLElement;
    expect(navLinks).toBeInTheDocument();

    expect(NavLinks).toHaveBeenCalledOnce();
    expect(NavLinks).toHaveBeenCalledWithProps(expect.objectContaining({
      links : [{ text : 'Test Contact', href : '/#contact' }],
    }));
  });

  it('lists links in correct order', () => {
    const { container } = render(Nav, {
      home : true,
      highlights : true,
      contact : true,
    });

    const navLinks = within(container).queryByTestId('navLinks') as HTMLElement;
    expect(navLinks).toBeInTheDocument();

    expect(NavLinks).toHaveBeenCalledOnce();
    expect(NavLinks).toHaveBeenCalledWithProps(expect.objectContaining({
      links : [
        { text : 'Highlight One', href : '/#highlight1' },
        { text : 'Highlight Two', href : '/#highlight2' },
        { text : 'Test Home', href : '/' },
        { text : 'Test Contact', href : '/#contact' },
      ],
    }));
  });
});
