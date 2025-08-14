<script lang="ts">
  import useThemes from '$lib/hooks/useThemes';
  import useGraphics from '$lib/hooks/useGraphics';

  const { data, children } = $props();

  const { setThemes, subscribeLocalTheme } = useThemes();
  const { setGraphics } = useGraphics();

  setThemes(data.themes);
  setGraphics(data.graphics);

  subscribeLocalTheme();
</script>

{@render children()}
