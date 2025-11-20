<script lang="ts">
  import useConfig from '$lib/hooks/useConfig';
  import useLocale from '$lib/hooks/useLocale';
  import NavLinks from '$lib/materials/navLinks.svelte';

  const {
    home = false,
    highlights = false,
    contact = false,
  } : {
    home ?: boolean;
    highlights ?: boolean;
    contact ?: boolean;
  } = $props();

  const config = useConfig().getConfig();
  const locale = useLocale().getLocale();

  const links : { text : string; href : string; }[] = [];
  if (highlights) {
    for (const highlight of (config.highlights ?? [])) {
      const text = locale.nav.highlights[highlight.id] || '';
      if (!text) continue;
      links.push({ text, href : `/#${highlight.id}` });
    }
  }
  if (home) links.push({ text : locale.nav.home, href : '/' });
  if (contact) links.push({ text : locale.nav.contact, href : '/#contact' });
</script>

<NavLinks links={links} justify="end" />
