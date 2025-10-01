import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import Content from '$lib/materials/content.svelte';
import Article from '$lib/materials/article.svelte';
import Nav from '$lib/components/nav.svelte';

import ArticlePage from './+page.svelte';

vi.mock('$lib/materials/content.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'content' }) };
});
vi.mock('$lib/materials/article.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'article' }) };
});
vi.mock('$lib/components/nav.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'nav' }) };
});

const data = {
  config : {},
  locale : {},
  themes : {},
  graphics : {},
  title : 'Test Title',
  abstract : 'Test Abstract',
  markdown : 'Test Content',
};

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('+page.svelte', () => {
  it('sets article theme section', () => {
    render(ArticlePage, { data });
    expect(Content).toHaveBeenCalledWithProps(expect.objectContaining({
      section : 'article',
      hasNav : true,
    }));
  });

  it('renders article main navigation', () => {
    const { container } = render(ArticlePage, { data });

    const content = within(container)
      .queryByTestId('content') as HTMLElement;
    expect(content).toBeInTheDocument();
    const nav = within(content).queryByTestId('nav') as HTMLElement;
    expect(nav).toBeInTheDocument();

    expect(Nav).toHaveBeenCalledOnce();
    expect(Nav).toHaveBeenCalledWithProps(expect.objectContaining({
      home : true,
      contact : true,
    }));
  });

  it('renders article content', () => {
    const { container } = render(ArticlePage, { data });
    const content = within(container)
      .queryByTestId('content') as HTMLElement;
    expect(content).toBeInTheDocument();
    const nav = within(content).queryByTestId('nav') as HTMLElement;
    const article = within(content).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    expect(article.compareDocumentPosition(nav))
      .toBe(Node.DOCUMENT_POSITION_PRECEDING);
    expect(Article).toHaveBeenCalledOnce();
    expect(Article).toHaveBeenCalledWithProps(expect.objectContaining({
      content : data.markdown,
    }));
  });

  it('adds article title to head', () => {
    render(ArticlePage, { data : { ...data, title : 'Test Article' } });
    const meta = document.head.querySelector('title');
    expect(meta).not.toBeNull();
    expect(meta?.textContent).toBe('Test Article');
  });

  it('adds placeholder title to head if not found', () => {
    render(ArticlePage, { data : { ...data, title : '' } });
    const meta = document.head.querySelector('title');
    expect(meta).not.toBeNull();
    expect(meta?.textContent).toBe('Article');
  });

  it('adds article abstract to head', () => {
    render(ArticlePage, { data : { ...data, abstract : 'Test abstract.' } });
    const meta = document.head.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute('content')).toBe('Test abstract.');
  });

  it('does not add abstract to head if not found', () => {
    render(ArticlePage, { data : { ...data, abstract : '' } });
    const meta = document.head.querySelector('meta[name="description"]');
    expect(meta).toBeNull();
  });

  it('compresses abstract whitespace', () => {
    render(ArticlePage, { data : { ...data, abstract : 'Test\n  abstract.' } });
    const meta = document.head.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute('content')).toBe('Test abstract.');
  });
});
