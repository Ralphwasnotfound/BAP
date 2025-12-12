<template>
  <div class="flex min-h-screen">

    <!-- 🔵 SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- 🔶 MAIN CONTENT -->
    <main class="flex-1 ml-64 p-6 max-w-6xl">
      <h1 class="text-2xl font-bold mb-4">Activity Logs</h1>

      <!-- SEARCH + FILTER -->
      <div class="flex gap-4 items-center mb-6">

  <!-- SEARCH INPUT -->
  <div class="relative w-72">
    <input
      v-model="q"
      placeholder="Search description or action..."
      class="border px-4 py-2 rounded-full w-full pl-10 text-sm"
    />

    <!-- SEARCH ICON -->
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      width="30" height="30"
      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      fill="currentColor"
    >
      <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 
        19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 
        2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 
        15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 
        4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 
        15.8748 16.0247L16.0247 15.8748Z"/>
    </svg>
  </div>

  <!-- PAGE SIZE SELECTOR -->
  <select 
    v-model.number="pageSize" 
    class="border px-4 py-2 rounded-lg text-sm bg-white"
  >
    <option :value="10">10 rows</option>
    <option :value="20">20 rows</option>
    <option :value="50">50 rows</option>
    <option :value="100">100 rows</option>
  </select>

  <!-- REFRESH BUTTON -->
  <button 
    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
    @click="loadLogs"
  >
    Refresh
  </button>

  <!-- EXPORT BUTTON -->
  <button 
    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
    @click="exportLogsCSV"
  >
    Export CSV
  </button>

  <!-- FILTER COUNT BADGE -->
  <div 
    v-if="q.trim().length > 0 || filterAction.length > 0" 
    class="px-4 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm text-gray-600"
  >
    <span class="font-semibold">{{ logs.length }}</span>
    {{ logs.length === 1 ? "Item" : "Items" }}
  </div>

</div>


      <!-- TABLE -->
     <!-- CLEAN ACTIVITY LOGS TABLE -->
<div class="relative overflow-x-auto bg-white shadow rounded border">
  <table class="w-full text-sm text-left">

    <!-- HEADER -->
    <thead class="bg-gray-100 border-b">
      <tr>
        <th class="p-3 border">#</th>
        <th class="p-3 border">When</th>
        <th class="p-3 border">Action</th>
        <th class="p-3 border">Description</th>
        <th class="p-3 border">Admin</th>
        <th class="p-3 border">Person ID No.</th>
        <th class="p-3 border w-[100px] text-center">Details</th>
      </tr>
    </thead>

    <!-- BODY -->
    <tbody>
      <transition-group name="tableFade" as="template">
      
      <tr
        v-for="(log, idx) in logs"
        :key="log.id"
        class="hover:bg-gray-50 text-[13px]"
      >
        <!-- COUNT -->
        <td class="p-2 border text-gray-700">
          {{ idx + 1 + (page - 1) * pageSize }}
        </td>

        <!-- DATE -->
        <td class="p-2 border text-gray-600 whitespace-nowrap text-sm">
          {{ formatDate(log.created_at) }}
        </td>

        <!-- ACTION TAG -->
        <td class="p-2 border">
          <span
            :class="tagClass(log.action)"
            class="px-2 py-1 rounded text-white text-xs font-medium"
          >
            {{ log.action }}
          </span>
        </td>

        <!-- DESCRIPTION -->
        <td class="p-2 border max-w-[350px] text-gray-800">
          <div class="line-clamp-2">{{ log.description }}</div>
        </td>

        <!-- ADMIN -->
        <td class="p-2 border text-gray-700 text-sm">
          System Admin
        </td>

        <!-- PERSON -->
        <td class="p-2 border text-gray-700 text-sm">
          {{ log.person_id || "-" }}
        </td>

        <!-- DETAILS BUTTON -->
        <td class="p-2 border text-center">
          <button
            class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-[12px]"
            @click="openDetails(log)"
          >
            View
          </button>
        </td>
      </tr>
      </transition-group>

      <!-- EMPTY STATE -->
      <tr v-if="logs.length === 0">
        <td colspan="7" class="p-4 text-center text-gray-500">
          No logs found.
        </td>
      </tr>
    </tbody>
  </table>
</div>


      <!-- PAGINATION -->
      <div class="flex justify-between items-center mt-6">

  <!-- Left: Page Info -->
  <span class="text-sm text-gray-500 leading-tight">
    Page {{ page }} — Showing {{ logs.length }} rows
  </span>

  <!-- Right: Buttons -->
  <div class="flex gap-2">

    <!-- Prev -->
    <button
      :disabled="page === 1"
      class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
             text-gray-700 hover:bg-gray-200 hover:border-gray-400
             disabled:opacity-50 disabled:hover:bg-gray-100 transition"
      @click="page--, loadLogs()"
    >
      Prev
    </button>

    <!-- Next -->
    <button
      :disabled="logs.length < pageSize"
      class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
             text-gray-700 hover:bg-gray-200 hover:border-gray-400
             disabled:opacity-50 disabled:hover:bg-gray-100 transition"
      @click="page++, loadLogs()"
    >
      Next
    </button>

  </div>

</div>


      <!-- DETAILS MODAL -->
      <div
        v-if="detailsModal"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div class="bg-white w-full max-w-3xl p-6 rounded shadow-lg max-h-[80vh] overflow-auto">

          <!-- Header -->
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold">Activity details</h3>
            <button class="text-gray-600" @click="detailsModal = false">Close</button>
          </div>

          <!-- Body -->
          <div class="mt-4 text-sm">
            <p><strong>Action:</strong> {{ activeLog.action }}</p>
            <p><strong>Description:</strong> {{ activeLog.description }}</p>
            <p class="mt-2"><strong>When:</strong> {{ formatDate(activeLog.created_at) }}</p>

            <!-- METADATA -->
            <div v-if="hasMetadata" class="mt-6">

              <h4 class="font-semibold text-lg mb-3">
                Details
              </h4>

              <!-- UPDATE PERSON (before/after) -->
              <div v-if="metadata.changes" class="overflow-auto border rounded shadow-sm">
                <table class="w-full text-sm">
                  <thead class="bg-gray-200">
                    <tr>
                      <th class="p-2 border">Field</th>
                      <th class="p-2 border">Before</th>
                      <th class="p-2 border">After</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="c in metadata.changes" :key="c.field">
                      <td class="p-2 border font-medium capitalize">{{ c.field.replaceAll('_',' ') }}</td>
                      <td class="p-2 border text-red-600 font-semibold">{{ c.oldValue || '-' }}</td>
                      <td class="p-2 border text-green-700 font-semibold">{{ c.newValue || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- OTHER ACTIONS -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm">
                <div
                  v-for="(value, key) in metadata"
                  :key="key"
                  class="p-3 bg-gray-100 rounded border shadow-sm"
                >
                  <div class="font-semibold capitalize">{{ key.replaceAll('_',' ') }}</div>
                  <div class="mt-1 text-gray-900">{{ value || "-" }}</div>
                </div>
              </div>

              <!-- RAW JSON -->
              <div class="mt-4">
                <button class="text-blue-600 text-sm underline" @click="showRaw = !showRaw">
                  {{ showRaw ? "Hide Raw JSON" : "Show Raw JSON" }}
                </button>

                <pre
                  v-if="showRaw"
                  class="mt-2 bg-black text-green-400 p-3 text-xs rounded max-h-60 overflow-auto"
                >{{ pretty(metadata) }}</pre>
              </div>

            </div>
          </div>

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
        "addPerson",
        "updatedPerson",
        "deletedPerson",
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
        addPerson: "bg-green-600",
        updatedPerson: "bg-yellow-500",
        deletedPerson: "bg-red-600",
        downloadPDF: "bg-indigo-600",
        exportCSV: "bg-purple-600",
        exportExcel: "bg-purple-600"
      }[action] || "bg-gray-400";
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    /* ===========================================
       🔵 LOAD LOGS (with loading modal support)
       =========================================== */
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

    /* ===========================================
       🔶 OPEN DETAILS (show small loading effect)
       =========================================== */
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

    /* ===========================================
       📤 EXPORT CSV (with loading status)
       =========================================== */
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

    /* ===========================================
       🔴 LOGOUT
       =========================================== */
    confirmLogout() {
      this.showLogout = false;

      this.loading = true;
      this.loadingMessage = "Logging out...";

      this.supabase.auth.signOut().finally(() => {
        localStorage.removeItem("admin_verified");
        sessionStorage.removeItem("temporary_trust");
        this.loading = false;
        this.$router.push("/login");
      });
    }
  },

  /* ================================
     🔄 WATCHERS (auto-refresh logs)
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