<script lang="ts">
  import { resolveUrl } from '$lib/utils/http';
  import useConfig from '$lib/hooks/useConfig';
  import useLocale from '$lib/hooks/useLocale';
  import useThemes from '$lib/hooks/useThemes';
  import useGraphics from '$lib/hooks/useGraphics';
  import useArticles from '$lib/hooks/useArticles';
  import Page from '$lib/materials/page.svelte';
  import { env } from '$env/dynamic/public';

  const { data, children } = $props();

  const { setConfig } = useConfig();
  const { setLocale } = useLocale();
  const { setThemes, subscribeLocalTheme } = useThemes();
  const { setGraphics } = useGraphics();
  const { setIndex } = useArticles();

  setConfig(data.config);
  setLocale(data.locale);
  setThemes(data.themes);
  setGraphics(data.graphics);
  setIndex(data.articleIndex);

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
