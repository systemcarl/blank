import type { PageServerLoad } from './$types';
import { loadArticle } from '$lib/server/weblog';
import { getConfig } from '$lib/stores/config';

export const load : PageServerLoad = async ({ params, fetch }) => {
  const config = getConfig();
  if (!params.path || !config.weblog.url) return { markdown : '' };
  const markdown = await loadArticle(config.weblog.url, params.path, { fetch });
  return { markdown };
};
