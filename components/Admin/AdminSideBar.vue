<template>
  <div>
    <!-- MOBILE BACKDROP -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
      @click="mobileOpen = false"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64
             bg-[#0f3975] text-white border-r border-blue-500
             flex flex-col
             transition-transform duration-300
             md:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'"
    >

      <!-- HEADER (fixed height) -->
      <div class="relative p-6 border-b border-blue-500 shrink-0">
        <div class="flex flex-col items-center">
          <img
            src="/assets/img/BAP-2.png"
            class="w-[120px] drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]"
          />
          <h2 class="text-xl font-bold mt-1 text-center">Admin</h2>
        </div>

        <!-- MOBILE CLOSE -->
        <button
          class="md:hidden absolute right-4 top-4 text-xl"
          @click="mobileOpen = false"
        >
          ✖
        </button>
      </div>

      <!-- NAV (scrollable only area) -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-2">

        <NuxtLink
          to="/admin"
          class="nav-item"
          :class="isActive('/admin')"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink
          to="/admin/people"
          class="nav-item"
          :class="isActive('/admin/people')"
        >
          People
        </NuxtLink>

        <NuxtLink
          to="/admin/announcements"
          class="nav-item"
          :class="isActive('/admin/announcements')"
        >
          Announcements
        </NuxtLink>

        <NuxtLink
          to="/admin/notification"
          class="nav-item"
          :class="isActive('/admin/notification')"
        >
          Notification
        </NuxtLink>

        <NuxtLink
          to="/admin/activity-logs"
          class="nav-item"
          :class="isActive('/admin/activity-logs')"
        >
          Activity Logs
        </NuxtLink>

      </nav>

      <!-- LOGOUT (always visible, never scrolls) -->
      <div class="p-4 border-t border-blue-500 shrink-0">
        <button
          class="w-full bg-red-600 py-2 rounded hover:bg-red-700 transition"
          @click="$emit('logout')"
        >
          Logout
        </button>
      </div>

    </aside>

    <!-- MOBILE TOGGLE -->
    <button
      class="md:hidden fixed top-4 left-4 z-50  p-2 "
      @click="toggleMobile"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="rgba(173,184,194,1)"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>
    </button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      mobileOpen: false,
    };
  },

  methods: {
    isActive(path) {
      return this.$route.path === path
        ? "bg-blue-900 text-white shadow-inner"
        : "hover:bg-blue-600";
    },

    toggleMobile() {
      this.mobileOpen = !this.mobileOpen;
    },
  }
};
</script>

<style scoped>
  .nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background 0.2s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
}

</style>