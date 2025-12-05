<template>
  <div>
    <Navbar />

    <Contact />
  </div>
</template>

<script >
import Contact from '~/components/Contact.vue';
import Navbar from '~/components/Navbar.vue';

export default {
  components : {
    Navbar,
    Contact
  }
}
</script>
