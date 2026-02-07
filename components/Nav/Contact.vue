<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">

    <!-- Background Logo -->
    <img
      src="/img/BAP-2.png"
      alt="Background Logo"
      class="
        absolute inset-0 m-auto
        w-[500px] sm:w-[450px] md:w-[600px] lg:w-[700px]
        opacity-10 pointer-events-none
      "
    />

    <!-- Content -->
    <div
      class="
        relative z-10 w-full max-w-md
        px-6 py-10 sm:px-10 sm:py-14 md:p-16
      "
    >
      
      <!-- Header -->
      <div class="flex items-center justify-center gap-3 mb-4">
        <h1
          class="
            font-bold text-gray-800 text-center
            text-4xl sm:text-5xl md:text-6xl
          "
        >
          Contact Us
        </h1>
      </div>

      <p
        class="
          text-center text-gray-500
          text-sm sm:text-base
          mb-6
        "
      >
        Feel free to reach out anytime
      </p>

      <!-- Contact Links -->
      <div class="space-y-4">
        <!-- Gmail -->
        <a
          href="mailto:bapfederation@gmail.com"
          class="
            flex items-center gap-4
            p-3 sm:p-4
            border rounded-xl
            bg-red-100 hover:bg-red-200
            transition
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-8 h-8 sm:w-9 sm:h-9 text-red-500"
            fill="currentColor"
          >
            <path
              d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"
            />
          </svg>

          <div>
            <p class="font-semibold text-gray-700">Gmail</p>
            <p class="text-xs sm:text-sm text-gray-500">
              bapfederation@gmail.com
            </p>
          </div>
        </a>

        <!-- Facebook -->
        <a
          href="#"
          target="_blank"
          class="
            flex items-center gap-4
            p-3 sm:p-4
            border rounded-xl
            bg-blue-100 hover:bg-blue-200
            transition
            cursor-not-allowed
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-8 h-8 sm:w-9 sm:h-9 text-blue-600"
            fill="currentColor"
          >
            <path
              d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"
            />
          </svg>

          <div>
            <p class="font-semibold text-gray-700">Facebook</p>
            <p class="text-xs sm:text-sm text-gray-500">
              Coming Soon
            </p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactPage",
};
</script>

<style scoped>
/* Responsive handled fully by Tailwind */
</style>
