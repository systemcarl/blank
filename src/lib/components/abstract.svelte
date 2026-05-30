<script lang="ts">
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

<Post
  content={abstract}
  heading={{ text : title, href : link, level : headingLevel }}
  datePublished={datePublished}
  compact
/>
