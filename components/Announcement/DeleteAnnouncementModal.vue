<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div
        class="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden animate-scaleIn"
      >
        <!-- HEADER -->
        <div class="flex items-center gap-3 px-6 py-4 border-b">
          <div class="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="rgba(220,38,38,1)"
            >
              <path d="M17 4h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5V2h10v2zM9 9v8h2V9H9zm4 0v8h2V9h-2z"/>
            </svg>
          </div>

          <h2 class="text-lg font-semibold text-red-600">
            Delete Announcement
          </h2>
        </div>

        <!-- BODY -->
        <div class="px-6 py-5 text-sm sm:text-base text-gray-700 space-y-2">
          <p>
            Are you sure you want to delete:
          </p>
          <p class="font-semibold text-gray-900 break-words">
            “{{ announcement.title }}”
          </p>
          <p class="text-xs text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        <!-- FOOTER -->
        <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
          <button
            class="px-4 py-2 rounded-lg text-gray-700 bg-white border
                   hover:bg-gray-100 transition"
            @click="$emit('close')"
          >
            Cancel
          </button>

          <button
            class="px-4 py-2 rounded-lg bg-red-600 text-white
                   hover:bg-red-700 transition flex items-center gap-2"
            @click="$emit('confirm')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6Z"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  announcement: Object
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scaleIn {
  animation: scaleIn 0.18s ease-out;
}
</style>
