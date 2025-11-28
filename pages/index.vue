<template>
  <div>
    <Navbar />
    <HomePage />
    <AnnouncementList/>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
import HomePage from '~/components/HomePage.vue'
import AnnouncementList from '~/components/Announcement/AnnouncementList.vue'
import Footer from '~/components/Footer.vue'
</script>

<style scoped>
</style>
