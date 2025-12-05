<template>
  <div
    v-if="show"
    class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in"
  >
    <div
      class="px-4 py-3 rounded shadow-lg border text-center min-w-[260px] text-white"
      :class="toastColor"
    >
      <h2 class="font-bold text-lg mb-1">{{ title }}</h2>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    title: String,
    message: String,
    type: { type: String, default: "success" } // success, error, warning
  },

  computed: {
    toastColor() {
      switch (this.type) {
        case "success":
          return "bg-green-600 border-green-700";
        case "error":
          return "bg-red-600 border-red-700";
        case "warning":
          return "bg-yellow-500 border-yellow-600 text-black";
        default:
          return "bg-gray-700 border-gray-800";
      }
    }
  },

  watch: {
    show(newVal) {
      if (newVal) {
        setTimeout(() => this.$emit("close"), 2000);
      }
    }
  }
}
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -10px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}
</style>
