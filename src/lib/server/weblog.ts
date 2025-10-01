import { fetchResource } from './http';

export async function loadArticle(
  basePath : string,
  article : string,
  { fetch } : { fetch : typeof window.fetch; },
) {
  const url = `${basePath}/articles/${article}.md`;
  const content = (await fetchResource(url, { fetch })) ?? '';
  return content
    .replace(/(\]\([^)]+)\.md\)/g, '$1)')
    .replace(/(\]:.*)\.md/g, '$1');
}
