import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import {
  extractArticle,
  renderArticle,
  type Contribution,
} from '$lib/utils/weblog';
import Stack from '$lib/materials/stack.svelte';
import Article from '$lib/materials/article.svelte';
import Dateline from './dateline.svelte';
import Byline from './byline.svelte';
import Post from './post.svelte';

const defaultConfig = vi.hoisted(() => ({
  weblog : {
    url : '',
    topCredits : [],
    bottomCredits : [],
  },
}));
let setConfig : ((value : unknown) => void) = vi.hoisted(() => () => {});

vi.mock('$lib/utils/weblog', () => ({
  extractArticle : vi.fn(() => ({})),
  renderArticle : vi.fn(() => ''),
}));

vi.mock('$lib/hooks/useConfig', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  const writable = (await import('svelte/store')).writable;
  const config = writable<unknown>();
  setConfig = (value : unknown) => config.set(value);
  return {
    default : () => ({
      ...originalDefault(),
      config,
    }),
  };
});

vi.mock('$lib/materials/stack.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'stack' }) };
});
vi.mock('$lib/materials/article.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'article' }) };
});
vi.mock('./dateline.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'dateline' }) };
});
vi.mock('./byline.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'byline' }) };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(extractArticle)
    .mockReturnValue({ title : '', body : 'Test Article' });
  vi.mocked(renderArticle as ((_ : string) => string))
    .mockReturnValue('<p data-testid="article-content">Test Article</p>');
  setConfig(defaultConfig);
});

afterAll(() => { vi.restoreAllMocks(); });

describe('Post', () => {
  it('renders article title', async () => {
    const expectedTitle = 'Test Title';
    const expectedBody = 'Test Content';
    const expectedMarkdown = [`# ${expectedTitle}\n\n`, `${expectedBody}`];
    const expectedContent = expectedMarkdown.join('');
    const expectedRender = [
      `<h1 data-testid="article-title">${expectedTitle}</h1>\n`,
      `<p data-testid="article-content">${expectedBody}</p>`,
    ];
    vi.mocked(extractArticle)
      .mockReturnValue({ title : expectedTitle, body : expectedBody });
    vi.mocked(renderArticle).mockReturnValue(expectedRender);

    const { container } = render(Post, { content : expectedContent });

    const article = within(container).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(expectedTitle);
    const heading = within(article).queryByTestId('article-title');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(expectedTitle);

    expect(renderArticle).toHaveBeenCalledExactlyOnceWith(expectedMarkdown);
    expect(Article).toHaveBeenCalledOnce();
  });

  it('renders content article', async () => {
    const expectedContent = 'Test Article';
    const expectedRender =
      `<p data-testid="article-content">${expectedContent}</p>`;
    vi.mocked(extractArticle)
      .mockReturnValue({ title : '', body : expectedContent });
    vi.mocked(renderArticle as ((_ : string) => string))
      .mockReturnValue(expectedRender);

    const { container } = render(Post, { content : expectedContent });

    const article = within(container).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(expectedContent);
    const heading = within(article).queryByRole('heading');
    expect(heading).not.toBeInTheDocument();
    const stack = within(article).queryByTestId('stack');
    expect(stack).toBeInTheDocument();
    const content = within(stack!).queryByTestId('article-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent(expectedContent);

    expect(extractArticle).toHaveBeenCalledExactlyOnceWith(expectedContent);
    expect(renderArticle).toHaveBeenCalledExactlyOnceWith(expectedContent);
    expect(Stack).toHaveBeenCalledOnce();
    expect(Article).toHaveBeenCalledOnce();
  });

  it('renders compact content article', async () => {
    const expectedContent = 'Test Article';
    const expectedRender =
      `<p data-testid="article-content">${expectedContent}</p>`;
    vi.mocked(extractArticle)
      .mockReturnValue({ title : '', body : expectedContent });
    vi.mocked(renderArticle as ((_ : string) => string))
      .mockReturnValue(expectedRender);

    const { container } = render(Post, {
      content : expectedContent,
      compact : true,
    });

    const article = within(container).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(expectedContent);
    const heading = within(article).queryByRole('heading');
    expect(heading).not.toBeInTheDocument();
    const stack = within(article).queryByTestId('stack');
    expect(stack).not.toBeInTheDocument();
    const content = within(article).queryByTestId('article-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent(expectedContent);

    expect(extractArticle).toHaveBeenCalledExactlyOnceWith(expectedContent);
    expect(renderArticle).toHaveBeenCalledExactlyOnceWith(expectedContent);
    expect(Stack).not.toHaveBeenCalled();
    expect(Article).toHaveBeenCalledOnce();
  });

  it('renders content title before article', async () => {
    const title = 'Test Title';
    const body = 'Test Content';
    const markdown = `# ${title}\n\n${body}`;
    const rendered = [
      `<h1 data-testid="article-title">${title}</h1>\n`,
      `<p data-testid="article-content">${body}</p>`,
    ];
    vi.mocked(extractArticle)
      .mockReturnValue({ title : title, body : body });
    vi.mocked(renderArticle).mockReturnValue(rendered);

    const { container } = render(Post, { content : markdown });

    const article = within(container).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    const heading = within(article).queryByRole('heading');
    expect(heading).toBeInTheDocument();
    const content = within(article).queryByTestId('article-content');
    expect(content).toBeInTheDocument();
    expect(heading?.compareDocumentPosition(content!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    expect(Article).toHaveBeenCalledTimes(1);
  });

  it('renders published dateline', async () => {
    const title = 'Test Title';
    const body = 'Test Content';
    const markdown = `# ${title}\n\n${body}`;
    const rendered = [
      `<h1 data-testid="article-title">${title}</h1>\n`,
      `<p data-testid="article-content">${body}</p>`,
    ];
    vi.mocked(extractArticle)
      .mockReturnValue({ title : title, body : body });
    vi.mocked(renderArticle).mockReturnValue(rendered);
    const expectedDate = new Date();

    const { container } = render(Post, {
      content : markdown,
      datePublished : expectedDate,
    });

    const article = within(container).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    const heading = within(article).queryByRole('heading');
    expect(heading).toBeInTheDocument();
    const dateline = within(article).queryByTestId('dateline');
    expect(dateline).toBeInTheDocument();
    const content = within(article).queryByTestId('article-content');
    expect(content).toBeInTheDocument();
    expect(heading?.compareDocumentPosition(dateline!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(dateline?.compareDocumentPosition(content!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    expect(Dateline).toHaveBeenCalledOnce();
    expect(Dateline).toHaveBeenCalledWithProps(expect.objectContaining({
      date : expectedDate,
    }));
  });

  it('renders top credits', async () => {
    const config = {
      ...defaultConfig,
      weblog : {
        ...defaultConfig.weblog,
        topCredits : ['testA', 'testB'],
      },
    };
    const title = 'Test Title';
    const body = 'Test Content';
    const markdown = `# ${title}\n\n${body}`;
    const rendered = [
      `<h1 data-testid="article-title">${title}</h1>\n`,
      `<p data-testid="article-content">${body}</p>`,
    ];
    const expectedContribution = { slug : 'testA' } as Contribution;
    vi.mocked(extractArticle)
      .mockReturnValue({ title : title, body : body });
    vi.mocked(renderArticle).mockReturnValue(rendered);
    setConfig(config);

    const { container } = render(Post, {
      content : markdown,
      datePublished : new Date(),
      contributions : [
        expectedContribution,
        { slug : 'testC' } as Contribution,
      ],
    });

    const article = within(container).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    const dateline = within(article).queryByTestId('dateline');
    expect(dateline).toBeInTheDocument();
    const byline = within(article).queryByTestId('byline');
    expect(byline).toBeInTheDocument();
    const content = within(article).queryByTestId('article-content');
    expect(content).toBeInTheDocument();
    expect(dateline?.compareDocumentPosition(byline!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(byline?.compareDocumentPosition(content!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    expect(Byline).toHaveBeenCalledOnce();
    expect(Byline).toHaveBeenCalledWithProps(expect.objectContaining({
      contributions : [expectedContribution],
    }));
  });

  it('renders bottom credits', async () => {
    const config = {
      ...defaultConfig,
      weblog : {
        ...defaultConfig.weblog,
        bottomCredits : ['testA', 'testB'],
      },
    };
    const title = 'Test Title';
    const body = 'Test Content';
    const markdown = `# ${title}\n\n${body}`;
    const rendered = [
      `<h1 data-testid="article-title">${title}</h1>\n`,
      `<p data-testid="article-content">${body}</p>`,
    ];
    const expectedContribution = { slug : 'testA' } as Contribution;
    vi.mocked(extractArticle)
      .mockReturnValue({ title : title, body : body });
    vi.mocked(renderArticle).mockReturnValue(rendered);
    setConfig(config);

    const { container } = render(Post, {
      content : markdown,
      datePublished : new Date(),
      contributions : [
        expectedContribution,
        { slug : 'testC' } as Contribution,
      ],
    });

    const article = within(container).queryByTestId('article') as HTMLElement;
    expect(article).toBeInTheDocument();
    const content = within(article).queryByTestId('article-content');
    expect(content).toBeInTheDocument();
    const byline = within(article).queryByTestId('byline');
    expect(byline).toBeInTheDocument();
    expect(content?.compareDocumentPosition(byline!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    expect(Byline).toHaveBeenCalledOnce();
    expect(Byline).toHaveBeenCalledWithProps(expect.objectContaining({
      contributions : [expectedContribution],
    }));
  });
});
