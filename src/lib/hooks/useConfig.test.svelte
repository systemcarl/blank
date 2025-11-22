<script lang="ts">
  import { get } from 'svelte/store';
  import { defaultConfig } from '$lib/utils/config';
  import useConfig from './useConfig';

  interface Props {
    src ?: string;
    setConfig ?: () => typeof defaultConfig;
    getConfig ?: (locale : typeof defaultConfig) => void;
  }

  const props : Props = $props();

  const {
    config,
  } = useConfig();

  $effect(() => {
    if (props.setConfig) config.set(props.setConfig());
    if (props.getConfig) props.getConfig(get(config));
  });
</script>
