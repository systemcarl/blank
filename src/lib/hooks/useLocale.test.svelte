<script lang="ts">
  import { get } from 'svelte/store';
  import { defaultLocale } from '$lib/utils/locale';
  import useLocale from './useLocale';

  interface Props {
    src ?: string;
    setLocale ?: () => typeof defaultLocale;
    getLocale ?: (locale : typeof defaultLocale) => void;
  }

  const props : Props = $props();

  const {
    locale,
  } = useLocale();

  $effect(() => {
    if (props.setLocale) locale.set(props.setLocale());
    if (props.getLocale) props.getLocale(get(locale));
  });
</script>
