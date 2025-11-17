<script lang="ts">
  import type { Snippet } from 'svelte';
  const { children } : { children ?: Snippet<[]>; } = $props();
</script>

<div>
  {@render children?.()}
</div>
