<script lang="ts">
  import type { Snippet } from 'svelte';
  const {
    display = [],
    children,
  } : {
    display ?: ('mobile' | 'tablet' | 'desktop' | 'wide')[];
    children : Snippet<[]>;
  } = $props();
</script>

<div class={`optional ${display.map(d => `display-${d}`).join(' ')}`}>
  {@render children?.()}
</div>
