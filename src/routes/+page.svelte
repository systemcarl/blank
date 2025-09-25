<script lang="ts">
  import Content from '$lib/materials/content.svelte';
  import Nav from '$lib/components/nav.svelte';
  import Profile from '$lib/components/profile.svelte';
  import Contact from '$lib/components/contact.svelte';
</script>

<Content section="profile" hasNav verticalAlignment="centre">
  <Nav contact/>
  <Profile />
</Content>
<Content section="contact">
  <Contact id="contact" />
</Content>
