import { get, writable } from 'svelte/store';

import { defaultLocale } from '$lib/utils/locale';

let locale = writable(defaultLocale);

export function resetLocale() {
  locale = writable(defaultLocale);
}

export function setLocale(newLocale : typeof defaultLocale) {
  locale.set(newLocale);
}

export function getLocale() {
  return get(locale);
}
