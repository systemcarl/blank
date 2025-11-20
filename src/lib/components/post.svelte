<script lang="ts">
  import { renderArticle } from '$lib/utils/weblog';
  import Article from '$lib/materials/article.svelte';
  const { content } : { content ?: string; } = $props();
</script>

<Article content={renderArticle(content ?? '')} />
