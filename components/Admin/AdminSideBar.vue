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
             flex flex-col transition-transform duration-300
             md:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- HEADER -->
<div class="relative p-6 border-b border-blue-500">
  
  <!-- CENTERED CONTENT (logo + title) -->
  <div class="flex flex-col items-center">
    
    <!-- BIGGER LOGO with clean white glow -->
    <img 
      src="/assets/img/BAP-2.png" 
      class="w-[130px] drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]"
    />

    <h2 class="text-xl font-bold leading-tight text-center">
      Admin
    </h2>
  </div>

  <!-- MOBILE CLOSE BUTTON -->
  <button
    class="md:hidden text-white text-xl absolute right-4 top-4"
    @click="mobileOpen = false"
  >
    ✖
  </button>

</div>

      <!-- NAVIGATION -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">

        <!-- Dashboard -->
        <NuxtLink 
          to="/admin" 
          class="flex items-center gap-3 px-4 py-2 rounded transition"
          :class="isActive('/admin')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)">
            <path d="M12 3C12.5523 3 13 3.44771 13 4L13 10C13 10.5523 12.5523 11 12 11L4 11C3.44772 11 3 10.5523 3 10L3 4C3 3.44772 3.44772 3 4 3L12 3ZM20 3C20.5523 3 21 3.44771 21 4L21 10C21 10.5523 20.5523 11 20 11L16 11C15.4477 11 15 10.5523 15 10L15 4C15 3.44771 15.4477 3 16 3L20 3ZM20 13C20.5523 13 21 13.4477 21 14L21 20C21 20.5523 20.5523 21 20 21L12 21C11.4477 21 11 20.5523 11 20L11 14C11 13.4477 11.4477 13 12 13L20 13ZM3 14C3 13.4477 3.44772 13 4 13L8 13C8.55229 13 9 13.4477 9 14L9 20C9 20.5523 8.55229 21 8 21L4 21C3.44772 21 3 20.5523 3 20L3 14Z"></path>
          </svg>
          Dashboard
        </NuxtLink>

        <!-- People -->
        <NuxtLink 
          to="/admin/people" 
          class="flex items-center gap-3 px-4 py-2 rounded transition"
          :class="isActive('/admin/people')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)">
            <path d="M12 10C14.2091 10 16 8.20914 16 6 16 3.79086 14.2091 2 12 2 9.79086 2 8 3.79086 8 6 8 8.20914 9.79086 10 12 10ZM5.5 13C6.88071 13 8 11.8807 8 10.5 8 9.11929 6.88071 8 5.5 8 4.11929 8 3 9.11929 3 10.5 3 11.8807 4.11929 13 5.5 13ZM21 10.5C21 11.8807 19.8807 13 18.5 13 17.1193 13 16 11.8807 16 10.5 16 9.11929 17.1193 8 18.5 8 19.8807 8 21 9.11929 21 10.5ZM12 11C14.7614 11 17 13.2386 17 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5 15.9999C5 15.307 5.10067 14.6376 5.28818 14.0056L5.11864 14.0204C3.36503 14.2104 2 15.6958 2 17.4999V21.9999H5V15.9999ZM22 21.9999V17.4999C22 15.6378 20.5459 14.1153 18.7118 14.0056 18.8993 14.6376 19 15.307 19 15.9999V21.9999H22Z"></path>
          </svg>
          People
        </NuxtLink>

        <!-- Announcements -->
        <NuxtLink 
          to="/admin/announcements" 
          class="flex items-center gap-3 px-4 py-2 rounded transition"
          :class="isActive('/admin/announcements')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)">
            <path d="M21 10.063V4C21 3.44772 20.5523 3 20 3H19C17.0214 4.97864 13.3027 6.08728 11 6.61281V17.3872C13.3027 17.9127 17.0214 19.0214 19 21H20C20.5523 21 21 20.5523 21 20V13.937C21.8626 13.715 22.5 12.9319 22.5 12 22.5 11.0681 21.8626 10.285 21 10.063ZM5 7C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H6L7 22H9V7H5Z"></path>
          </svg>
          Announcements
        </NuxtLink>

        <!-- Notification -->
        <NuxtLink 
          to="/admin/notification" 
          class="flex items-center gap-3 px-4 py-2 rounded transition"
          :class="isActive('/admin/notification')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)">
            <path d="M22 20H2V18H3V11.0314C3 6.04348 7.02944 2 12 2C16.9706 2 21 6.04348 21 11.0314V18H22V20ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path>
          </svg>
          Notification
        </NuxtLink>

        <!-- Activity Logs -->
        <NuxtLink 
          to="/admin/activity-logs" 
          class="flex items-center gap-3 px-4 py-2 rounded transition"
          :class="isActive('/admin/activity-logs')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)">
            <path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM8 7V9H16V7H8ZM8 11V13H16V11H8ZM8 15V17H16V15H8Z"></path>
          </svg>
          Activity Logs
        </NuxtLink>

      </nav>

      <!-- LOGOUT -->
      <div class="p-4 border-t border-blue-500">
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
      class="md:hidden fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded shadow"
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
        ? "bg-blue-900 text-white shadow-inner"
        : "hover:bg-blue-600";
    },

    toggleMobile() {
      this.mobileOpen = !this.mobileOpen;
    },
  }
};
</script>
