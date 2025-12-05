<template>
  <div>
    <!-- BACKDROP FOR MOBILE -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
      @click="mobileOpen = false"
    ></div>

    <!-- SIDEBAR -->
    <aside
      class="bg-blue-700 text-white fixed inset-y-0 z-50 transform transition-all duration-300
            w-64 border-r border-blue-500 flex flex-col
            md:translate-x-0"
      :class="{
        '-translate-x-full': !mobileOpen,
        'md:translate-x-0': true
      }"
    >
      <!-- HEADER -->
      <div class="p-6 border-b border-blue-500 flex justify-between items-center">
        <div>
          <img src="/assets/img/BAP-2.png" class="w-20 mx-auto mb-2" />
          <h2 class="text-xl font-bold text-center">BAP Admin</h2>
        </div>

        <!-- CLOSE BUTTON MOBILE -->
        <button class="md:hidden text-white text-xl" @click="mobileOpen = false">✖</button>
      </div>

      <!-- NAVIGATION -->
      <nav class="flex-1 p-4 space-y-3 overflow-y-auto">

        <NuxtLink to="/admin" class="block px-4 py-2 rounded" :class="isActive('/admin')">
          Dashboard
        </NuxtLink>

        <NuxtLink to="/admin/people" class="block px-4 py-2 rounded" :class="isActive('/admin/people')">
          People
        </NuxtLink>

        <NuxtLink to="/admin/announcements" class="block px-4 py-2 rounded" :class="isActive('/admin/announcements')">
          Announcements
        </NuxtLink>

        <NuxtLink to="/admin/export" class="block px-4 py-2 rounded" :class="isActive('/admin/export')">
          Export Tools
        </NuxtLink>

      </nav>

      <!-- LOGOUT BUTTON -->
      <div class="p-4 border-t border-blue-500">
        <button 
          class="w-full bg-red-600 py-2 rounded"
          @click="$emit('logout')"
        >
          Logout
        </button>
      </div>

    </aside>

    <!-- MOBILE MENU BUTTON -->
    <button
      class="md:hidden fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded"
      @click="toggleMobile"
    >
      ☰
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
        ? "bg-blue-900 text-white"
        : "hover:bg-blue-600";
    },

    toggleMobile() {
      this.mobileOpen = !this.mobileOpen;
    },
  }
};
</script>
