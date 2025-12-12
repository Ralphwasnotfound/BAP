<template>
  <div>

    <!-- NAVBAR -->
    <Navbar />

    <!-- GLOBAL LOADING OVERLAY -->
    <LoadingModal :show="loading" message="Loading people..." />

    <!-- PAGE CONTENT -->
    <div v-show="!loading">
      <PeopleTable @loaded="handleLoaded" />
    </div>

  </div>
</template>

<script>
import Navbar from '~/components/Nav/Navbar.vue'
import PeopleTable from '~/components/Nav/PeopleTable.vue'
import LoadingModal from '~/components/Modals/LoadingModal.vue'

export default {
  components: {
    Navbar,
    PeopleTable,
    LoadingModal,
  },

  data() {
    return {
      loading: true,
    }
  },

  methods: {
    handleLoaded() {
      // Turn off loading AFTER table is fully loaded
      this.loading = false;
    }
  }
}
</script>
