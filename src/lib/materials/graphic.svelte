<script lang="ts">
  import { browser } from '$app/environment';
  import useGraphics from '$lib/hooks/useGraphics';
  import useThemes from '$lib/hooks/useThemes';

  const { src, graphic : graphicKey, alt } : {
    src ?: string;
    graphic ?: string;
    alt ?: string;
  } = $props();

  const { isGraphic, renderGraphic } = (() => useGraphics())();
  const { graphic, providerClasses } = (() => useThemes({ graphicKey }))();

  const content = $derived(
    browser ? renderGraphic(src ?? $graphic?.src ?? '') : '',
  );
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
