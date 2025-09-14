<script lang="ts">
  import type { Snippet } from 'svelte';

  import Graphic from './graphic.svelte';

  const { rotation = 0, children } : {
    rotation ?: number;
    children : Snippet<[]>;
  } = $props();
</script>

<div class="frame" style="--frame-rotation: {rotation}deg;">
  <div class="overlay">
    <Graphic graphic="frame" />
  </div>
  <div class="frame-content">
    {@render children()}
  </div>
</div>
