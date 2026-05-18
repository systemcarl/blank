<script lang="ts">
  import type { Snippet } from 'svelte';
  import useThemes from '$lib/hooks/useThemes';
  import useGraphics from '$lib/hooks/useGraphics';
  import Graphic from './graphic.svelte';

  const { show = true, children } : {
    show ?: boolean;
    children : Snippet<[]>;
  } = $props();

  const { section } = (() => useThemes())();
  const { isGraphic } = (() => useGraphics())();

  const hasGraphic = $derived(!!$section?.background.img
    && isGraphic($section?.background.img?.src ?? ''));
  const underClass = $derived(
    'background-underlay' + ((!show || hasGraphic) ? ' bg-disabled' : ''),
  );
</script>

<div class="background">
  {@render children()}
  <div class={underClass}>
    {#if hasGraphic}
      <div class="background-graphic">
        <Graphic src={$section?.background.img?.src} show={show} />
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

  .background-underlay.bg-disabled {
    background-image: none;
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
