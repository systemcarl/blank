<script lang="ts">
  import type { Highlight } from '$lib/utils/config';
  import useLocale from '$lib/hooks/useLocale';
  import Heading from '$lib/materials/heading.svelte';
  import ArticleIndex from './articleIndex.svelte';
  import Post from './post.svelte';

  const {
    highlight,
    article,
  } : {
    highlight : Highlight;
    article ?: string;
  } = $props();

  const { locale } = useLocale();

  const title = $derived(highlight.title ?? $locale.highlights.defaultHeading);
</script>

<Heading id={highlight.id} level={2}>{title}</Heading>
{#if highlight.type === 'tag'}
  <ArticleIndex tag={highlight.key} />
{/if}
{#if highlight.type === 'article'}
  <Post content={article} />
{/if}
