import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import ArticleIndex from './articleIndex.svelte';
import Highlight from './highlight.svelte';

vi.mock('$lib/components/articleIndex.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'index' }) };
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('Highlight', () => {
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
