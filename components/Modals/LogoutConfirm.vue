<template>
  <transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center
             bg-black/50 backdrop-blur-sm px-4"
    >
      <div
        class="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6
               animate-pop"
      >
        <!-- ICON -->
        <div class="flex justify-center mb-4">
          <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="rgba(220,38,38,1)"
            >
              <path
                d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H12V4H6V20H12V22H5ZM16.5858 15.4142L18.1716 14H10V10H18.1716L16.5858 8.58579L18 7.17157L22.8284 12L18 16.8284L16.5858 15.4142Z"
              />
            </svg>
          </div>
        </div>

        <!-- TITLE -->
        <h2 class="text-xl font-bold text-center text-gray-800 mb-2">
          Logout
        </h2>

        <!-- MESSAGE -->
        <p class="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to log out?
        </p>

        <!-- ACTIONS -->
        <div class="flex justify-center gap-3">
          <button
            class="px-4 py-2 rounded-lg border border-gray-300
                   text-gray-700 hover:bg-gray-100 transition"
            @click="$emit('close')"
          >
            Cancel
          </button>

          <button
            class="px-4 py-2 rounded-lg bg-red-600 text-white
                   hover:bg-red-700 transition"
            @click="$emit('confirm')"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: Boolean
  }
}
</script>

<style scoped>
/* Smooth fade + scale */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Card pop */
@keyframes pop {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pop {
  animation: pop 0.25s ease-out;
}
</style>
