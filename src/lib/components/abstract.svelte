<script lang="ts">
  import Heading from '$lib/materials/heading.svelte';
  import Link from '$lib/materials/link.svelte';
  import Post from './post.svelte';

  const {
    title = '',
    abstract = '',
    link = '#',
    datePublished = null,
    headingLevel = 3,
  } : {
    title ?: string;
    abstract ?: string;
    link ?: string;
    datePublished ?: Date | null;
    headingLevel ?: 2 | 3;
  } = $props();
</script>

<Heading level={headingLevel}>
  <Link href={link}>{ title }</Link>
</Heading>
<Post content={abstract} datePublished={datePublished} compact/>
