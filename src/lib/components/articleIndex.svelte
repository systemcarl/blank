<script lang="ts">
  import useArticles from '$lib/hooks/useArticles';
  import Grid from '$lib/materials/grid.svelte';
  import Heading from '$lib/materials/heading.svelte';
  import Abstract from '$lib/components/abstract.svelte';

  const { tag } : { tag ?: string; } = $props();

  const { getIndex } = useArticles();
  const index = getIndex();

  const title = tag ? (index.tags[tag]?.name ?? 'Articles') : 'All Articles';
  const articles = tag
    ? (index.tags[tag]?.articles ?? [])
    : Object.values(index.articles);
</script>

<Heading level={2}>{ title }</Heading>
<Grid>
  {#each articles as article (article.slug)}
    <Abstract
      title={article.title}
      abstract={article.abstract}
      link={`/articles/${article.slug}`}
    />
  {/each}
</Grid>
