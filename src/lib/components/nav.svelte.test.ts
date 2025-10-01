import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import NavLinks from '$lib/materials/navLinks.svelte';

import Nav from './nav.svelte';

const navLocale = vi.hoisted(() => ({
  nav : {
    home : 'Test Home',
    contact : 'Test Contact',
  } as Record<string, string>,
}));

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
});
