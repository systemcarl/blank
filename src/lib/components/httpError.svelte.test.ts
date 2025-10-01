import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import TitleCard from '$lib/materials/titleCard.svelte';

import HttpError from './httpError.svelte';

const errorLocale = vi.hoisted(() => ({
  errors : {
    default : 'Default Message',
    invalid : 'Invalid Message',
    notAuthenticated : 'Not Authenticated Message',
    forbidden : 'Forbidden Message',
    notFound : 'Not Found Message',
    unexpected : 'Unexpected Message',
  } as Record<string, string>,
}));

vi.mock('$lib/hooks/useLocale', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  return {
    default : () => ({
      ...originalDefault(),
      getLocale : vi.fn(() => errorLocale),
    }),
  };
});

vi.mock('$lib/materials/titleCard.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'titleCard' }) };
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('HttpError', () => {
  it.each([
    ['invalid', 400],
    ['notAuthenticated', 401],
    ['forbidden', 403],
    ['notFound', 404],
    ['default', 418],
    ['unexpected', 500],
  ])('displays %s error message in title card', (key, statusCode) => {
    render(HttpError, { status : statusCode, message : key });
    expect(TitleCard).toHaveBeenCalledOnce();
    expect(TitleCard).toHaveBeenCalledWithProps(expect.objectContaining({
      title : `${statusCode} ${key}`,
      subtitle : errorLocale.errors[key],
    }));
  });
});
