import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import Article from '$lib/materials/article.svelte';
import Post from './post.svelte';

const renderMock = vi.fn();

vi.mock('$lib/utils/weblog', () => ({
  renderArticle : () => renderMock(),
}));

vi.mock('$lib/materials/article.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'article' }) };
});

beforeEach(() => {
  vi.clearAllMocks();
  renderMock
    .mockReturnValue('<p data-testid="article-content">Test Article</p>');
});

afterAll(() => { vi.restoreAllMocks(); });

describe('Post', () => {
  it('renders content article', async () => {
    const expectedContent = '<p data-testid="article-content">Test Article</p>';
    renderMock.mockReturnValue(expectedContent);

    const { container } = render(Post, { content : 'Test Article' });

    const article = within(container).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    expect(Article).toHaveBeenCalledTimes(1);
    expect(Article).toHaveBeenCalledWithProps(
      expect.objectContaining({ content : expectedContent }),
    );
  });
});
