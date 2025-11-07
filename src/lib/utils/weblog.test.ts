import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { within } from '@testing-library/dom';

import { renderArticle } from './weblog';

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('renderArticle', () => {
  it('renders plain text', () => {
    const text = 'Hello, world!';
    document.body.innerHTML = renderArticle(text);
    const { getByText } = within(document.body);
    const paragraph = getByText('Hello, world!');
    expect(paragraph.tagName).toBe('P');
  });

  it('renders bold text', () => {
    const text = 'This is **bold** text.';
    document.body.innerHTML = renderArticle(text);
    const { getByText } = within(document.body);
    const bold = getByText('bold');
    expect(bold.tagName).toBe('STRONG');
  });

  it('renders italic text', () => {
    const text = 'This is *italic* text.';
    document.body.innerHTML = renderArticle(text);
    const { getByText } = within(document.body);
    const italic = getByText('italic');
    expect(italic.tagName).toBe('EM');
  });

  it.each([1, 2, 3, 4, 5, 6])('renders heading level %i', (level) => {
    const text = `${'#'.repeat(level)} Heading ${level}\nHello, heading!`;
    document.body.innerHTML = renderArticle(text);
    const { getByText } = within(document.body);
    const heading = getByText(`Heading ${level}`);
    const paragraph = getByText('Hello, heading!');
    expect(heading.tagName).toBe(`H${level}`);
    expect(heading).toHaveClass('text');
    expect(heading).toHaveClass(`typography-heading-${level}`);
    expect(paragraph.tagName).toBe('P');
  });

  it('renders headers with slug IDs', () => {
    const text = '# My Header Title';
    document.body.innerHTML = renderArticle(text);
    const { getByText } = within(document.body);
    const header = getByText('My Header Title');
    expect(header.tagName).toBe('H1');
    expect(header).toHaveAttribute('id', 'my-header-title');
  });

  it('renders implicit links', () => {
    const text = 'This is a [link].\n\n[link]: https://example.com';
    document.body.innerHTML = renderArticle(text);
    const { getByText } = within(document.body);
    const link = getByText('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveClass('text');
    expect(link).toHaveClass('typography-link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders lists', () => {
    const text = '- Item 1\n- Item 2\n- Item 3';
    document.body.innerHTML = renderArticle(text);
    const { getByText } = within(document.body);
    const list = document.body.querySelector('ul');
    expect(list?.children).toHaveLength(3);
    expect(getByText('Item 1').tagName).toBe('LI');
    expect(getByText('Item 2').tagName).toBe('LI');
    expect(getByText('Item 3').tagName).toBe('LI');
  });

  it('renders footnotes', () => {
    const text = 'Here is a footnote.[^1]\n\n[^1]: This is the footnote.';
    document.body.innerHTML = renderArticle(text);
    const { getByText } = within(document.body);
    const footnoteSup = document.body.querySelector('sup');
    const footnoteRef = getByText('[1]');
    const href = footnoteRef.getAttribute('href') ?? '';
    const footnotes = document.body.querySelector('ol');
    const footnoteId = footnotes?.querySelector('li')?.getAttribute('id') ?? '';
    const footnote = getByText('This is the footnote.');

    expect(footnoteSup).toHaveClass('footnote-ref');
    expect(footnoteSup).toHaveClass('text');
    expect(footnoteSup).toHaveClass('typography-link');
    expect(footnoteSup).toHaveClass('typography-ref');
    expect(footnoteRef.tagName).toBe('A');
    expect(footnotes?.children).toHaveLength(1);
    expect(footnoteId).toBe(href.replace('#', ''));
    expect(footnote.tagName).toBe('P');
  });

  it('renders multiple footnote references without indices', () => {
    const text =
      'First footnote.[^1] Second footnote.[^1]\n\n[^1]: Footnote content.';
    document.body.innerHTML = renderArticle(text);
    const { getAllByText } = within(document.body);
    const footnoteRefs = getAllByText('[1]');
    expect(footnoteRefs).toHaveLength(2);
  });
});
