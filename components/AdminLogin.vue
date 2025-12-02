<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-600 px-4">
    <div class="backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl animate-fadeIn">

      <!-- LEFT -->
      <div class="flex flex-col items-center justify-center p-10 md:w-1/2 bg-white/10 backdrop-blur-xl border-r border-white/20">
        <img src="/assets/img/BAP-2.png" class="w-44 mb-5 animate-float" />
        <h2 class="text-white text-3xl font-extrabold tracking-wide">BAP Federation</h2>
        <p class="text-white/80 mt-2">Admin Access Portal</p>
      </div>

      <!-- RIGHT -->
      <div class="p-10 md:w-1/2 w-full bg-white/90">

        <!-- STEP 1: LOGIN -->
        <div v-if="step === 'login'">
          <h2 class="text-3xl font-bold text-gray-800 text-center mb-8">Admin Login</h2>

          <div class="mb-4">
            <label class="text-sm font-semibold text-gray-700">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter admin email"
              class="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            class="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
          >
            {{ loading ? "Logging in..." : "Login" }}
          </button>

          <p v-if="errorMessage" class="mt-4 text-red-600 text-center font-semibold">
            {{ errorMessage }}
          </p>
        </div>

        <!-- STEP 2: OTP -->
        <div v-else-if="step === 'otp'">
          <h2 class="text-3xl font-bold text-gray-800 text-center mb-8">Enter OTP</h2>

          <p class="text-center text-gray-600 mb-4">
            A 6-digit code was sent to:<br />
            <span class="font-semibold">{{ email }}</span>
          </p>

          <div class="flex justify-center gap-3 mb-6">
            <input
              v-for="(n, i) in 6"
              :key="i"
              maxlength="1"
              v-model="otp[i]"
              ref="otpBoxes"
              @input="nextBox(i)"
              class="w-12 h-12 border text-center text-xl rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            @click="verifyOtp"
            :disabled="loading"
            class="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {{ loading ? "Verifying..." : "Verify OTP" }}
          </button>

          <p v-if="errorMessage" class="mt-4 text-red-600 text-center font-semibold">
            {{ errorMessage }}
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["loginSuccess"],

  data() {
    return {
      step: "login",
      email: "",
      password: "",
      otp: ["", "", "", "", "", ""],
      generatedOtp: "",
      loading: false,
      errorMessage: "",
    };
  },

  methods: {
    /* STEP 1 — PASSWORD LOGIN */
    async login() {
      if (!this.email || !this.password) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }

      this.loading = true;
      this.errorMessage = "";

      const { $supabase } = useNuxtApp();

      const { error } = await $supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (error) {
        this.loading = false;
        this.errorMessage = "Invalid email or password.";
        return;
      }

      /* GENERATE OTP */
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      this.generatedOtp = otpCode;

      /* SEND OTP EMAIL */
      const res = await $fetch("/api/send-otp", {
        method: "POST",
        body: { email: this.email, otp: otpCode },
      });

      this.loading = false;

      if (!res.success) {
        this.errorMessage = "Failed to send OTP email.";
        return;
      }

      /* OPEN OTP SCREEN */
      this.step = "otp";

      this.$nextTick(() => {
        this.$refs.otpBoxes[0]?.focus();
      });
    },

    /* AUTO MOVE */
    nextBox(i) {
      if (this.otp[i].length === 1 && i < 5) {
        this.$refs.otpBoxes[i + 1].focus();
      }
    },

    /* STEP 2 — VERIFY OTP */
    async verifyOtp() {
      const code = this.otp.join("");

      if (code.length !== 6) {
        this.errorMessage = "Enter all 6 digits.";
        return;
      }

      if (code !== this.generatedOtp) {
        this.errorMessage = "Incorrect OTP.";
        return;
      }

      /* STORE VERIFIED FLAG */
      localStorage.setItem("admin_verified", "true");

      this.$emit("loginSuccess", true);
    },
  },
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
