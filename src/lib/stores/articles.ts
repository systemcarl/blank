import { get, writable } from 'svelte/store';

import { resolveWeblogIndex } from '$lib/utils/weblog';

let index = writable<unknown>();

export function resetIndex() {
  index = writable<unknown>();
}

export function setIndex(newLocale : unknown) {
  index.set(resolveWeblogIndex(newLocale));
}

export function getIndex() {
  return get(index);
}
