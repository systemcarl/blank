<script lang="ts">
  import { get } from 'svelte/store';
  import type { WeblogIndex } from '$lib/utils/weblog';
  import useArticles from './useArticles';

  interface Props {
    src ?: string;
    setIndex ?: () => WeblogIndex;
    getIndex ?: (index : WeblogIndex) => void;
  }

  const props : Props = $props();

  const {
    index,
  } = useArticles();

  $effect(() => {
    if (props.setIndex) index.set(props.setIndex());
    if (props.getIndex) props.getIndex(get(index));
  });
</script>
