<script lang="ts">
  import Heading from '$lib/materials/heading.svelte';
  import Link from '$lib/materials/link.svelte';
  import Post from '$lib/components/post.svelte';

  const {
    title = '',
    abstract = '',
    link = '#',
    headingLevel = 3,
  } : {
    title ?: string;
    abstract ?: string;
    link ?: string;
    headingLevel ?: 2 | 3;
  } = $props();
</script>

<Heading level={headingLevel}>
  <Link href={link}>{ title }</Link>
</Heading>
<Post content={abstract} />
