<script lang="ts">
  import type { Snippet } from 'svelte';
  import Text from './text.svelte';

  const { id, level, children } : {
    id ?: string;
    level : 1 | 2 | 3 | 4 | 5 | 6;
    children : Snippet<[]>;
  } = $props();
</script>

<Text id={id} as={`h${level}`} typography={`heading-${level}`}>
  {@render children()}
</Text>
