import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from '@testing-library/svelte';

import { loadStyles } from '$lib/tests/browser';
import { makeHtml } from '$lib/tests/component';
import Text from './text.svelte';
import Link from './link.svelte';

vi.mock('$lib/materials/text.svelte', { spy : true });

beforeAll(async () => await loadStyles());
beforeEach(() => { vi.clearAllMocks(); });

afterAll(() => { vi.restoreAllMocks(); });

describe('Link', () => {
  it('renders link text', async () => {
    const { container } = render(Link, {
      href : '/test',
      children : makeHtml('<span>Link Text</span>'),
    });

    expect(Text).toHaveBeenCalledOnce();
    expect(Text).toHaveBeenCalledWithProps(expect.objectContaining({
      as : 'span',
      typography : 'link',
    }));

    const content = page.elementLocator(container).getByText('Link Text');
    await expect.element(content).toBeInTheDocument();
  });

  it('renders link with href', async () => {
    const { container } = render(Link, {
      href : '/test',
      children : makeHtml('<span>Link Text</span>'),
    });

    const link = page.elementLocator(container).getByRole('link', {
      name : 'Link Text',
    });
    await expect.element(link).toBeInTheDocument();
    await expect.element(link).toHaveAttribute('href', '/test');
  });
});
