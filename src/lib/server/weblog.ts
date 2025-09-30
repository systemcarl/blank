import { fetchResource } from './http';

export async function loadArticle(
  basePath : string,
  article : string,
  { fetch } : { fetch : typeof window.fetch; },
) {
  const url = `${basePath}/articles/${article}.md`;
  return (await fetchResource(url, { fetch })) ?? '';
}
