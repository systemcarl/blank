import type { NavigationEvent } from '@sveltejs/kit';
import * as Sentry from '@sentry/sveltekit';

import { log } from '$lib/utils/log';
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
  log({
    message : 'Unhandled error',
    error,
    event,
  }, { level : 'error' });
};

export const handleError = Sentry.handleErrorWithSentry(errorHandler);
