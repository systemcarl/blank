<script lang="ts">
  import useThemes from '$lib/hooks/useThemes';

  const { data, children } = $props();

  const { setThemes, subscribeLocalTheme } = useThemes();

  setThemes(data.themes);

  subscribeLocalTheme();
</script>

{@render children()}
