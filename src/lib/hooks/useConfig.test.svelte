<script lang="ts">
  import { defaultConfig } from '$lib/utils/config';
  import useConfig from './useConfig';

  interface Props {
    src ?: string;
    setConfig ?: () => unknown;
    getConfig ?: (locale : typeof defaultConfig) => void;
  }

  const props : Props = $props();

  const {
    setConfig,
    getConfig,
  } = useConfig();

  $effect(() => {
    if (props.setConfig) setConfig(props.setConfig());
    if (props.getConfig) props.getConfig(getConfig());
  });
</script>
