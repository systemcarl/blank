import { get, writable } from 'svelte/store';

import { buildConfig } from '$lib/utils/config';

let config = writable<unknown>();

export function resetConfig() {
  config = writable<unknown>();
}

export function setConfig(newConfig : unknown) {
  config.set(buildConfig(newConfig));
}

export function getConfig() {
  return buildConfig(get(config));
}
