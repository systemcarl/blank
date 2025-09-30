<script lang="ts">
  import { renderArticle } from '$lib/utils/weblog';
  const { content } : { content ?: string; } = $props();
</script>

<article class="text article typography-body">
  {@html renderArticle(content ?? '')}
</article>
