import { browser } from '$app/environment';

import * as themeStore from '$lib/stores/theme';

const handleStorageEvent = (event : StorageEvent) => {
  if (event.key !== 'theme') return;
  themeStore.setTheme(event.newValue, false);
  window.dispatchEvent(new CustomEvent(
    'themeUpdated',
    { detail : event.newValue },
  ));
};

let subscribed = false;
function subscribeLocalTheme() {
  if (!browser) return () => {};
  if (!subscribed) {
    subscribed = true;
    window.addEventListener('storage', handleStorageEvent);
  }
  return () => {
    if (subscribed) window.removeEventListener('storage', handleStorageEvent);
    subscribed = false;
  };
}

function makeProvider({ sectionKey, typographyKey, graphicKey } : {
  sectionKey ?: string;
  typographyKey ?: string;
  graphicKey ?: string;
}) {
  const classes : string[] = [];
  if (sectionKey) classes.push(`section-${sectionKey}`);
  if (typographyKey) classes.push(`typography-${typographyKey}`);
  if (graphicKey) classes.push(`graphic-${graphicKey}`);

  return {
    provider : { class : classes.join(' ') },
  };
}

function useThemes() {
  return {
    getThemes : themeStore.getThemes,
    setThemes : themeStore.setThemes,
    getTheme : themeStore.getTheme,
    setTheme : themeStore.setTheme,
    makeProvider,
    subscribeLocalTheme,
  };
}

export default useThemes;
