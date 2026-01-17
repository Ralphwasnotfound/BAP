<template>
  <div class="flex min-h-screen py-10 md:py-0">

    <!-- SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN -->
    <main class="flex-1 p-4 sm:p-6 md:ml-64 max-w-5xl w-full">
      <h1 class="text-3xl font-bold mb-6">Notifications</h1>

      <!-- LEGEND + SEARCH -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

        <!-- STATUS LEGEND -->
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex gap-2 flex-wrap">
            <button
              class="px-3 py-1 rounded-full text-sm border"
              :class="statusFilter === '' ? 'bg-gray-200' : ''"
              @click="statusFilter = ''"
            >
              All
            </button>
          
            <button
              class="px-3 py-1 rounded-full text-sm border bg-green-300 text-green-700"
              :class="statusFilter === 'valid' ? 'ring-2 ring-green-400' : ''"
              @click="statusFilter = 'valid'"
            >
              Active
            </button>
          
            <button
              class="px-3 py-1 rounded-full text-sm border bg-yellow-300 text-yellow-800"
              :class="statusFilter === 'expiring' ? 'ring-2 ring-yellow-400' : ''"
              @click="statusFilter = 'expiring'"
            >
              Expiring Soon
            </button>
          
            <button
              class="px-3 py-1 rounded-full text-sm border bg-red-300 text-red-800"
              :class="statusFilter === 'expired' ? 'ring-2 ring-red-400' : ''"
              @click="statusFilter = 'expired'"
            >
              Expired
            </button>
          </div>
          <!-- TOTAL RESULTS -->
          <div
            v-if="(notifSearch.trim() || statusFilter) && filteredNotifications.length > 0"
            class="px-3 py-1 bg-gray-100 border rounded-full text-sm text-gray-500"
          >
            <span class="font-semibold">{{ filteredNotifications.length }}</span>
            {{ filteredNotifications.length === 1 ? 'Item' : 'Items' }}
          </div>
        </div>




        <!-- SEARCH -->
        <div class="relative w-full md:w-64">
          <input
            v-model="notifSearch"
            type="text"
            placeholder="Search by name or work ID"
            class="border px-3 py-2 rounded-full w-full pr-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            fill="rgba(173,184,194,1)"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168Z"/>
          </svg>
        </div>
      </div>

      <!-- TABLE -->
      <div class="relative overflow-x-auto bg-white shadow rounded border">
        <table class="w-full text-sm text-left min-w-[700px]">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="p-3 border">Name</th>
              <th class="p-3 border">Work ID</th>
              <th class="p-3 border">Message</th>
              <th class="p-3 border w-[160px]">Date</th>
            </tr>
          </thead>

          <tbody>
            <transition-group name="tableFade" as="template">
              <tr
                v-for="log in paginatedNotifications"
                :key="log.id"
                class="border text-[13px]"
                :class="getRowColor(log.person_id)"
              >
                <td class="p-2 border font-medium text-gray-900">
                  {{ getPersonName(log.person_id) }}
                </td>

                <td class="p-2 border text-gray-700">
                  {{ getPersonWorkID(log.person_id) }}
                </td>

                <td class="p-2 border text-gray-700 max-w-[350px]">
                  <div class="line-clamp-2">{{ log.message }}</div>
                </td>

                <td class="p-2 border text-gray-600 whitespace-nowrap">
                  {{
                    new Date(log.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                </td>
              </tr>
            </transition-group>

            <tr v-if="filteredNotifications.length === 0">
              <td colspan="4" class="p-4 text-center text-gray-500">
                No notifications found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <span class="text-sm text-gray-500">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <div class="flex gap-2">
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
                   hover:bg-gray-200 disabled:opacity-50 transition"
            :disabled="currentPage === 1"
            @click="goPrevPage"
          >
            Prev
          </button>

          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
                   hover:bg-gray-200 disabled:opacity-50 transition"
            :disabled="currentPage === totalPages"
            @click="goNextPage"
          >
            Next
          </button>
        </div>
      </div>

    </main>

    <LogoutConfirm
      :show="showLogout"
      @close="showLogout = false"
      @confirm="confirmLogout"
    />

    <LoadingModal :show="loading" :message="loadingMessage" />
  </div>
</template>


<script>
import AdminSideBar from "~/components/Admin/AdminSideBar.vue";
import LogoutConfirm from "~/components/Modals/LogoutConfirm.vue";
import LoadingModal from "~/components/Modals/LoadingModal.vue";
import { usePageTitle } from '~/composables/usePageTitle.js'

export default {
  components: {
    AdminSideBar,
    LogoutConfirm,
    LoadingModal,
  },

  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      supabase: null,
      showLogout: false,
      people: [],
      logs: [],
      peopleIndex: {},
      notifSearch: "",
      statusFilter: "",

      loading: false,
      loadingMessage: "Loading...",
    };
  },

  async mounted() {
    usePageTitle('Admin Notifications')
    this.supabase = useSupabaseClient();
    await this.checkAdmin();
    await this.loadPeople();
    await this.refreshNotifications();
  },

  computed: {
    paginatedNotifications() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredNotifications.slice(start, start + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.filteredNotifications.length / this.itemsPerPage) || 1;
    },
    filteredNotifications() {
  const s = this.notifSearch.toLowerCase();

  return this.logs.filter((log) => {
    const p = this.peopleIndex[log.person_id];
    if (!p) return false;

    // 🔍 Search filter
    const matchesSearch =
      !s ||
      `${p.first_name} ${p.middle_initial || ""} ${p.last_name}`
        .toLowerCase()
        .includes(s) ||
      (p.work_id || "").toLowerCase().includes(s);

    // 🚦 Status filter
    const status = this.getStatus(log.person_id);
    const matchesStatus =
      !this.statusFilter || status === this.statusFilter;

    return matchesSearch && matchesStatus;
  });
},

  },

  methods: {
    /* ----------------- SECURITY ----------------- */
    async checkAdmin() {
      const { data } = await this.supabase.auth.getSession();

      const verified = localStorage.getItem("admin_verified") === "true";
      const trusted = localStorage.getItem("trusted_device") === "true";
      const temp = sessionStorage.getItem("temporary_trust") === "true";

      if (!data.session || !verified || (!trusted && !temp)) {
        this.$router.push("/login");
      }
    },

    /* ----------------- LOAD PEOPLE ----------------- */
    async loadPeople() {
      try {
        this.loading = true;
        this.loadingMessage = "Loading people...";

        const { data } = await this.supabase
          .from("people")
          .select("id, first_name, middle_initial, last_name, suffix, work_id, valid_until");

        if (data) {
          this.people = data;
          data.forEach((p) => (this.peopleIndex[p.id] = p));
        }
      } finally {
        this.loading = false;
      }
    },

    /* ----------------- LOAD NOTIFICATIONS ----------------- */
    async refreshNotifications() {
      try {
        this.loading = true;
        this.loadingMessage = "Loading notifications...";

        const { data } = await this.supabase
          .from("notification_logs")
          .select("*")
          .order("created_at", { ascending: false });

        this.logs = data || [];
      } finally {
        this.loading = false;
      }
    },

    /* ----------------- HELPERS ----------------- */
    getPersonName(id) {
      const p = this.peopleIndex[id];
      if (!p) return "Unknown";

      const mi = p.middle_initial ? p.middle_initial + ". " : "";
      const suffix = p.suffix ? " " + p.suffix : "";
      return `${p.first_name} ${mi}${p.last_name}${suffix}`;
    },

    getPersonWorkID(id) {
      return this.peopleIndex[id]?.work_id || "-";
    },

    /* STATUS COLOR LOGIC */
   getRowColor(personId) {
  const p = this.peopleIndex[personId];
  if (!p || !p.valid_until) return "";

  const now = new Date();
  const expiry = new Date(p.valid_until);

  const diffMonths =
    (expiry.getFullYear() - now.getFullYear()) * 12 +
    (expiry.getMonth() - now.getMonth());

  if (diffMonths < 0) return "bg-red-300 text-red-700";
  if (diffMonths === 0) return "bg-red-300 text-red-700";
  if (diffMonths <= 2) return "bg-yellow-300 text-yellow-700";
  return "bg-green-300 text-green-700";
},


    /* ----------------- LOGOUT ----------------- */
    async confirmLogout() {
      this.showLogout = false;
      this.loading = true;
      this.loadingMessage = "Logging out...";

      await this.logAdminLogout();

      try {
        await this.supabase.auth.signOut();
      } catch (err) {
        console.error("Logout error:", err);
      }
    
      // Clear session flags
      localStorage.removeItem("admin_verified");
      sessionStorage.removeItem("temporary_trust");
    
      // Smooth UX delay
      setTimeout(() => {
        this.loading = false;
        this.$router.push("/login");
      }, 400);
    },
    goPrevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    goNextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
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
},
getStatus(personId) {
  const p = this.peopleIndex[personId];
  if (!p || !p.valid_until) return "unknown";

  const now = new Date();
  const expiry = new Date(p.valid_until);

  const diffMonths =
    (expiry.getFullYear() - now.getFullYear()) * 12 +
    (expiry.getMonth() - now.getMonth());

  if (diffMonths < 0 || diffMonths === 0) return "expired";
  if (diffMonths <= 2) return "expiring";
  return "valid";
},



  },
};
</script>

<style scoped>
  /* Fade + Slide animation for table rows */
.tableFade-enter-active,
.tableFade-leave-active {
  transition: all 0.35s ease;
}

.tableFade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.tableFade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

</style>
