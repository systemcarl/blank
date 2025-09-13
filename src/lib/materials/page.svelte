<script lang="ts">
  const { children } = $props();
</script>

<main>
  {@render children()}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 340px;
    min-height: 100vh;
  }
</style>
