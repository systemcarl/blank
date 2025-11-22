<script lang="ts">
  import { onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import useGraphics from '$lib/hooks/useGraphics';
  import useThemes from '$lib/hooks/useThemes';

  const { src, graphic : graphicKey, alt } : {
    src ?: string;
    graphic ?: string;
    alt ?: string;
  } = $props();

  const { isGraphic, renderGraphic } = useGraphics();
  const { graphic, providerClasses } = useThemes({ graphicKey });

  let content = $state<string>('');

  if (browser) {
    const unsubscribe = graphic.subscribe((g) => {
      content = renderGraphic(src ?? g?.src ?? '');
    });
    onDestroy(unsubscribe);
  };
</script>

{#if content}
  <div class={`${$providerClasses} graphic`} aria-hidden="true">
    {@html content}
  </div>
{:else if (!isGraphic(src ?? $graphic?.src ?? ''))}
  <img
    class="graphic"
    src={src ?? $graphic?.src ?? ''}
    alt={alt ?? $graphic?.alt ?? ''}
  />
{/if}
