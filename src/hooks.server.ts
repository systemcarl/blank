import type { RequestEvent } from '@sveltejs/kit';
import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/public';

Sentry.init({
  environment : env.PUBLIC_ENVIRONMENT,
  dsn : env.PUBLIC_SENTRY_DSN,
  sendDefaultPii : true,
});

function errorHandler({ error, event } : {
  error : unknown;
  event : RequestEvent;
}) {
  console.error('Unhandled error (server):', error, event);
};

export const handleError = Sentry.handleErrorWithSentry(errorHandler);

export const handle = Sentry.sentryHandle();
