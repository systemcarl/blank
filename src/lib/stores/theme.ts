import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';

export const themes = writable<Record<string, unknown>>({});
export const graphics = writable<Record<string, string>>({});

const themeKey = writable('default');

export function resetThemes() {
  themes.set({});
  graphics.set({});
  themeKey.set('default');
}

function setTheme(key ?: string, setStorage = true) {
  const storedThemes = get(themes);
  if ((typeof key !== 'string') || !(key in storedThemes))
    key = Object.keys(storedThemes)[0];
  if (typeof key !== 'string') return;
  themeKey.set(key);
  if (browser && setStorage) localStorage.setItem('theme', key);
}

export const theme = {
  set : setTheme,
  subscribe : themeKey.subscribe,
};
