import * as themeStore from '$lib/stores/theme';
import { get } from 'svelte/store';

export function isGraphic(src : string) {
  return src.endsWith('.svg');
}

export function renderGraphic(src : string) {
  return get(themeStore.graphics)[src] ?? '';
}

const useGraphics = () => {
  return {
    graphics : themeStore.graphics,
    isGraphic,
    renderGraphic,
  };
};

export default useGraphics;
