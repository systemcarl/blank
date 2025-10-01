import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import Content from '$lib/materials/content.svelte';
import HttpError from '$lib/components/httpError.svelte';

import ErrorPage from './+error.svelte';

let status = vi.hoisted(() => 500);
let message = vi.hoisted(() => 'Test error');

vi.mock('$app/state', async () => ({
  page : {
    get status() { return status; },
    get error() { return { message }; },
  },
}));

vi.mock('$lib/materials/content.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'content' }) };
});
vi.mock('$lib/components/httpError.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'httpError' }) };
});

beforeEach(() => {
  vi.clearAllMocks();
  status = 500;
  message = 'Test error';
});

afterAll(() => { vi.restoreAllMocks(); });

describe('/+error.svelte', () => {
  it('set error theme section', () => {
    const { container } = render(ErrorPage);

    const content = within(container).queryByTestId('content') as HTMLElement;
    expect(content).toBeInTheDocument();
    const httpError =
      within(content).queryByTestId('httpError') as HTMLElement;
    expect(httpError).toBeInTheDocument();

    expect(Content).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ section : 'error' }),
    );
  });

  it('vertically centres content', () => {
    const { container } = render(ErrorPage);

    const content = within(container).queryByTestId('content') as HTMLElement;
    expect(content).toBeInTheDocument();
    const httpError =
      within(content).queryByTestId('httpError') as HTMLElement;
    expect(httpError).toBeInTheDocument();

    expect(Content).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        alignment : 'centre',
        justification : 'centre',
      }),
    );
  });

  it('displays error message in title card', () => {
    status = 418;
    message = `I'm a teapot`;
    render(ErrorPage);
    expect(HttpError).toHaveBeenCalledOnce();
    expect(HttpError).toHaveBeenCalledWithProps(expect.objectContaining({
      status,
      message,
    }));
  });
});
