<template>
  <div class="flex min-h-screen">

    <!-- 🔵 SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 ml-64 p-6 max-w-3xl">
      <h1 class="text-3xl font-bold mb-6">Export Tools</h1>

      <p class="mb-6 text-gray-600">
        Export all people data using the buttons below.
      </p>

      <div class="flex gap-4">
        <button class="px-4 py-2 bg-green-600 text-white rounded" @click="exportCSV">
          Export CSV
        </button>

        <button class="px-4 py-2 bg-yellow-500 text-white rounded" @click="exportExcel">
          Export Excel
        </button>
      </div>
    </main>

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
import LogoutConfirm from "~/components/LogoutConfirm.vue";

export default {
  components: {
    AdminSideBar,
    LogoutConfirm
  },

  data() {
    return {
      showLogout: false,
      people: []
    };
  },

  async mounted() {
    await this.checkAdmin();
    await this.loadPeople();
  },

  methods: {
    /* ---------------- SECURITY CHECK ---------------- */
    async checkAdmin() {
      const { $supabase } = useNuxtApp();
      const { data } = await $supabase.auth.getSession();

      const verified = localStorage.getItem("admin_verified") === "true";
      const trusted = localStorage.getItem("trusted_device") === "true";
      const temp = sessionStorage.getItem("temporary_trust") === "true";

      if (!data.session || !verified || (!trusted && !temp)) {
        this.$router.push("/login");
      }
    },

    /* ---------------- LOAD ALL PEOPLE ---------------- */
    async loadPeople() {
      const { data } = await this.$supabase
        .from("people")
        .select("*")
        .order("id", { ascending: false });

      this.people = data || [];
    },

    /* ---------------- EXPORT CSV ---------------- */
    exportCSV() {
      if (!this.people.length) return;

      let csv = "Full Name,Work ID,Region,Designation,Expiry\n";

      this.people.forEach(p => {
        csv += `${p.last_name}, ${p.first_name} ${p.middle_initial},${p.work_id},${p.region},${p.designation},${p.expiry_date}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const link = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = link;
      a.download = "people.csv";
      a.click();
    },

    /* ---------------- EXPORT EXCEL ---------------- */
    exportExcel() {
      let table = `
      <table>
        <tr>
          <th>Name</th><th>Work ID</th><th>Region</th><th>Designation</th><th>Expiry</th>
        </tr>
        ${this.people
          .map(
            p => `
        <tr>
          <td>${p.first_name} ${p.middle_initial}. ${p.last_name}</td>
          <td>${p.work_id}</td>
          <td>${p.region}</td>
          <td>${p.designation}</td>
          <td>${p.expiry_date}</td>
        </tr>`
          )
          .join("")}
      </table>`;

      const blob = new Blob([table], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "people.xls";
      a.click();
    },

    /* ---------------- CONFIRM LOGOUT ---------------- */
    async confirmLogout() {
      this.showLogout = false;

      const { $supabase } = useNuxtApp();
      await $supabase.auth.signOut();

      localStorage.removeItem("admin_verified");
      sessionStorage.removeItem("temporary_trust");

      this.$router.push("/login");
    }
  }
};
</script>
