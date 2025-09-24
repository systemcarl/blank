<script lang="ts">
  import useLocale from '$lib/hooks/useLocale';
  import TitleCard from '$lib/materials/titleCard.svelte';

  const { status, message } : {
    status : number;
    message ?: string;
  } = $props();

  const { getLocale } = useLocale();
  const errorLocale = getLocale().errors;

  let detail : string = $state(errorLocale.default);
  if (status === 400) detail = errorLocale.invalid;
  if (status === 401) detail = errorLocale.notAuthenticated;
  if (status === 403) detail = errorLocale.forbidden;
  if (status === 404) detail = errorLocale.notFound;
  if (status === 500) detail = errorLocale.unexpected;
</script>

<TitleCard title={`${status} ${message}`} subtitle={detail} />
