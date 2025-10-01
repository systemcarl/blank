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

vi.mock('$lib/utils/weblog', () => ({
  renderArticle : () => '<p data-testid="article-content">Test Article</p>',
}));

beforeAll(async () => await loadStyles());
beforeEach(() => { vi.clearAllMocks(); });

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
    console.log({ shadow : articleStyle.boxShadow });
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
