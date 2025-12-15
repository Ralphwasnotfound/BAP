<template>
  <div class="relative">
    <Navbar />

    <!-- HERO WITH OVERLAYED ANNOUNCEMENTS -->
    <div class="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
      <!-- HERO BACKGROUND -->
      <HomePage />

      <!-- ANNOUNCEMENTS -->
      <div
        class="
          absolute
          bottom-4
          left-1/2
          -translate-x-1/2
          w-full
          max-w-md
          px-3

          md:bottom-6
          md:left-auto
          md:right-6
          md:translate-x-0
          md:max-w-lg
        "
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
