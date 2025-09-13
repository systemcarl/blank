<script lang="ts">
  import type { Snippet } from 'svelte';
  import Text from './text.svelte';

  const { level, children } : {
    level : 1 | 2 | 3 | 4 | 5 | 6;
    children : Snippet<[]>;
  } = $props();
</script>

<Text as={`h${level}`} typography={`heading-${level}`}>
  {@render children()}
</Text>
