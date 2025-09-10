<script lang="ts">
  import type { Snippet } from 'svelte';
  const {
    divide = false,
    stackOrder = 'normal',
    stack = [],
    children,
  } : {
    divide ?: boolean;
    stackOrder ?: 'normal' | 'reverse';
    stack ?: ('mobile' | 'tablet' | 'desktop' | 'wide' | 'never')[];
    children ?: Snippet<[]>;
  } = $props();

  const classes = ['split-stack'];
  if (divide) classes.push('divided');
  if (stackOrder === 'reverse') classes.push('reversed');
  stack.forEach(s => classes.push(`stack-${s}`));
</script>

<div class={classes.join(' ')}>
  {@render children?.()}
</div>
