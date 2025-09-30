<script>
  import Content from '$lib/materials/content.svelte';
  import Article from '$lib/materials/article.svelte';
  import Nav from '$lib/components/nav.svelte';

  const { data } = $props();
</script>

<Content section="article" hasNav>
  <Nav home contact />
  <Article content={data.markdown} />
</Content>
