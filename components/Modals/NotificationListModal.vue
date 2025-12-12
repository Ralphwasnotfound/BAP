<template>
  <transition name="fade">
    <div 
      v-if="show"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <transition name="slideUp">
        <div class="bg-white rounded-xl shadow-2xl w-[430px] max-h-[85vh] p-6 overflow-y-auto">
          
          <!-- HEADER -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800">Notifications</h2>
            <button 
              @click="$emit('close')"
              class="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✖
            </button>
          </div>

          <!-- EMPTY STATE -->
          <div v-if="logs.length === 0" class="text-gray-500 text-center py-6">
            No notifications at the moment.
          </div>

          <!-- NOTIFICATION LIST -->
          <ul v-else class="space-y-4">
            <li
              v-for="log in logs"
              :key="log.id"
              class="p-4 rounded-lg border flex gap-3 items-start shadow-sm"
              :class="getCardColor(log.person_id)"
            >
              <!-- ICON -->
              <div class="text-2xl">
                <span v-if="getStatus(log.person_id) === 'expired'">❌</span>
                <span v-else-if="getStatus(log.person_id) === 'warning'">⚠️</span>
                <span v-else>✅</span>
              </div>

              <!-- CONTENT -->
              <div class="flex-1">
                <p class="font-semibold text-gray-900">
                  {{ getPersonName(log.person_id) }}
                  <span class="text-gray-600 text-sm">({{ getPersonWorkID(log.person_id) }})</span>
                </p>

                <p class="mt-1 text-gray-800 text-sm leading-snug">
                  {{ log.message }}
                </p>

                <p class="text-xs text-gray-500 mt-2">
                  {{ new Date(log.created_at).toLocaleString() }}
                </p>
              </div>
            </li>
          </ul>

          <!-- CLOSE BUTTON -->
          <button 
            @click="$emit('close')"
            class="mt-5 w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Close
          </button>

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
    /** 
     * Reuse your page color logic but convert to card border classes 
     */
    getCardColor(id) {
      const rowColor = this.$parent.getRowColor(id);

      if (rowColor.includes("green"))
        return "border-green-500 bg-green-50";
      if (rowColor.includes("yellow"))
        return "border-yellow-500 bg-yellow-50";
      if (rowColor.includes("red"))
        return "border-red-500 bg-red-50";

      return "border-gray-300";
    },

    /** Determine status for icons */
    getStatus(id) {
      const rowColor = this.$parent.getRowColor(id);

      if (rowColor.includes("red")) return "expired";
      if (rowColor.includes("yellow")) return "warning";
      return "valid";
    }
  }
};
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

/* Modal slide animation */
.slideUp-enter-active {
  animation: slideUp 0.25s ease-out;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
