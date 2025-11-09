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
import Article from './article.svelte';

const renderMock = vi.fn();

vi.mock('$lib/utils/weblog', () => ({
  renderArticle : () => renderMock(),
}));

beforeAll(async () => await loadStyles());
beforeEach(() => {
  vi.clearAllMocks();
  renderMock
    .mockReturnValue('<p data-testid="article-content">Test Article</p>');
});

afterAll(() => { vi.restoreAllMocks(); });

describe('Article', () => {
  it('renders article content', async () => {
    const { container } = render(Article);
    const content = page.elementLocator(container)
      .getByTestId('article-content');
    await expect.element(content).toBeInTheDocument();
  });

  it('renders content scrim', async () => {
    const { container } = render(Article);

    container.style.setProperty('padding', '32px');
    container.style.setProperty('background-color', '#000');
    container.style.setProperty('--font-size', '16px');
    container.style.setProperty('--bg-colour', 'rgba(255, 255, 255, 0.9)');

    const article = page
      .elementLocator(container.firstElementChild as HTMLElement);
    const articleStyle = getComputedStyle(article.element());
    const backgroundAlpha = parseFloat(articleStyle.backgroundColor
      .match(/\/\s*([0-9.]+)/)?.[1] ?? '');
    const boxShadowBlur = articleStyle.boxShadow
      .match(/([0-9]+[a-z]+) [0-9]+[a-z]+$/)?.[1] ?? '';
    const boxShadowSpread = articleStyle.boxShadow
      .match(/([a-z0-9]+)$/)?.[1] ?? '';
    const boxShadowAlpha = parseFloat(articleStyle.boxShadow
      .match(/\/\s*([0-9.]+)/)?.[1] ?? '');
    expect(backgroundAlpha).toBeCloseTo(0.6, 2);
    expect(boxShadowAlpha).toBeCloseTo(0.6, 2);
    expect(boxShadowBlur).toBe('16px');
    expect(boxShadowSpread).toBe('16px');
  });

  it('renders inline code', async () => {
    renderMock
      .mockReturnValue('<p>This is '
        + '<code class="text code">inline_code</code>.</p>');
    const { container } = render(Article);

    container.style.setProperty('--border-radius', '2px');

    const article = page
      .elementLocator(container.firstElementChild as HTMLElement);
    const codeElement =
      article.getByText('inline_code').element() as HTMLElement;

    codeElement.style.setProperty('--text-bg-colour', 'rgb(111, 111, 111)');

    const codeStyle = getComputedStyle(codeElement);

    expect(codeStyle.backgroundColor).toBe('rgb(111, 111, 111)');
    expect(codeStyle.borderRadius).toBe('2px');
  });

  it('renders code blocks', async () => {
    renderMock
      .mockReturnValue('<pre><code class="text code-block">'
        + '<span class="text">const</span> x = 10;</code></pre>');
    const { container } = render(Article);

    container.style.setProperty('--padding-inset', '24px');
    container.style.setProperty('--border-radius', '8px');

    const article = page
      .elementLocator(container.firstElementChild as HTMLElement);
    const codeElement = article.element().querySelector('code') as HTMLElement;

    const keywordElement = page.elementLocator(codeElement)
      .getByText('const');

    codeElement.style.setProperty('background-color', 'rgb(111, 111, 111)');

    const codeStyle = getComputedStyle(codeElement);
    const keywordStyle = getComputedStyle(keywordElement.element());

    const articleBounds = article.element().getBoundingClientRect();
    const codeBounds = codeElement.getBoundingClientRect();

    expect(codeBounds.width).toEqual(articleBounds.width);

    expect(codeStyle.padding).toBe('12px');
    expect(codeStyle.borderRadius).toBe('8px');
    expect(codeStyle.backgroundColor).toBe('rgb(111, 111, 111)');
    expect(codeStyle.overflowX).toBe('auto');
    expect(keywordStyle.whiteSpace).toBe('pre');
  });

  it('limits max width to desktop size', async () => {
    await page.viewport(1040, 800);
    const { container } = render(Article);

    container.style.setProperty('width', '100%');
    container.style.setProperty('padding', '16px');
    container.style.setProperty('--layout-spacing', '16px');

    const article = page
      .elementLocator(container.firstElementChild as HTMLElement);
    const articleStyle = getComputedStyle(article.element());
    expect(articleStyle.width).toBe('992px');
    expect(articleStyle.marginLeft).toBe('8px');
    expect(articleStyle.marginRight).toBe('8px');
  });
});
