import { buildConfig } from '$lib/utils/config';
import { fetchJsonResource } from './http';

export async function loadConfig(
  { fetch } : { fetch : typeof window.fetch; },
) {
  const result = (await fetchJsonResource('/config.json', { fetch })) ?? {};
  return buildConfig(result);
}
