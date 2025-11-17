<script lang="ts">
  import { renderArticle } from '$lib/utils/weblog';
  import Card from '$lib/materials/card.svelte';
  import Heading from '$lib/materials/heading.svelte';
  import Link from '$lib/materials/link.svelte';
  import Article from '$lib/materials/article.svelte';

  const { title = '', abstract = '', link = '#' } : {
    title ?: string;
    abstract ?: string;
    link ?: string;
  } = $props();
</script>

<Card>
  <Heading level={3}>
    <Link href={link}>{ title }</Link>
  </Heading>
  <Article content={renderArticle(abstract)} />
</Card>
