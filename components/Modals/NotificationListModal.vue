<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-0"
    >
      <transition name="slideUp">
        <div
          class="bg-white rounded-2xl shadow-2xl
                 w-full sm:w-[420px] md:w-[460px]
                 max-h-[85vh] overflow-hidden
                 flex flex-col"
        >

          <!-- HEADER -->
          <div class="flex items-center justify-between px-5 py-4 border-b">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800">
              Notifications
            </h2>

            <button
              @click="$emit('close')"
              class="w-9 h-9 flex items-center justify-center
                     rounded-full text-gray-500
                     hover:bg-gray-100 hover:text-gray-700
                     transition"
            >
              ✕
            </button>
          </div>

          <!-- CONTENT -->
          <div class="flex-1 overflow-y-auto px-5 py-4">

            <!-- EMPTY STATE -->
            <div
              v-if="logs.length === 0"
              class="text-gray-500 text-center py-10 text-sm"
            >
              No notifications at the moment.
            </div>

            <!-- LIST -->
            <ul v-else class="space-y-4">
              <li
                v-for="log in logs"
                :key="log.id"
                class="p-4 rounded-xl border shadow-sm
                       flex gap-3 items-start
                       transition hover:shadow-md"
                :class="getCardColor(log.person_id)"
              >
                <!-- STATUS ICON -->
                <div class="text-xl leading-none mt-0.5">
                  <span v-if="getStatus(log.person_id) === 'expired'">❌</span>
                  <span v-else-if="getStatus(log.person_id) === 'warning'">⚠️</span>
                  <span v-else>✅</span>
                </div>

                <!-- CONTENT -->
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 text-sm sm:text-base">
                    {{ getPersonName(log.person_id) }}
                    <span class="text-gray-500 text-xs sm:text-sm">
                      ({{ getPersonWorkID(log.person_id) }})
                    </span>
                  </p>

                  <p class="mt-1 text-gray-700 text-sm leading-snug break-words">
                    {{ log.message }}
                  </p>

                  <p class="text-xs text-gray-500 mt-2">
                    {{ new Date(log.created_at).toLocaleString() }}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- FOOTER -->
          <div class="px-5 py-4 border-t">
            <button
              @click="$emit('close')"
              class="w-full py-2.5 rounded-xl
                     bg-blue-600 text-white font-semibold
                     hover:bg-blue-700 active:scale-[0.98]
                     transition"
            >
              Close
            </button>
          </div>

        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: Boolean,
    logs: Array,
    getPersonName: Function,
    getPersonWorkID: Function
  },

  methods: {
    /* SAME LOGIC — untouched */
    getCardColor(id) {
      const rowColor = this.$parent.getRowColor(id)

      if (rowColor.includes("green"))
        return "border-green-400 bg-green-50"
      if (rowColor.includes("yellow"))
        return "border-yellow-400 bg-yellow-50"
      if (rowColor.includes("red"))
        return "border-red-400 bg-red-50"

      return "border-gray-300"
    },

    getStatus(id) {
      const rowColor = this.$parent.getRowColor(id)

      if (rowColor.includes("red")) return "expired"
      if (rowColor.includes("yellow")) return "warning"
      return "valid"
    }
  }
}
</script>

<style scoped>
/* Fade backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide-up modal */
.slideUp-enter-active {
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
