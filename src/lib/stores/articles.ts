import { writable } from 'svelte/store';
import type { WeblogIndex } from '$lib/utils/weblog';

export const index = writable<WeblogIndex>({ articles : {}, tags : {} });

export function resetIndex() {
  index.set({ articles : {}, tags : {} });
}
