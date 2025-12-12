<template>
  <div>
    <Navbar />

    <Contact />
  </div>
</template>

<script >
import Contact from '~/components/Nav/Contact.vue';
import Navbar from '~/components/Nav/Navbar.vue';

export default {
  components : {
    Navbar,
    Contact
  }
}
</script>
