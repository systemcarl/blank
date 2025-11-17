import { get, writable } from 'svelte/store';
import { defaultConfig } from '$lib/utils/config';

let config = writable(defaultConfig);

export function resetConfig() {
  config = writable(defaultConfig);
}

export function setConfig(newConfig : typeof defaultConfig) {
  config.set(newConfig);
}

export function getConfig() {
  return get(config);
}
