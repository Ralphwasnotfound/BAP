<template>
    <nav class="bg-[#0F3975] text-white">
        <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">

        <!-- LEFT: Logo + Navigation -->
        <div class="flex items-center gap-6">
            <NuxtLink to="/">
                <img src="/assets/img/BAP.png" class="w-12" alt="Logo" />
            </NuxtLink>

            <ul class="hidden md:flex gap-6 text-sm font-semibold">
                <li><NuxtLink to="/" class="hover:text-blue-400">HOME</NuxtLink></li>
                <li><NuxtLink to="/people" class="hover:text-blue-400">PEOPLE</NuxtLink></li>
                <li><NuxtLink to="/contact" class="hover:text-blue-400">CONTACT</NuxtLink></li>
            </ul>
        </div>

        <!-- RIGHT: Admin Login -->
        <NuxtLink
            to="/admin"
            class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm font-semibold"
        >
          Admin Login
        </NuxtLink>

      </div>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
</style>
