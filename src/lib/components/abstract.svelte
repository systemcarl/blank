<script lang="ts">
  import Heading from '$lib/materials/heading.svelte';
  import Link from '$lib/materials/link.svelte';
  import Post from '$lib/components/post.svelte';

  const { title = '', abstract = '', link = '#' } : {
    title ?: string;
    abstract ?: string;
    link ?: string;
  } = $props();
</script>

<Heading level={3}>
  <Link href={link}>{ title }</Link>
</Heading>
<Post content={abstract} />
