<script lang="ts">
  import type { Snippet } from 'svelte';
  import Text from './text.svelte';

  const { href, children } : {
    href : string;
    children : Snippet<[]>;
  } = $props();
</script>

<Text as="span" typography="link">
  <a href={href}>{@render children()}</a>
</Text>
