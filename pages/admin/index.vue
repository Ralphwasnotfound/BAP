<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- FIXED SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-6 ml-64">
      <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <p class="text-gray-600">Welcome to your dashboard.</p>
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
import AdminSideBar from '~/components/Admin/AdminSideBar.vue';
import LogoutConfirm from "~/components/LogoutConfirm.vue";

export default {
  components: {
    AdminSideBar,
    LogoutConfirm,
  },

  data() {
    return {
      showLogout: false, // controls modal visibility
    };
  },

  mounted() {
    this.checkAdmin();
  },

  methods: {
    async checkAdmin() {
      const { $supabase } = useNuxtApp();
      const { data } = await $supabase.auth.getSession();

      const verified = localStorage.getItem("admin_verified") === "true";
      const trusted = localStorage.getItem("trusted_device") === "true";
      const temp = sessionStorage.getItem("temporary_trust") === "true";

      if (!data.session || !verified || (!trusted && !temp)) {
        this.$router.replace("/login");
      }
    },

    // 🔵 Called when user CONFIRMS logout in modal
    async confirmLogout() {
      this.showLogout = false;

      const { $supabase } = useNuxtApp();
      await $supabase.auth.signOut();

      localStorage.removeItem("admin_verified");
      sessionStorage.removeItem("temporary_trust");

      this.$router.replace("/login");
    },
  }
}
</script>
