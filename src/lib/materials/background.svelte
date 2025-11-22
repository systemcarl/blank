<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import useTheme from '$lib/hooks/useThemes';
  import useGraphics from '$lib/hooks/useGraphics';
  import Graphic from './graphic.svelte';

  const { children } = $props();

  const { section } = useTheme();
  const { isGraphic } = useGraphics();

  let hasGraphic = $state<boolean>(true);

  if (browser) {
    const unsubscribe = section.subscribe((s) => {
      hasGraphic = !!s?.background.img
        && isGraphic(s?.background.img?.src ?? '');
    });
    onDestroy(unsubscribe);
  };
</script>

<div class="background">
  {@render children()}
  <div
    class="background-underlay"
    style={hasGraphic ? 'background-image: none;' : ''}
  >
    {#if hasGraphic}
      <div class="background-graphic">
        <Graphic src={$section?.background.img?.src} />
      </div>
    {/if}
  </div>
</div>

<style>
  .background {
    display: flex;
    position: relative;
    flex-grow: 1;
  }

  .background-underlay {
    position: absolute;
    inset: 0;
    z-index: var(--z-background);
    overflow: hidden;
    background-color: var(--bg-colour);
    background-image: var(--bg-img);
    background-size: var(--bg-size);
    background-repeat: var(--bg-repeat);
  }

  .background-graphic {
    position: absolute;
    inset: -10%;
    z-index: var(--z-graphic-overlay);
    opacity: var(--bg-opacity);
    background-size: var(--bg-size);
    background-repeat: var(--bg-repeat);
  }
</style>
