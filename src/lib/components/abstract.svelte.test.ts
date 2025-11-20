import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import Heading from '$lib/materials/heading.svelte';
import Link from '$lib/materials/link.svelte';
import Post from './post.svelte';
import Abstract from './abstract.svelte';

vi.mock('$lib/materials/heading.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'heading' }) };
});
vi.mock('$lib/materials/link.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'link' }) };
});
vi.mock('$lib/components/post.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'post' }) };
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('Abstract', () => {
  it('renders abstract title', async () => {
    const { container } = render(Abstract, {
      title : 'Test Title',
      abstract : 'This is the abstract body.',
      link : '/articles/test-article',
    });

    const heading = within(container)
      .queryByTestId('heading') as HTMLElement;
    expect(heading).toBeInTheDocument();
    const headingText = within(heading).getByText('Test Title');
    expect(headingText).toBeInTheDocument();

    expect(Heading).toHaveBeenCalledTimes(1);
    expect(Heading).toHaveBeenCalledWithProps(
      expect.objectContaining({ level : 3 }),
    );
  });

  it('renders abstract title link', async () => {
    const { container } = render(Abstract, {
      title : 'Test Title',
      abstract : 'This is the abstract body.',
      link : '/articles/test-article',
    });

    const heading = within(container)
      .queryByTestId('heading') as HTMLElement;
    expect(heading).toBeInTheDocument();
    const link = within(heading)
      .queryByTestId('link') as HTMLElement;
    expect(link).toBeInTheDocument();
    const headingText = within(link).getByText('Test Title');
    expect(headingText).toBeInTheDocument();

    expect(Link).toHaveBeenCalledTimes(1);
    expect(Link).toHaveBeenCalledWithProps(
      expect.objectContaining({ href : '/articles/test-article' }),
    );
  });

  it('renders abstract body as article content', async () => {
    const { container } = render(Abstract, {
      title : 'Test Title',
      abstract : 'This is the abstract body.',
      link : '/articles/test-article',
    });

    const article = within(container)
      .queryByTestId('post') as HTMLElement;
    expect(article).toBeInTheDocument();

    expect(Post).toHaveBeenCalledTimes(1);
    expect(Post).toHaveBeenCalledWithProps(
      expect.objectContaining({
        content : 'This is the abstract body.',
      }),
    );
  });

  it('renders abstract title before body', async () => {
    const { container } = render(Abstract, {
      title : 'Test Title',
      abstract : 'This is the abstract body.',
      link : '/articles/test-article',
    });

    const heading = within(container)
      .queryByText('Test Title') as HTMLElement;
    expect(heading).toBeInTheDocument();
    const body = within(container)
      .queryByText('This is the abstract body.') as HTMLElement;
    expect(body).toBeInTheDocument();
    expect(heading.compareDocumentPosition(body))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
