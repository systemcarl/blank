<script lang="ts">
  import useLocale from '$lib/hooks/useLocale';
  import NavLinks from '$lib/materials/navLinks.svelte';

  const {
    contact = false,
  } : {
    contact ?: boolean;
  } = $props();

  const locale = useLocale().getLocale();

  const links : { text : string; href : string; }[] = [];
  if (contact) links.push({ text : locale.nav.contact, href : '#contact' });
</script>

<NavLinks links={links} justify="end" />
