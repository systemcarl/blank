import type { NavigationEvent } from '@sveltejs/kit';
import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import * as Sentry from '@sentry/sveltekit';

import { handleError } from './hooks.client';

const handlerSpy = vi.hoisted(() => vi.fn());

vi.mock('$env/dynamic/public', () => ({
  env : {
    PUBLIC_ENVIRONMENT : 'test-environment',
    PUBLIC_SENTRY_DSN : 'test-dsn',
  },
}));
vi.mock('@sentry/sveltekit', () => ({
  init : vi.fn(),
  handleErrorWithSentry : vi.fn(handler => (args : unknown) => {
    handlerSpy(args);
    return handler(args);
  }),
}));

function stubError() { return new Error('Test error'); }
function stubEvent() {
  return {
    url : new URL('https://example.com/test'),
  } as NavigationEvent;
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

afterAll(() => { vi.restoreAllMocks(); });

describe('client hooks', () => {
  it('initializes Sentry error handling', async () => {
    await import('./hooks.client');

    expect(Sentry.init).toHaveBeenCalledWith({
      environment : 'test-environment',
      dsn : 'test-dsn',
      sendDefaultPii : true,
      integrations : [],
    });
  });
});

describe('error handler', () => {
  it('catches error with Sentry', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = stubError();
    const event = stubEvent();

    handleError({ error, event });

    expect(handlerSpy).toHaveBeenCalledWith({ error, event });
  });

  it('logs errors', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error')
      .mockImplementation(() => {});
    const error = stubError();
    const event = stubEvent();

    handleError({ error, event });

    expect(consoleErrorSpy)
      .toHaveBeenCalledWith('Unhandled error (client):', error, event);
    consoleErrorSpy.mockRestore();
  });
});
