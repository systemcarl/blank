<script lang="ts">
  import useLocale from '$lib/hooks/useLocale';
  import Content from '$lib/materials/content.svelte';
  import Nav from '$lib/components/nav.svelte';
  import Profile from '$lib/components/profile.svelte';
  import Contact from '$lib/components/contact.svelte';

  const locale = useLocale().getLocale();
</script>

<Content section="profile" hasNav verticalAlignment="centre">
  <Nav contact/>
  <Profile />
</Content>
<Content section="contact">
  <Contact id="contact" />
</Content>

<svelte:head>
  {#if locale.meta.title}
    <title>{locale.meta.title}</title>
  {/if}
  {#if locale.meta.description}
    <meta name="description" content="{locale.meta.description}" />
  {/if}
</svelte:head>
