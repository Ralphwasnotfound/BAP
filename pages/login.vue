<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <Transition name="pageFade">
      <AdminLogin
        v-if="show"
        @loginSuccess="redirectToAdmin"
      />
    </Transition>
  </div>
</template>

<script>
import AdminLogin from "~/components/Admin/AdminLogin.vue"
import { usePageTitle } from "~/composables/usePageTitle.js"

export default {
  components: { AdminLogin },

  data() {
    return {
      show: false
    }
  },

  methods: {
    redirectToAdmin() {
      this.show = false // optional fade-out before redirect
      this.$router.push("/admin")
    }
  },

  mounted() {
    usePageTitle("Admin Login")

    document.documentElement.classList.add("no-scroll")
    document.body.classList.add("no-scroll")

    // 🔑 trigger transition EVERY time page is entered
    requestAnimationFrame(() => {
      this.show = true
    })
  },

  beforeUnmount() {
    document.documentElement.classList.remove("no-scroll")
    document.body.classList.remove("no-scroll")
  }
}
</script>

<style scoped>
.pageFade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.pageFade-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
.pageFade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.pageFade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.pageFade-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
