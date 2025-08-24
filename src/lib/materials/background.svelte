<script lang="ts">
  import { browser } from '$app/environment';
  import type { Section } from '$lib/utils/theme';
  import useTheme from '$lib/hooks/useThemes';
  import useGraphics from '$lib/hooks/useGraphics';
  import Graphic from './graphic.svelte';

  const { children } = $props();

  const { onSectionChange } = useTheme();
  const { isGraphic } = useGraphics();

  let section = $state<Section>();
  let hasGraphic = $state<boolean>(true);

  if (browser) {
    onSectionChange((s) => {
      section = s;
      hasGraphic = !!section?.background.img
        && isGraphic(section?.background.img?.src ?? '');
    });
  };
</script>

<div class="background" style={hasGraphic ? 'background-image: none;' : ''}>
  {@render children()}
  {#if hasGraphic}
    <div class="background-graphic">
      <Graphic src={section?.background.img?.src} />
    </div>
  {/if}
</div>

<style>
  .background {
    position: relative;
    display: flex;
  }

  .background-graphic {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    z-index: -9;
    opacity: var(--bg-opacity);
    background-size: var(--bg-size);
    background-repeat: var(--bg-repeat);
  }
</style>
