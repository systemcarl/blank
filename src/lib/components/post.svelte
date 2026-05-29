<script lang="ts">
  import {
    type Contribution,
    extractArticle,
    renderArticle,
  } from '$lib/utils/weblog';
  import useConfig from '$lib/hooks/useConfig';
  import Stack from '$lib/materials/stack.svelte';
  import Article from '$lib/materials/article.svelte';
  import Dateline from './dateline.svelte';
  import Byline from './byline.svelte';

  const {
    content,
    datePublished,
    contributions,
    compact = false,
  } : {
    content ?: string;
    datePublished ?: Date | null;
    contributions ?: Contribution[];
    compact ?: boolean;
  } = $props();

  const { config } = useConfig();

  const { title = '', body } = $derived.by(() => {
    const { title, body } = extractArticle(content || '');
    if (!title) return { body : renderArticle(body) };
    const sections = renderArticle([`# ${title}\n\n`, body]);
    return {
      title : sections[0] ?? '',
      body : sections[1] ?? '',
    };
  });

  const topCredits = $derived(
    contributions?.filter(c => $config.weblog?.topCredits.includes(c.slug)),
  );
  const bottomCredits = $derived(
    contributions?.filter(c => $config.weblog?.bottomCredits.includes(c.slug)),
  );
</script>

<Article>
  {@html title}
  <Dateline date={datePublished} />
  {#if topCredits?.length}
    <Byline contributions={topCredits} />
  {/if}
  {#if !compact}
    <Stack>{@html body}</Stack>
  {:else}
    {@html body}
  {/if}
  {#if bottomCredits.length}
    <Byline contributions={bottomCredits} />
  {/if}
</Article>
