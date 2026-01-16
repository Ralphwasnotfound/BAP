<template>
  <div class="flex min-h-screen bg-gray-100 py-10 md:py-0">

    <!-- SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-4 md:p-6 md:ml-64 space-y-6">

  <!-- PAGE TITLE -->
  <h1 class="text-2xl md:text-3xl font-bold">
    Admin Dashboard
  </h1>

  <!-- 🔹 QUICK STATS -->
  <!-- STATS GRID -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

  <div class="bg-white rounded-xl border shadow p-4">
    <p class="text-sm text-gray-500">Total People</p>
    <p class="text-2xl font-bold text-gray-800">{{ stats.total }}</p>
  </div>

  <div class="bg-white rounded-xl border shadow p-4">
    <p class="text-sm text-gray-500">Active</p>
    <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
  </div>

  <div class="bg-white rounded-xl border shadow p-4">
    <p class="text-sm text-gray-500">Expiring Soon</p>
    <p class="text-2xl font-bold text-yellow-500">{{ stats.expiring }}</p>
  </div>

  <div class="bg-white rounded-xl border shadow p-4">
    <p class="text-sm text-gray-500">Expired</p>
    <p class="text-2xl font-bold text-red-600">{{ stats.expired }}</p>
  </div>

</div>


  <!-- 🔹 ANNOUNCEMENTS + ACTIVITY -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

    <!-- ANNOUNCEMENTS WIDGET -->
<div class="bg-white rounded-xl shadow border p-5 mt-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-semibold">Latest Announcements</h2>
    <NuxtLink
      to="/admin/announcements"
      class="text-sm text-blue-600 hover:underline"
    >
      View all
    </NuxtLink>
  </div>

  <!-- EMPTY STATE -->
  <div
    v-if="announcements.length === 0"
    class="text-sm text-gray-500 text-center py-4"
  >
    No announcements yet.
  </div>

  <!-- ANNOUNCEMENT LIST -->
  <div v-else class="space-y-3">
    <div
      v-for="a in announcements"
      :key="a.id"
      class="border rounded-lg p-3 hover:bg-gray-50 transition"
    >
      <p class="font-medium text-gray-800 truncate">
        {{ a.title }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        {{ new Date(a.created_at).toLocaleDateString() }}
      </p>
    </div>
  </div>
</div>

    <!-- ACTIVITY PIE CHART -->
    <div class="bg-white rounded-xl shadow border p-5">
      <h2 class="text-lg font-semibold mb-4">
        Activity Overview
      </h2>

      <div class="max-w-md mx-auto">
        <ActivityPieChart :activities="activities" />
      </div>
    </div>

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
      activities: [],
      announcements: [],
      stats: {
        total: 0,
        active: 0,
        expiring: 0,
        expired: 0
      },
    }
  },

  async mounted() {
    usePageTitle('Admin Dashboard')
    this.supabase = useSupabaseClient()

    setTimeout(async () => {
      await this.checkAdmin()
      await this.loadActivities()
      await this.loadAnnouncements()
      await this.loadStats()
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

      await this.logAdminLogout();

      await this.supabase.auth.signOut()

      localStorage.removeItem("admin_verified")
      sessionStorage.removeItem("temporary_trust")

      this.loading = false
      this.$router.replace("/login")
    },
    async loadAnnouncements() {
      const { data } = await this.supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      this.announcements = data || []
    },
    async loadStats() {
      const { data } = await this.supabase
        .from("people")
        .select("valid_until")

      const people = data || []

      const today = new Date()
      const soon = new Date()
      soon.setMonth(soon.getMonth() + 1)

      this.stats.total = people.length
      this.stats.active = 0
      this.stats.expiring = 0
      this.stats.expired = 0

      people.forEach(p => {
        const validUntil = new Date(p.valid_until)
        if (validUntil < today) this.stats.expired++
        else if (validUntil <= soon) this.stats.expiring++
        else this.stats.active++
      })
    },
    async logAdminLogout() {
  try {
    const { data } = await this.supabase.auth.getSession()
    const user = data?.session?.user
    if (!user) return

    await this.supabase.from("activity_logs").insert([{
      action: "adminLogout",
      description: "Admin logged out",
      person_id: null,        // ✅ IMPORTANT
      admin_id: user.id,
      metadata: {
        email: user.email
      },
      created_at: new Date().toISOString()
    }])
  } catch (err) {
    console.warn("Logout log skipped:", err)
  }
}


  }
}
</script>
