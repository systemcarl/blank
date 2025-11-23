<script lang="ts">
  import useConfig from '$lib/hooks/useConfig';
  import useLocale from '$lib/hooks/useLocale';
  import Content from '$lib/materials/content.svelte';
  import Nav from '$lib/components/nav.svelte';
  import Profile from '$lib/components/profile.svelte';
  import Contact from '$lib/components/contact.svelte';
  import Highlight from '$lib/components/highlight.svelte';

  const { config } = useConfig();
  const { locale } = useLocale();

  const highlights = $config.highlights ?? [];
</script>

<Content
  section="profile"
  hasTopNav
  hasBottomNav
  alignment="centre"
  justification="centre"
>
  <Nav highlights contact/>
  <Profile />
</Content>
{#each highlights as highlight (highlight.id)}
  <Content section={highlight.section ?? 'default'}>
    <Highlight {highlight} />
  </Content>
{/each}
<Content section="contact">
  <Contact id="contact" />
</Content>

<svelte:head>
  {#if $locale.meta.title}
    <title>{$locale.meta.title}</title>
  {/if}
  {#if $locale.meta.description}
    <meta name="description" content="{$locale.meta.description}" />
  {/if}
</svelte:head>
