<script lang="ts">
  import useLocale from '$lib/hooks/useLocale';
  import SplitStack from '$lib/materials/splitStack.svelte';
  import TitleCard from '$lib/materials/titleCard.svelte';
  import Tagline from '$lib/materials/tagline.svelte';
  import Graphic from '$lib/materials/graphic.svelte';
  import Frame from '$lib/materials/frame.svelte';

  const { getLocale } = useLocale();

  const locale = getLocale();
</script>

<SplitStack stackOrder="reverse" stack={['mobile', 'tablet']}>
  <Frame rotation={45}>
    <Graphic graphic="avatar" />
  </Frame>
  <TitleCard title={locale.title} subtitle={locale.subtitle} />
</SplitStack>
<Tagline>{ locale.tagline }</Tagline>
