<template>
  <nav class="bg-[#0F3975] text-white shadow-md">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">

        <!-- LEFT: Logo -->
        <div class="flex items-center gap-4">
          <NuxtLink to="/">
            <img 
              src="/img/BAP-2.png" 
              class="w-14 sm:w-16 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]
                     hover:scale-105 transition duration-200"
              alt="Logo"
            />
          </NuxtLink>

          <!-- DESKTOP NAV -->
          <ul class="hidden md:flex gap-6 text-sm font-semibold">
            <li>
              <NuxtLink to="/" class="hover:text-blue-300 transition">
                HOME
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/people" class="hover:text-blue-300 transition">
                PEOPLE
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="hover:text-blue-300 transition">
                CONTACT
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- RIGHT: Admin + Hamburger -->
        <div class="flex items-center gap-3">

          <!-- ADMIN LOGIN (always visible) -->
          <NuxtLink
            to="/login"
            class="hidden md:inline-block text-sm font-semibold px-4 py-2 
                   bg-white text-[#0F3975]
                   rounded-lg shadow-sm
                   hover:bg-gray-100 active:scale-[.97]
                   transition-all duration-200"
          >
            Admin Login
          </NuxtLink>

          <!-- MOBILE MENU BUTTON -->
          <button
            @click="menuOpen = !menuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <transition name="mobileMenu">
      <div
        v-if="menuOpen"
        class="md:hidden bg-[#0F3975] border-t border-white/10 px-4 pb-4"
      >
        <ul class="flex flex-col gap-3 text-sm font-semibold">
          <li>
            <NuxtLink @click="menuOpen = false" to="/" class="block py-2 hover:text-blue-300">
              HOME
            </NuxtLink>
          </li>
          <li>
            <NuxtLink @click="menuOpen = false" to="/people" class="block py-2 hover:text-blue-300">
              PEOPLE
            </NuxtLink>
          </li>
          <li>
            <NuxtLink @click="menuOpen = false" to="/contact" class="block py-2 hover:text-blue-300">
              CONTACT
            </NuxtLink>
          </li>

          <!-- ADMIN LOGIN (mobile) -->
          <NuxtLink
            @click="menuOpen = false"
            to="/login"
            class="mt-2 inline-block text-center text-sm font-semibold px-4 py-2
                   bg-white text-[#0F3975]
                   rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            Admin Login
          </NuxtLink>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false
    }
  }
}
</script>

<style scoped>
.mobileMenu-enter-active,
.mobileMenu-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.mobileMenu-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.mobileMenu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
