import { writable } from 'svelte/store';
import { defaultLocale } from '$lib/utils/locale';

export const locale = writable(defaultLocale);

export function resetLocale() {
  locale.set(defaultLocale);
}
