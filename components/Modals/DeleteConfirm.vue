<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center
             bg-black/50 backdrop-blur-sm px-4"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white w-full max-w-sm rounded-2xl shadow-2xl
               border border-gray-200 p-5 sm:p-6"
      >
        <!-- HEADER -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="flex items-center justify-center w-10 h-10
                   rounded-full bg-red-100 text-red-600"
          >
            <!-- Trash Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"/>
            </svg>
          </div>

          <h2 class="text-lg sm:text-xl font-bold text-gray-800">
            Delete Person
          </h2>
        </div>

        <!-- MESSAGE -->
        <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
          Are you sure you want to delete
          <span class="font-semibold text-gray-900 break-words">
            {{ person?.full_name }}
          </span>?
        </p>

        <p class="text-xs text-gray-500 mt-2">
          This action cannot be undone.
        </p>

        <!-- ACTIONS -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            class="px-4 py-2 rounded-lg border border-gray-300
                   text-gray-700 bg-white
                   hover:bg-gray-100 transition"
            @click="$emit('close')"
          >
            Cancel
          </button>

          <button
            class="px-4 py-2 rounded-lg bg-red-600 text-white
                   hover:bg-red-700 transition"
            @click="$emit('confirm')"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: Boolean,
    person: Object
  },
  emits: ["close", "confirm"]
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
