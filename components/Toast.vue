<template>
  <div
    v-if="visible"
    class="fixed top-5 right-5 z-50 px-4 py-3 text-white rounded shadow-lg flex items-center gap-3 transition-all"
    :class="typeClass"
  >
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: "",
      type: "success", // success, error, warning
      timeout: null,
    };
  },

  computed: {
    typeClass() {
      return {
        "bg-green-600": this.type === "success",
        "bg-red-600": this.type === "error",
        "bg-yellow-600": this.type === "warning",
      };
    },
  },

  methods: {
    show(msg, type = "success") {
      this.message = msg;
      this.type = type;
      this.visible = true;

      // Auto-hide after 3 seconds
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.visible = false;
      }, 3000);
    },
  },
};
</script>
