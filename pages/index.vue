<template>
  <div>
    <Navbar />
    <HomePage />
    <AnnouncementList/>
    <Footer />
  </div>
  <LoadingModal :show="loading" :message="loadingMessage" />
</template>

<script>
import Navbar from '~/components/Navbar.vue'
import HomePage from '~/components/HomePage.vue'
import AnnouncementList from '~/components/Announcement/AnnouncementList.vue'
import Footer from '~/components/Footer.vue'
import LoadingModal from '~/components/Loading/LoadingModal.vue'

export default {
  Navbar,
  HomePage,
  AnnouncementList,
  Footer,
  LoadingModal
}
</script>


