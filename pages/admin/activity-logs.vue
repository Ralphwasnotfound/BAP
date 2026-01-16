<template>
  <div class="flex min-h-screen md:py-0 py-10">

    <!--SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-4 sm:p-6 md:ml-64 max-w-6xl w-full">
      <h1 class="text-2xl font-bold mb-4">Activity Logs</h1>

      <!-- SEARCH + FILTER -->
      <div
        class="flex flex-col lg:flex-row gap-3 lg:gap-4 items-stretch lg:items-center mb-6"
      >

        <!-- SEARCH INPUT -->
        <div class="relative w-full lg:w-72">
          <input
            v-model="q"
            placeholder="Search description or action..."
            class="border px-4 py-2 rounded-full w-full pl-10 text-sm"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20" height="20"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            fill="currentColor"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 
              19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 
              2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168Z"/>
          </svg>
        </div>

        <!-- PAGE SIZE -->
        <select
          v-model.number="pageSize"
          class="border px-4 py-2 rounded-lg text-sm bg-white w-full sm:w-auto"
        >
          <option :value="10">10 rows</option>
          <option :value="20">20 rows</option>
          <option :value="50">50 rows</option>
          <option :value="100">100 rows</option>
        </select>

        <!-- ACTION BUTTONS -->
        <div class="flex flex-wrap gap-2 w-full lg:w-auto">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm w-full sm:w-auto"
            @click="loadLogs"
          >
            Refresh
          </button>

          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm w-full sm:w-auto"
            @click="exportLogsCSV"
          >
            Export CSV
          </button>
        </div>

        <!-- FILTER COUNT -->
        <div
          v-if="q.trim().length > 0 || filterAction.length > 0"
          class="px-4 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-600 self-start lg:self-center"
        >
          <span class="font-semibold">{{ logs.length }}</span>
          {{ logs.length === 1 ? "Item" : "Items" }}
        </div>

      </div>

      <!-- TABLE -->
      <div class="relative overflow-x-auto bg-white shadow rounded border">
        <table class="w-full min-w-[900px] text-sm text-left">

          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="p-3 border">#</th>
              <th class="p-3 border">When</th>
              <th class="p-3 border">Action</th>
              <th class="p-3 border">Description</th>
              <th class="p-3 border">Admin</th>
              <th class="p-3 border">Person ID No.</th>
              <th class="p-3 border text-center">Details</th>
            </tr>
          </thead>

          <tbody>
            <transition-group name="tableFade" as="template">
              <tr
                v-for="(log, idx) in logs"
                :key="log.id"
                class="hover:bg-gray-50 text-[13px]"
              >
                <td class="p-2 border">
                  {{ idx + 1 + (page - 1) * pageSize }}
                </td>

                <td class="p-2 border whitespace-nowrap">
                  {{ formatDate(log.created_at) }}
                </td>

                <td class="p-2 border">
                  <span
                    :class="tagClass(log.action)"
                    class="px-2 py-1 rounded text-white text-xs font-medium"
                  >
                    {{ log.action }}
                  </span>
                </td>

                <td class="p-2 border max-w-[350px]">
                  <div class="line-clamp-2">{{ log.description }}</div>
                </td>

                <td class="p-2 border">System Admin</td>

                <td class="p-2 border">
                  {{ log.person_id || "-" }}
                </td>

                <td class="p-2 border text-center">
                  <button
                    class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                    @click="openDetails(log)"
                  >
                    View
                  </button>
                </td>
              </tr>
            </transition-group>

            <tr v-if="logs.length === 0">
              <td colspan="7" class="p-4 text-center text-gray-500">
                No logs found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6"
      >
        <span class="text-sm text-gray-500">
          Page {{ page }} — Showing {{ logs.length }} rows
        </span>

        <div class="flex gap-2">
          <button
            :disabled="page === 1"
            class="px-4 py-2 bg-gray-100 border rounded-lg disabled:opacity-50"
            @click="page--, loadLogs()"
          >
            Prev
          </button>

          <button
            :disabled="logs.length < pageSize"
            class="px-4 py-2 bg-gray-100 border rounded-lg disabled:opacity-50"
            @click="page++, loadLogs()"
          >
            Next
          </button>
        </div>
      </div>
    </main>

    <!-- GLOBAL LOADING -->
    <LoadingModal :show="loading" :message="loadingMessage" />

    <!-- LOGOUT MODAL -->
    <LogoutConfirm
      :show="showLogout"
      @close="showLogout = false"
      @confirm="confirmLogout"
    />

  </div>
</template>


<script>
import AdminSideBar from "~/components/Admin/AdminSideBar.vue";
import LogoutConfirm from "~/components/Modals/LogoutConfirm.vue";
import LoadingModal from "~/components/Modals/LoadingModal.vue";
import { usePageTitle } from '~/composables/usePageTitle.js'

export default {
  components: { AdminSideBar, LogoutConfirm, LoadingModal },

  data() {
    return {
      supabase: null,
      showRaw: false,
      logs: [],
      page: 1,
      pageSize: 20,
      q: "",
      filterAction: "",
      actions: [
        "adminLogin",
        "adminLogout",

        "addPerson",
        "updatedPerson",
        "deletedPerson",

        "addAnnouncement",
        "updatedAnnouncement",
        "deletedAnnouncement",

        "downloadPDF",
        "exportCSV",
        "exportExcel"
      ],
      detailsModal: false,
      activeLog: {},
      metadata: {},

      // GLOBAL LOADING
      loading: false,
      loadingMessage: "Please wait...",

      showLogout: false
    };
  },

  mounted() {
    usePageTitle("Admin Activity Logs");
    this.supabase = useSupabaseClient();
    this.loadLogs(true); // initial load with loading modal
  },

  computed: {
    hasMetadata() {
      return this.metadata && Object.keys(this.metadata).length > 0;
    }
  },

  methods: {
    tagClass(action) {
      return {
        // Auth
        adminLogin: "bg-green-600",
        adminLogout: "bg-red-600",

        // People
        addPerson: "bg-green-600",
        updatedPerson: "bg-yellow-500",
        deletedPerson: "bg-red-600",

        // Announcements
        addAnnouncement: "bg-blue-600",
        updatedAnnouncement: "bg-orange-500",
        deletedAnnouncement: "bg-red-700",

        // Exports
        downloadPDF: "bg-indigo-600",
        exportCSV: "bg-purple-600",
        exportExcel: "bg-purple-600"
      }[action] || "bg-gray-400";
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    /* LOAD LOGS (with loading modal support) */
    async loadLogs(showLoader = false) {
      if (showLoader) {
        this.loading = true;
        this.loadingMessage = "Loading activity logs...";
      }

      try {
        let q = this.supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false });
      
        // Action filter
        if (this.filterAction) {
          q = q.eq("action", this.filterAction);
        }
      
        const { data, error } = await q;
      
        if (error) {
          console.error(error);
          this.logs = [];
          return;
        }
      
        let allLogs = data || [];
      
        // 🔍 FULL SEARCH (date + time + metadata + action + description)
        if (this.q.trim()) {
          const s = this.q.trim().toLowerCase();
        
          allLogs = allLogs.filter(log => {
            const created = new Date(log.created_at);
          
            // DATE formats
            const date1 = created.toLocaleDateString("en-US"); 
            const date2 = created.toISOString().slice(0, 10);
            const date3 = created.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
          
            // TIME formats
            const time1 = created.toLocaleTimeString("en-US");              // 3:15:22 PM
            const time2 = created.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); // 03:15 PM
            const time3 = created.toTimeString().slice(0, 5);               // 15:15
            const fullDateTime = `${date1} ${time1}`;                       // MM/DD/YYYY HH:mm:ss AM/PM
          
            return (
              (log.action || "").toLowerCase().includes(s) ||
              (log.description || "").toLowerCase().includes(s) ||
              (log.person_id || "").toString().includes(s) ||
              JSON.stringify(log.metadata || "").toLowerCase().includes(s) ||
          
              // Search date formats
              date1.toLowerCase().includes(s) ||
              date2.toLowerCase().includes(s) ||
              date3.toLowerCase().includes(s) ||
          
              // Search time formats
              time1.toLowerCase().includes(s) ||
              time2.toLowerCase().includes(s) ||
              time3.toLowerCase().includes(s) ||
              fullDateTime.toLowerCase().includes(s)
            );
          });
        }
      
        // PAGINATION
        const start = (this.page - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.logs = allLogs.slice(start, end);
      
      } catch (err) {
        console.error("Load logs error:", err);
      }
    
      if (showLoader) {
        setTimeout(() => (this.loading = false), 300);
      }
    },

    /*  OPEN DETAILS (show small loading effect) */
    openDetails(log) {
      this.loading = true;
      this.loadingMessage = "Loading log details...";

      setTimeout(() => {
        this.activeLog = log;

        try {
          this.metadata =
            typeof log.metadata === "string"
              ? JSON.parse(log.metadata)
              : log.metadata || {};
        } catch {
          this.metadata = {};
        }

        this.detailsModal = true;
        this.loading = false;
      }, 250);
    },

    pretty(obj) {
      try {
        return JSON.stringify(obj, null, 2);
      } catch {
        return String(obj);
      }
    },

    /* EXPORT CSV (with loading status) */
    async exportLogsCSV() {
      this.loading = true;
      this.loadingMessage = "Exporting logs...";

      try {
        let rows = this.logs;

        // If no rows on page, load up to 1000
        if (!rows.length) {
          const { data } = await this.supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1000);

          rows = data || [];
        }

        const header =
          "id,action,description,admin_id,person_id,metadata,created_at\n";

        const csv = rows
          .map((l) => {
            const metadata =
              typeof l.metadata === "object"
                ? JSON.stringify(l.metadata).replace(/"/g, '""')
                : l.metadata || "";

            return `${l.id},"${l.action}","${(l.description || "").replace(
              /"/g,
              '""'
            )}",${l.admin_id || ""},${l.person_id || ""},"${metadata}",${l.created_at}`;
          })
          .join("\n");

        const blob = new Blob([header + csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `activity_logs_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      } finally {
        this.loading = false;
      }
    },
    async logAdminLogout() {
      try {
        const { data } = await this.supabase.auth.getSession()
        const user = data?.session?.user
        if (!user) return
      
        await this.supabase.from("activity_logs").insert([{
          action: "adminLogout",
          description: "Admin logged out",
          person_id: null,   
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

    /* LOGOUT*/
    async confirmLogout() {
      this.showLogout = false;
      this.loading = true;
      this.loadingMessage = "Logging out...";

      await this.logAdminLogout();

      this.supabase.auth.signOut().finally(() => {
        localStorage.removeItem("admin_verified");
        sessionStorage.removeItem("temporary_trust");
        this.loading = false;
        this.$router.push("/login");
      });
    }
  },

  /* ================================
      WATCHERS (auto-refresh logs)
     ================================ */
  watch: {
    q() {
      this.page = 1;
      this.loadLogs(); // small refresh without modal
    },
    filterAction() {
      this.page = 1;
      this.loadLogs();
    },
    pageSize() {
      this.page = 1;
      this.loadLogs(true); // full reload with modal
    }
  }
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