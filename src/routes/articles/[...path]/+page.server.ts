import type { PageServerLoad } from './$types';
import { loadAbstract, loadArticle } from '$lib/server/weblog';
import { getConfig } from '$lib/stores/config';

export const load : PageServerLoad = async ({ params, fetch }) => {
  const config = getConfig();
  if (!params.path || !config.weblog.url) return { markdown : '' };
  const { title, body : abstract } =
    await loadAbstract(config.weblog.url, params.path, { fetch });
  const markdown = await loadArticle(config.weblog.url, params.path, { fetch });
  return { title, abstract, markdown };
};
