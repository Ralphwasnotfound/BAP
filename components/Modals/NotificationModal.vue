<template>
  <div
    v-if="show"
    class="fixed bottom-6 md;bottom-10 left-1/2 -translate-x-1/2 z-50 animate-toast-in"
    @click="$emit('close')"
  >
    <div
      class="relative flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl 
             backdrop-blur-xl border overflow-hidden min-w-[300px]"
      :class="toastColor"
    >

      <!-- Glow Effect -->
      <div class="absolute inset-0 opacity-20 bg-gradient-to-br from-white/40 to-transparent"></div>

      <!-- ICON -->
      <div class="relative z-10">
        <component :is="icon"></component>
      </div>

      <!-- TEXT -->
      <div class="relative z-10">
        <h2 class="font-semibold text-lg leading-none">{{ title }}</h2>
        <p class="text-sm opacity-90 mt-1 leading-tight">{{ message }}</p>
      </div>

      <!-- AUTO CLOSE PROGRESS BAR -->
      <div
        class="absolute bottom-0 left-0 h-[3px] bg-white/40"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
const SuccessIcon = {
  template: `
    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2"
         viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7"/>
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2"
         viewBox="0 0 24 24">
      <path d="M6 18L18 6M6 6l12 12"/>
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" stroke-width="2"
         viewBox="0 0 24 24">
      <path d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.8A1 1 0 003.7 18h16.6a1 1 0 00.86-1.34l-7.4-12.8a1 1 0 00-1.72 0z"/>
    </svg>
  `
}

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
        case "success": return "bg-green-600/80 border-green-400/40 text-white";
        case "error": return "bg-red-600/80 border-red-400/40 text-white";
        case "warning": return "bg-yellow-400/80 border-yellow-300/40 text-black";
        default: return "bg-gray-700/80 border-gray-500/40 text-white";
      }
    },

    icon() {
      switch (this.type) {
        case "success": return SuccessIcon;
        case "error": return ErrorIcon;
        case "warning": return WarningIcon;
        default: return SuccessIcon;
      }
    }
  },

  watch: {
    show(val) {
      if (val) {
        this.progress = 100;
        const interval = setInterval(() => {
          this.progress -= 2;  // Speed of progress bar
          if (this.progress <= 0) {
            clearInterval(interval);
            this.$emit("close");
          }
        }, 40); // 40ms per tick = 2 seconds total
      }
    }
  }
}
</script>

<style>
@keyframes toastIn {
  0% {
    opacity: 0;
    transform: translate(-50%, 20px); /* from below */
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

</style>
