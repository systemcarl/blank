<script lang="ts">
  import type { Snippet } from 'svelte';
  import useThemes from '$lib/hooks/useThemes';

  const {
    id,
    centred,
    flex,
    inset,
    typography = 'body',
    as = 'span',
    children,
  } : {
    id ?: string;
    centred ?: boolean;
    flex ?: boolean;
    inset ?: boolean;
    typography ?: 'body'
      | 'title'
      | 'subtitle'
      | 'heading-1'
      | 'heading-2'
      | 'heading-3'
      | 'heading-4'
      | 'heading-5'
      | 'heading-6'
      | 'link'
      | 'nav'
      | 'tagline'
      | 'list-header'
      | 'list-header-emphasis';
    as ?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
    children : Snippet<[]>;
  } = $props();

  const { providerClasses } = useThemes({ typographyKey : typography });

  const className = [$providerClasses, 'text'];
  if (centred) className.push('text-centred');
  if (flex) className.push('text-flex');
  if (inset) className.push('text-inset');
</script>

<svelte:element
  id={id}
  class="{className.join(' ')}"
  this={as}
>
  {@render children()}
</svelte:element>
