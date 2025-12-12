<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-6 ml-64">
      <h1 class="text-3xl font-bold mb-6">BAP Federation</h1>

      <!-- ⭐ CENTERED PIE CHART ONLY -->
      <div class="max-w-xl mx-auto">
        <ActivityPieChart :activities="activities" />
      </div>

    </main>

    <!-- LOGOUT MODAL -->
    <LogoutConfirm
      :show="showLogout"
      @close="showLogout = false"
      @confirm="confirmLogout"
    />
  </div>

  <LoadingModal :show="loading" :message="loadingMessage" />
</template>

<script>
import AdminSideBar from '~/components/Admin/AdminSideBar.vue'
import LogoutConfirm from "~/components/Modals/LogoutConfirm.vue"
import LoadingModal from '~/components/Modals/LoadingModal.vue'
import ActivityPieChart from '~/components/Admin/SideBarComponents/ActivityPieChart.vue'
import { usePageTitle } from '~/composables/usePageTitle.js'

export default {
  components: {
    AdminSideBar,
    LogoutConfirm,
    LoadingModal,
    ActivityPieChart
  },
  data() {
    return {
      supabase: null,
      showLogout: false,
      loading: false,
      loadingMessage: "Please wait...",
      activities: [] // ⭐ used only for pie chart
    }
  },

  async mounted() {
    usePageTitle('Admin Dashboard')
    this.supabase = useSupabaseClient()

    setTimeout(async () => {
      await this.checkAdmin()
      await this.loadActivities()
    }, 80)
  },

  methods: {
    async checkAdmin() {
      this.loading = true
      this.loadingMessage = "Validating admin session..."

      const { data } = await this.supabase.auth.getSession()

      const verified = localStorage.getItem("admin_verified") === "true"
      const trusted = localStorage.getItem("trusted_device") === "true"
      const temp = sessionStorage.getItem("temporary_trust") === "true"

      this.loading = false

      if (!data.session || !verified || (!trusted && !temp)) {
        this.$router.replace("/login")
      }
    },

    async loadActivities() {
      this.loading = true
      this.loadingMessage = "Loading activity logs..."

      const { data } = await this.supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })

      this.activities = data || []
      this.loading = false
    },

    async confirmLogout() {
      this.showLogout = false
      this.loading = true
      this.loadingMessage = "Logging out..."

      await this.supabase.auth.signOut()

      localStorage.removeItem("admin_verified")
      sessionStorage.removeItem("temporary_trust")

      this.loading = false
      this.$router.replace("/login")
    }
  }
}
</script>
