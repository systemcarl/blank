<script lang="ts">
  import type { Snippet } from 'svelte';
  const {
    divide = false,
    stackOrder = 'normal',
    stack = [],
    alignment = 'centre',
    children,
  } : {
    divide ?: boolean;
    stackOrder ?: 'normal' | 'reverse';
    stack ?: ('mobile' | 'tablet' | 'desktop' | 'wide' | 'never')[];
    alignment ?: 'start' | 'centre' | 'end';
    children ?: Snippet<[]>;
  } = $props();

  const classes = ['split-stack'];
  classes.push(`align-${alignment}`);
  if (divide) classes.push('divided');
  if (stackOrder === 'reverse') classes.push('reversed');
  stack.forEach(s => classes.push(`stack-${s}`));
</script>

<div class={classes.join(' ')}>
  {@render children?.()}
</div>
