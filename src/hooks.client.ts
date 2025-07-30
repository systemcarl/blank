import type { NavigationEvent } from '@sveltejs/kit';
import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/public';

Sentry.init({
  environment : env.PUBLIC_ENVIRONMENT,
  dsn : env.PUBLIC_SENTRY_DSN,
  sendDefaultPii : true,
  integrations : [],
});

function errorHandler({ error, event } : {
  error : unknown;
  event : NavigationEvent;
}) {
  console.error('Unhandled error (client):', error, event);
}

export const handleError = Sentry.handleErrorWithSentry(errorHandler);
