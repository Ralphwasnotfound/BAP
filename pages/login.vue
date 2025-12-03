<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <AdminLogin @loginSuccess="redirectToAdmin" />
  </div>
</template>

<script>
import AdminLogin from "~/components/AdminLogin.vue";

export default {
  components: { AdminLogin },

  methods: {
    redirectToAdmin() {
      this.$router.push("/admin");
    }
  }
};
</script>
