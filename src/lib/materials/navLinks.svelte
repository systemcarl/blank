<script lang="ts">
  import Text from './text.svelte';
  import Link from './link.svelte';

  const { links = [], direction = 'row', justify = 'start' } : {
    direction ?: 'row' | 'column';
    justify ?: 'start' | 'end';
    links : { text : string; href : string; }[];
  } = $props();

  let className = `justify-${justify}`;
</script>

{#if links.length > 0}
  <nav class={className} style="--direction: {direction};">
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
    flex-direction: var(--direction);
    flex-wrap: wrap;
    column-gap : var(--padding-inset);
    row-gap : calc(var(--padding-inset) / 2);
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

  @media (max-width: 767px) {
    nav {
      flex-direction: column;
    }

    .justify-end {
      align-items: flex-end;
    }
  }
</style>
