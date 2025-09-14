<script lang="ts">
  import Text from './text.svelte';
  import Link from './link.svelte';

  const { links = [], justify = 'start' } : {
    justify ?: 'start' | 'end';
    links : { text : string; href : string; }[];
  } = $props();

  let className = `justify-${justify}`;
</script>

{#if links.length > 0}
  <nav class={className}>
    <ul>
      {#each links as { text, href } (text)}
        <li>
          <Text as="span" typography="nav">
            <Link href={href}>{ text }</Link>
          </Text>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<style>
  nav {
    display: flex;
    flex-direction: row;
    gap : var(--padding-inset);
    width: 100%;
    margin: calc(var(--padding-inset) / 4) 0;
  }

  .justify-start {
    justify-content: flex-start;
  }

  .justify-end {
    justify-content: flex-end;
  }

  ul, li {
    display: contents;
  }
</style>
