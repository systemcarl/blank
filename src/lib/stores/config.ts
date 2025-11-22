import { writable } from 'svelte/store';
import { defaultConfig } from '$lib/utils/config';

export const config = writable(defaultConfig);

export function resetConfig() {
  config.set(defaultConfig);
}
