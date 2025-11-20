<script lang="ts">
  import type { Highlight } from '$lib/utils/config';
  import ArticleIndex from './articleIndex.svelte';

  const { highlight } : {
    highlight : Highlight;
  } = $props();
</script>

{#if highlight.type === 'tag'}
  <ArticleIndex id={highlight.id} tag={highlight.key} />
{/if}
