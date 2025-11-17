import { fetchResource, fetchJsonResource } from './http';

export async function loadIndex(
  basePath : string,
  { fetch } : { fetch : typeof window.fetch; },
) {
  basePath = basePath.endsWith('/') ? basePath : basePath + '/';
  const url = `${basePath}index.json`;
  return await fetchJsonResource(url, { fetch });
}

export async function loadAbstract(
  basePath : string,
  article : string,
  { fetch } : { fetch : typeof window.fetch; },
) {
  basePath = basePath.endsWith('/') ? basePath : basePath + '/';
  const url = `${basePath}abstracts/${article}.md`;
  const content = (await fetchResource(url, { fetch })) ?? '';
  const titleMatch = content.match(/^# (.+)$/m)?.[1] ?? '';
  const title = titleMatch.replace(/\\#/g, '').trim();
  const body = content.replace(/^# .+$/m, '').trim();
  return { title, body };
}

export async function loadArticle(
  basePath : string,
  article : string,
  { fetch } : { fetch : typeof window.fetch; },
) {
  if (!basePath.endsWith('/')) basePath += '/';
  const url = `${basePath}articles/${article}.md`;
  const content = (await fetchResource(url, { fetch })) ?? '';
  return content
    .replace(/(\]\(\.[^)]+?)\.md(?=[#?)])/g, '$1')
    .replace(/(\]:\s*\.[^)\s]+?)\.md(?=[#?\s]|$)/g, '$1');
}
