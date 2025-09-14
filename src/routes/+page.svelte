<script lang="ts">
  import Content from '$lib/materials/content.svelte';
  import NavLinks from '$lib/materials/navLinks.svelte';
  import Profile from '$lib/components/profile.svelte';
  import Contact from '$lib/components/contact.svelte';
</script>

<Content section="profile" hasNav verticalAlignment="centre">
  <NavLinks links={[{ text : '#Contact', href : '#contact' }]} justify="end" />
  <Profile />
</Content>
<Content section="contact">
  <Contact id="contact" />
</Content>
