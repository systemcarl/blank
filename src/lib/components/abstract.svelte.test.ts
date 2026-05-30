import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import Post from './post.svelte';
import Abstract from './abstract.svelte';

vi.mock('$lib/components/post.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'post' }) };
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('Abstract', () => {
  it('renders abstract body as article content', async () => {
    const expectedTitle = 'Test Title';
    const expectedContent = 'This is the abstract body.';
    const expectedDate = new Date();
    const expectedLink = '/articles/test-article';
    const expectedLevel = 2;
    const { container } = render(Abstract, {
      title : expectedTitle,
      abstract : expectedContent,
      link : expectedLink,
      datePublished : expectedDate,
      headingLevel : expectedLevel,
    });

    const article = within(container)
      .queryByTestId('post') as HTMLElement;
    expect(article).toBeInTheDocument();

    expect(Post).toHaveBeenCalledTimes(1);
    expect(Post).toHaveBeenCalledWithProps(
      expect.objectContaining({
        content : expectedContent,
        heading : expect.objectContaining({
          text : expectedTitle,
          href : expectedLink,
          level : expectedLevel,
        }),
        datePublished : expectedDate,
        compact : true,
      }),
    );
  });
});
