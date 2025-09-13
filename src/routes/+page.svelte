<script lang="ts">
  import Content from '$lib/materials/content.svelte';
  import Profile from '$lib/components/profile.svelte';
  import Contact from '$lib/components/contact.svelte';
</script>

<Content section="profile" verticalAlignment="centre">
  <Profile />
</Content>
<Content section="contact">
  <Contact />
</Content>
