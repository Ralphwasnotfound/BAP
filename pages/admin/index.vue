<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

    <p class="text-gray-600">Welcome to your dashboard.</p>

    <!-- You can add statistics here later -->
  </div>
</template>

<script setup>
    definePageMeta({
        layout: "admin"
    });
</script>

<script>
export default {
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
    }
  }
}
</script>
