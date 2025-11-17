import type { LayoutServerLoad } from './$types';
import { loadConfig } from '$lib/server/config';
import { loadLocale } from '$lib/server/locale';
import { loadThemes, loadGraphics } from '$lib/server/theme';
import { loadIndex } from '$lib/server/weblog';

export const load : LayoutServerLoad = async ({ fetch }) => {
  const [themes, config] = await Promise.all([
    loadThemes({ fetch }),
    loadConfig({ fetch }),
  ]);
  const [locale, graphics, articleIndex] = await Promise.all([
    loadLocale({ fetch }),
    loadGraphics(themes, { fetch }),
    loadIndex(config.weblog.url, { fetch }),
  ]);

  return {
    config,
    locale,
    themes,
    graphics,
    articleIndex,
  };
};
