<template>
  <div>
    <Navbar />

    <!-- HERO WITH OVERLAYED ANNOUNCEMENTS -->
    <div class="relative h-screen w-full overflow-hidden">

      <!-- HERO BACKGROUND -->
      <HomePage />

      <!-- ANNOUNCEMENTS FLOATING ON RIGHT SIDE -->
      <div
        class="absolute right-6 bottom-6 w-full max-w-lg px-2"
      >
        <AnnouncementList />
      </div>
    </div>

    <LoadingModal :show="loading" :message="loadingMessage" />
  </div>
</template>


<script>
import Navbar from '~/components/Nav/Navbar.vue'
import HomePage from '~/components/Nav/HomePage.vue'
import AnnouncementList from '~/components/Announcement/AnnouncementList.vue'
import LoadingModal from '~/components/Modals/LoadingModal.vue'

export default {
  components: {
    Navbar,
    HomePage,
    AnnouncementList,
    LoadingModal
  },

  data() {
    return {
      loading: false,
      loadingMessage: 'Loading...'
    }
  },

  mounted() {
    document.body.classList.add("no-scroll")
  },

  beforeUnmount() {
    document.body.classList.remove("no-scroll")
  }
}
</script>

<style>
.no-scroll {
  overflow: hidden !important;
}
</style>
