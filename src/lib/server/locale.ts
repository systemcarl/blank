import { fetchJsonResource } from './http';
import { buildLocale } from '$lib/utils/locale';

export async function loadLocale(
  { fetch } : { fetch : typeof window.fetch; },
) {
  const result = (await fetchJsonResource('/locale.json', { fetch })) ?? {};
  return buildLocale(result);
}
