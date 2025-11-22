import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';

import { loadAbstract, loadArticle } from '$lib/server/weblog';
import { config as configStore } from '$lib/stores/config';
import type { PageServerLoad } from './$types';

export const load : PageServerLoad = async ({ params, fetch }) => {
  const config = get(configStore);
  if (!params.path || !config.weblog.url) return { markdown : '' };

  const { title, body : abstract } =
    await loadAbstract(config.weblog.url, params.path, { fetch });
  const markdown = await loadArticle(config.weblog.url, params.path, { fetch });

  if (!markdown) { error(404, 'Article Not Found'); }

  return { title, abstract, markdown };
};
