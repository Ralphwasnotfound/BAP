<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-600 px-4">

    <div class="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl animate-fadeIn">

      <!-- LEFT SIDE -->
      <div class="flex flex-col items-center justify-center p-10 md:w-1/2 bg-white/10 backdrop-blur-xl border-r border-white/20">
        <img src="/assets/img/BAP-2.png" class="w-44 mb-5 animate-float" />

        <h2 class="text-white text-3xl font-extrabold tracking-wide">BAP Federation</h2>
        <p class="text-white/80 mt-2">Admin Access Portal</p>
      </div>

      <!-- RIGHT SIDE -->
      <div class="p-10 md:w-1/2 w-full bg-white/90">
        <h2 class="text-3xl font-bold text-gray-800 text-center mb-8">
          Admin Login
        </h2>

        <!-- EMAIL -->
        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter admin email"
            class="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- PASSWORD -->
        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
            class="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          @click="login"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

        <p v-if="errorMessage" class="mt-4 text-red-600 text-center font-semibold">
          {{ errorMessage }}
        </p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  emits: ["loginSuccess"],

  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      loading: false
    };
  },

  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.errorMessage = "Please enter both email and password.";
        return;
      }

      this.loading = true;
      this.errorMessage = "";

      const { $supabase } = useNuxtApp();

      const { data, error } = await $supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });

      this.loading = false;

      if (error) {
        this.errorMessage = "Invalid email or password.";
        return;
      }

      // Emit session to parent
      this.$emit("loginSuccess", data.session);
    }
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.8s ease; }

@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-float { animation: float 3s ease-in-out infinite; }
</style>
