<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- SIDEBAR -->
    <aside class="w-64 black shadow-lg border-r hidden md:flex flex-col">
      <div class="p-6 border-b">
        <img src="/assets/img/BAP-2.png" class="w-20 mx-auto mb-2" />
        <h2 class="text-xl font-bold text-center">BAP Admin</h2>
      </div>

      <nav class="flex-1 p-4 space-y-3">
        <NuxtLink to="/admin" class="block px-4 py-2 rounded hover:bg-gray-200">
          Dashboard
        </NuxtLink>

        <NuxtLink to="/admin/people" class="block px-4 py-2 rounded hover:bg-gray-200">
          People
        </NuxtLink>

        <NuxtLink to="/admin/announcements" class="block px-4 py-2 rounded hover:bg-gray-200">
          Announcements
        </NuxtLink>

        <NuxtLink to="/admin/export" class="block px-4 py-2 rounded hover:bg-gray-200">
          Export Tools
        </NuxtLink>
      </nav>

      <div class="p-4 border-t">
        <button class="w-full bg-red-600 text-white py-2 rounded" @click="logout">
          Logout
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-6">
      <slot />
    </main>

  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      const { $supabase } = useNuxtApp();
      await $supabase.auth.signOut();
      localStorage.removeItem("admin_verified");
      sessionStorage.removeItem("temporary_trust");
      this.$router.push("/login");
    }
  }
}
</script>
