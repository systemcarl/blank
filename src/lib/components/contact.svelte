<script lang="ts">
  import useLocale from '$lib/hooks/useLocale';
  import Heading from '$lib/materials/heading.svelte';
  import ContactInfo from './contactInfo.svelte';

  const { id } : { id ?: string; } = $props();

  const locale = useLocale().getLocale();
</script>

<Heading id={id} level={2}>{ locale.contact.header }</Heading>
<ContactInfo />
