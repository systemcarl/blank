<script lang="ts">
  import type { Snippet } from 'svelte';
  import Text from './text.svelte';

  const { children } : { children : Snippet<[]>; } = $props();
</script>

<Text as="p" centred flex typography="tagline">
  {@render children()}
</Text>
