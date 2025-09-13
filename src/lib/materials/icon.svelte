<script lang="ts">
  import Graphic from './graphic.svelte';
  const { graphic } : { graphic : string; } = $props();
</script>

<div class="icon">
  <Graphic graphic={graphic} />
</div>
