<script lang="ts">
  import { page } from '$app/state';
  import Content from '$lib/materials/content.svelte';
  import HttpError from '$lib/components/httpError.svelte';
</script>

<Content section="error" verticalAlignment="centre">
  <HttpError status={page.status} message={page.error?.message} />
</Content>
