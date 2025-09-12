import { fetchJsonResource } from './http';

export async function loadConfig(
  { fetch } : { fetch : typeof window.fetch; },
) {
  return (await fetchJsonResource('/config.json', { fetch })) ?? {};
}
