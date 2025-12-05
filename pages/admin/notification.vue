<template>
  <div class="flex min-h-screen">

    <!-- 🔵 SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 ml-64 p-6 max-w-3xl">
      <h1 class="text-3xl font-bold mb-6">Notifications</h1>

    
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
