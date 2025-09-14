<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './icon.svelte';

  const { icon, children } : {
    icon : string;
    children : Snippet<[]>;
  } = $props();
</script>

<li class="list-item">
  <Icon graphic={icon} />
  {@render children()}
</li>
