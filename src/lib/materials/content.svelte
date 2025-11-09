<script lang="ts">
  import type { Snippet } from 'svelte';
  import useThemes from '$lib/hooks/useThemes';
  import Background from './background.svelte';

  const {
    section = 'default',
    hasTopNav = false,
    hasBottomNav = false,
    alignment = 'left',
    justification = 'top',
    children,
  } : {
    section ?: 'default'
      | 'profile'
      | 'contact'
      | 'article'
      | 'footer'
      | 'error';
    hasTopNav ?: boolean;
    hasBottomNav ?: boolean;
    alignment ?: 'left' | 'centre';
    justification ?: 'top' | 'centre';
    children ?: Snippet<[]>;
  } = $props();

  const { provider } = useThemes().makeProvider({ sectionKey : section });

  const classes = ['layout'];
  if (hasTopNav) classes.push('top-nav');

  const align = alignment === 'centre' ? 'center' : 'flex-start';
  // shift vertical centred layout to align top nav or bottom links
  const justify = ((hasTopNav || hasBottomNav) && justification === 'centre')
    ? 'space-between'
    : justification === 'centre' ? 'center' : 'flex-start';
</script>

<section class={provider.class}>
  <Background>
    <div
      class={classes.join(' ')}
      style="--content-align: {align}; --content-justify: {justify};"
    >
      <!-- add placeholder to align vertically asymmetrical layout -->
      {#if (!hasTopNav && hasBottomNav) && (justification === 'centre')}
        <div class="placeholder"></div>
      {/if}
      {@render children?.()}
      {#if (hasTopNav && !hasBottomNav) && (justification === 'centre')}
        <div class="placeholder"></div>
      {/if}
    </div>
  </Background>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  section:first-child {
    flex-grow: 1;
  }

  .layout {
    display: flex;
    flex-grow: 1;
    width: 100%;
    flex-direction: column;
    justify-content: var(--content-justify);
    align-items: var(--content-align);
    gap: var(--layout-spacing);
    padding: calc(2 *var(--layout-spacing, 0) * var(--layout-scale, 1));
  }

  .top-nav {
    padding-top: calc((var(--layout-spacing, 0) / 2 ) * var(--layout-scale, 1));
  }

  .placeholder {
    width: 100%;
    height: 0;
  }
</style>
