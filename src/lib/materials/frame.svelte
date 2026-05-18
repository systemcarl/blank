<script lang="ts">
  import type { Snippet } from 'svelte';
  import useThemes from '$lib/hooks/useThemes';

  import Graphic from './graphic.svelte';

  const { rotation = 0, show = true, children } : {
    rotation ?: number;
    show ?: boolean;
    children : Snippet<[]>;
  } = $props();
</script>

<div class="frame" style="--frame-rotation: {rotation}deg;">
  <div class="overlay">
    <Graphic graphic="frame" show={show}/>
  </div>
  <div class="frame-content">
    {@render children()}
  </div>
</div>
