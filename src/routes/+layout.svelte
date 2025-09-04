<script lang="ts">
  import { resolveUrl } from '$lib/utils/http';
  import useLocale from '$lib/hooks/useLocale';
  import useThemes from '$lib/hooks/useThemes';
  import useGraphics from '$lib/hooks/useGraphics';
  import Page from '$lib/materials/page.svelte';
  import { env } from '$env/dynamic/public';

  const { data, children } = $props();

  const { setLocale } = useLocale();
  const { setThemes, subscribeLocalTheme } = useThemes();
  const { setGraphics } = useGraphics();

  setLocale(data.locale);
  setThemes(data.themes);
  setGraphics(data.graphics);

  subscribeLocalTheme();
</script>

<Page>
  {@render children()}
</Page>

<svelte:head>
  {#if env.PUBLIC_FAVICON}
    <link rel="icon" href="{resolveUrl(env.PUBLIC_FAVICON).toString()}" />
  {/if}
</svelte:head>
