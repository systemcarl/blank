import { get } from 'svelte/store';
import type { RequestHandler } from '@sveltejs/kit';

import { themes } from '$lib/stores/theme';
import { compileStyles } from '$lib/utils/styles';

export const GET : RequestHandler = async () => {
  const styles = compileStyles(get(themes));

  return new Response((styles), {
    headers : {
      'Content-Type' : 'text/css',
    },
  });
};
