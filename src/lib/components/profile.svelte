<script lang="ts">
  import useConfig from '$lib/hooks/useConfig';
  import useLocale from '$lib/hooks/useLocale';
  import SplitStack from '$lib/materials/splitStack.svelte';
  import NavLinks from '$lib/materials/navLinks.svelte';
  import TitleCard from '$lib/materials/titleCard.svelte';
  import Tagline from '$lib/materials/tagline.svelte';
  import Graphic from '$lib/materials/graphic.svelte';
  import Frame from '$lib/materials/frame.svelte';

  import FavouriteList from './favouriteList.svelte';

  const { config } = useConfig();
  const { locale } = useLocale();
</script>

<SplitStack divide stack={['mobile', 'tablet', 'desktop']}>
  <SplitStack stack={['mobile', 'tablet', 'desktop', 'wide']}>
    <SplitStack stackOrder="reverse" stack={['mobile', 'tablet']}>
      <Frame rotation={45}>
        <Graphic graphic="avatar" />
      </Frame>
      <TitleCard title={$locale.title} subtitle={$locale.subtitle} />
    </SplitStack>
    <Tagline>{ $locale.tagline }</Tagline>
  </SplitStack>
  <SplitStack alignment="start" stack={['mobile', 'wide']}>
    <FavouriteList rank="most" headingElement="h2" />
    <FavouriteList rank="least" headingElement="h2" />
  </SplitStack>
</SplitStack>
{#if $config.profileLinks && ($config.profileLinks.length > 0)}
  <NavLinks links={$config.profileLinks} justify="start" />
{/if}
