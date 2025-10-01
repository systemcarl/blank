<script>
  import Content from '$lib/materials/content.svelte';
  import Article from '$lib/materials/article.svelte';
  import Nav from '$lib/components/nav.svelte';

  const { data } = $props();
  const description = (data?.abstract ?? '')
    ?.replace(/\r?\n|\r/g, ' ')
    ?.replace(/\s+/g, ' ')
    ?.trim();
</script>

<Content section="article" hasNav>
  <Nav home contact />
  <Article content={data.markdown} />
</Content>

<svelte:head>
  <title>{data.title || 'Article'}</title>
  {#if description}
    <meta name="description" content="{description}" />
  {/if}
</svelte:head>
