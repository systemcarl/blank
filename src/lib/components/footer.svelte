<script lang="ts">
  import useLocale from '$lib/hooks/useLocale';
  import Optional from '$lib/materials/optional.svelte';
  import SplitStack from '$lib/materials/splitStack.svelte';
  import NavLinks from '$lib/materials/navLinks.svelte';
  import Graphic from '$lib/materials/graphic.svelte';

  const { locale } = useLocale();
  const links = [
    { text : $locale.nav.home, href : '/' },
    { text : $locale.nav.contact, href : '/#contact' },
  ];
</script>

<footer>
  <SplitStack alignment="start" >
    <Optional display={['tablet', 'desktop', 'wide']}>
      <Graphic graphic="logo" alt={$locale.alt.logo} />
    </Optional>
    <NavLinks links={links} direction="column" />
  </SplitStack>
</footer>
