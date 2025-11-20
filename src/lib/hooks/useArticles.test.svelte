<script lang="ts">
  import type { WeblogIndex } from '$lib/utils/weblog';
  import useArticles from './useArticles';

  interface Props {
    src ?: string;
    setIndex ?: () => WeblogIndex;
    getIndex ?: (index : WeblogIndex) => void;
  }

  const props : Props = $props();

  const {
    setIndex,
    getIndex,
  } = useArticles();

  $effect(() => {
    if (props.setIndex) setIndex(props.setIndex());
    if (props.getIndex) props.getIndex(getIndex());
  });
</script>
