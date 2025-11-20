import { get, writable } from 'svelte/store';

import type { WeblogIndex } from '$lib/utils/weblog';

let index = writable<WeblogIndex>({ articles : {}, tags : {} });

export function resetIndex() {
  index = writable<WeblogIndex>({ articles : {}, tags : {} });
}

export function setIndex(newIndex : WeblogIndex) {
  index.set(newIndex);
}

export function getIndex() {
  return get(index);
}
