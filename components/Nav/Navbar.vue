<template>
  <nav class="bg-[#0F3975] text-white shadow-md">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">

        <!-- LEFT: Logo + Navigation -->
        <div class="flex items-center gap-6">

          <!-- Logo with Drop Shadow -->
          <NuxtLink to="/">
            <img 
              src="/img/BAP-2.png" 
              class="w-16 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] hover:scale-105 transition duration-200"
              alt="Logo"
            />
          </NuxtLink>

          <!-- NAV LINKS -->
          <ul class="hidden md:flex gap-6 text-sm font-semibold">
            <li>
              <NuxtLink
                to="/"
                class="hover:text-blue-300 transition"
              >
                HOME
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/people"
                class="hover:text-blue-300 transition"
              >
                PEOPLE
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/contact"
                class="hover:text-blue-300 transition"
              >
                CONTACT
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- RIGHT: Admin Login -->
        <NuxtLink
          to="/login"
          class="text-sm font-semibold px-4 py-2 
                 bg-white text-[#0F3975]
                 rounded-lg shadow-sm
                 hover:bg-gray-100 active:scale-[.97]
                 transition-all duration-200"
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
