<template>
  <transition name="fade-scale">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center
             bg-black/40 backdrop-blur-sm px-4"
    >
      <div
        class="w-full max-w-sm bg-white rounded-2xl shadow-2xl
               p-6 sm:p-7 text-center"
      >
        <!-- ICON -->
        <div
          class="mx-auto mb-4 w-12 h-12 rounded-full
                 bg-blue-100 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="text-blue-600"
            viewBox="0 0 24 24"
          >
            <path d="M12 16L16 12H13V4H11V12H8L12 16ZM4 18H20V20H4V18Z"/>
          </svg>
        </div>

        <!-- TITLE -->
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          Already Downloaded
        </h2>

        <!-- MESSAGE -->
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
          This PDF was already downloaded during this session.
          <br />
          Do you want to download it again?
        </p>

        <!-- ACTIONS -->
        <div class="mt-6 flex gap-3 justify-center">
          <button
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800
                   hover:bg-gray-300 transition text-sm sm:text-base"
            @click="$emit('close')"
          >
            Cancel
          </button>

          <button
            class="px-4 py-2 rounded-lg bg-blue-600 text-white
                   hover:bg-blue-700 transition text-sm sm:text-base"
            @click="$emit('confirm')"
          >
            Download Again
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: { show: Boolean }
}
</script>

<style scoped>
/* Smooth modern animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
