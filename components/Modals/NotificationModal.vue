<template>
  <div
    v-if="show"
    class="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50
           w-[calc(100%-2rem)] sm:w-auto px-2 animate-toast-in"
    @click="$emit('close')"
  >
    <div
      class="relative flex flex-col gap-1 px-5 py-4 rounded-2xl shadow-2xl
             backdrop-blur-xl border overflow-hidden
             min-w-[280px] max-w-md"
      :class="toastColor"
    >

      <!-- Glow overlay -->
      <div
        class="absolute inset-0 opacity-20 bg-gradient-to-br from-white/40 to-transparent"
      ></div>

      <!-- TEXT -->
      <div class="relative z-10">
        <h2 class="font-semibold text-base sm:text-lg leading-tight">
          {{ title }}
        </h2>
        <p
          class="text-sm sm:text-base opacity-90 leading-snug break-words mt-1"
        >
          {{ message }}
        </p>
      </div>

      <!-- PROGRESS BAR -->
      <div
        class="absolute bottom-0 left-0 h-[3px] bg-white/40 transition-all"
        :style="{ width: progress + '%' }"
      ></div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    title: String,
    message: String,
    type: { type: String, default: "success" }
  },

  data() {
    return {
      progress: 100
    }
  },

  computed: {
    toastColor() {
      switch (this.type) {
        case "success":
          return "bg-green-600/80 border-green-400/40 text-white";
        case "error":
          return "bg-red-600/80 border-red-400/40 text-white";
        case "warning":
          return "bg-yellow-400/80 border-yellow-300/40 text-black";
        default:
          return "bg-gray-700/80 border-gray-500/40 text-white";
      }
    }
  },

  watch: {
    show(val) {
      if (val) {
        this.progress = 100;
        const interval = setInterval(() => {
          this.progress -= 2;
          if (this.progress <= 0) {
            clearInterval(interval);
            this.$emit("close");
          }
        }, 40);
      }
    }
  }
}
</script>

<style scoped>
@keyframes toastIn {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.animate-toast-in {
  animation: toastIn 0.35s ease-out forwards;
}
</style>
