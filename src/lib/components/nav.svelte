<script lang="ts">
  import useLocale from '$lib/hooks/useLocale';
  import NavLinks from '$lib/materials/navLinks.svelte';

  const {
    home = false,
    contact = false,
  } : {
    home ?: boolean;
    contact ?: boolean;
  } = $props();

  const locale = useLocale().getLocale();

  const links : { text : string; href : string; }[] = [];
  if (home) links.push({ text : locale.nav.home, href : '/' });
  if (contact) links.push({ text : locale.nav.contact, href : '/#contact' });
</script>

<NavLinks links={links} justify="end" />
