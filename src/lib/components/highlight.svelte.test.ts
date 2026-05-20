import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import Heading from '$lib/materials/heading.svelte';
import ArticleIndex from './articleIndex.svelte';
import Highlight from './highlight.svelte';

const defaultLocale = vi.hoisted(() => ({
  highlights : { defaultHeading : 'Test Default Heading' },
}));

vi.mock('$lib/hooks/useLocale', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  const writable = (await import('svelte/store')).writable;
  return {
    default : () => ({
      ...originalDefault(),
      locale : writable(defaultLocale),
    }),
  };
});

vi.mock('$lib/materials/heading.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'heading' }) };
});
vi.mock('$lib/components/articleIndex.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'index' }) };
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('Highlight', () => {
  it('renders tag highlight heading', () => {
    const highlight = {
      id : 'test-highlight',
      type : 'tag',
      key : 'test',
      section : 'highlightTest',
      title : 'Test Tag Title',
    } as const;
    const { container } = render(Highlight, { highlight });

    const index = within(container)
      .queryByTestId('index') as HTMLElement;
    expect(index).toBeInTheDocument();
    const heading = within(container)
      .queryByTestId('heading') as HTMLElement;
    expect(heading).toBeInTheDocument();

    expect(Heading).toHaveBeenCalledTimes(1);
    expect(Heading).toHaveBeenCalledWithProps(
      expect.objectContaining({
        id : highlight.id,
        level : 2,
      }),
    );
    expect(heading).toHaveTextContent(highlight.title);

    expect(heading.compareDocumentPosition(index))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('renders default heading', () => {
    const highlight = {
      id : 'test-highlight',
      type : 'tag',
      key : 'test',
      section : 'highlightTest',
    } as const;
    const { container } = render(Highlight, { highlight });

    const heading = within(container)
      .queryByTestId('heading') as HTMLElement;
    expect(heading).toBeInTheDocument();

    expect(Heading).toHaveBeenCalledTimes(1);
    expect(Heading).toHaveBeenCalledWithProps(
      expect.objectContaining({
        id : highlight.id,
        level : 2,
      }),
    );
    expect(heading).toHaveTextContent(defaultLocale.highlights.defaultHeading);
  });

  it('renders article index with highlight tag', async () => {
    const highlight = {
      id : 'test-highlight',
      type : 'tag',
      key : 'test',
      section : 'highlightTest',
    } as const;
    const { container } = render(Highlight, { highlight });

    const index = within(container)
      .queryByTestId('index') as HTMLElement;
    expect(index).toBeInTheDocument();

    expect(ArticleIndex).toHaveBeenCalledTimes(1);
    expect(ArticleIndex).toHaveBeenCalledWithProps(
      expect.objectContaining({
        id : 'test-highlight',
        tag : 'test',
      }),
    );
  });
});
