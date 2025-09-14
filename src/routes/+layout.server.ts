import type { LayoutServerLoad } from './$types';
import { loadConfig } from '$lib/server/config';
import { loadLocale } from '$lib/server/locale';
import { loadThemes, loadGraphics } from '$lib/server/theme';

export const load : LayoutServerLoad = async ({ fetch }) => {
  const config = await loadConfig({ fetch });
  const locale = await loadLocale({ fetch });
  const themes = await loadThemes({ fetch });
  const graphics = await loadGraphics(themes, { fetch });
  return { config, locale, themes, graphics };
};
