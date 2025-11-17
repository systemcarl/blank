<script lang="ts">
  const { content } : { content ?: string; } = $props();
</script>

<article class="text article typography-body">
  {@html content ?? ''}
</article>
