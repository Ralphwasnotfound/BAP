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
            <input v-model="email" type="email" placeholder="Enter admin email"
              class="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="mb-6">
            <label class="text-sm font-semibold text-gray-700">Password</label>
            <input v-model="password" type="password" placeholder="Enter password"
              class="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500" />
          </div>

          <button @click="login" :disabled="loading || lockedOut"
            class="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-50">
            {{ loading ? "Logging in..." : "Login" }}
          </button>

          <p v-if="lockedOut" class="mt-4 text-red-600 text-center font-semibold">
            Too many attempts. Try again in {{ formattedLockout }}.
          </p>

          <p v-if="errorMessage" class="mt-4 text-red-600 text-center font-semibold">
            {{ errorMessage }}
          </p>
        </div>

        <!-- STEP 2: OTP -->
        <div v-else-if="step === 'otp'">
          <h2 class="text-3xl font-bold text-gray-800 text-center mb-8">Enter OTP</h2>

          <p v-if="lockedOut" class="text-center text-red-600 font-semibold mb-4">
            Too many attempts. Try again in {{ formattedLockout }}.
          </p>

          <p v-if="!lockedOut" class="text-center text-gray-600 mb-4">
            A 6-digit code was sent to:<br />
            <span class="font-semibold">{{ email }}</span>
          </p>

          <div class="flex justify-center gap-3 mb-6">
            <input v-for="(_, i) in 6" :key="i" maxlength="1" v-model="otp[i]" ref="otpBoxes"
              @input="(e) => nextBox(i, e)" :disabled="lockedOut"
              class="w-12 h-12 border text-center text-xl rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed" />
          </div>

          <button @click="verifyOtp" :disabled="loading || lockedOut"
            class="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
            {{ loading ? "Verifying..." : "Verify OTP" }}
          </button>

          <!-- REMEMBER DEVICE -->
          <label class="flex items-center justify-center gap-2 mt-3">
            <input type="checkbox" v-model="rememberDevice" />
            <span class="text-sm text-gray-600">Remember this device</span>
          </label>

          <!-- RESEND OTP -->
          <p class="text-center mt-4 text-gray-600">
            Didn't receive the code?
            <button @click="resendOtp"
              :disabled="lockedOut || resendCooldown > 0 || loading || resendCount >= maxResendCount"
              class="text-blue-600 font-semibold disabled:text-gray-400 ml-2">
              Resend OTP
            </button>
          </p>

          <p v-if="resendCount >= maxResendCount" class="text-center text-red-500 text-sm mt-2">
            Maximum resend limit reached.
          </p>

          <p v-if="resendCooldown > 0" class="text-center text-gray-500 text-sm mt-2">
            You can resend again in {{ resendCooldown }}s
          </p>

          <p v-if="errorMessage && !lockedOut" class="mt-4 text-red-600 text-center font-semibold">
            {{ errorMessage }}
          </p>

        </div>
      </div>

    </div>
  </div>
  <LoadingModal :show="loading" :message="loadingMessage"/>
</template>

<script>
import LoadingModal from '../Modals/LoadingModal.vue';

export default {
  components: { LoadingModal },
  emits: ["loginSuccess"],

  data() {
    return {
      supabase: null,
      loading: false,
      loadingMessage: "",
      step: "login",
      email: "",
      password: "",
      otp: ["", "", "", "", "", ""],

      rememberDevice: false,

      errorMessage: "",

      // resend / cooldown
      resendCount: 0,
      maxResendCount: 3,
      resendCooldown: 0,
      cooldownInterval: null,

      // server-backed attempts/lockout
      lockedOut: false,
      lockoutUntil: null,
      lockoutTimer: null,

      tick: 0, // used to reactive update formattedLockout
    };
  },

  computed: {
    formattedLockout() {
      this.tick; // reactive
      if (!this.lockoutUntil) return "";
      const diff = Math.max(0, this.lockoutUntil - Date.now());
      const sec = Math.ceil(diff / 1000);
      const m = String(Math.floor(sec / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      return `${m}:${s}`;
    }
  },

  mounted() {
    // resume lockout state if present
    this.supabase = useSupabaseClient()
    this.checkLockoutFromLocal();
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },

  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    if (this.cooldownInterval) clearInterval(this.cooldownInterval);
    if (this.lockoutTimer) clearInterval(this.lockoutTimer);
  },

  methods: {
    handleBeforeUnload() {
      // keep temporary_trust until browser closed — already sessionStorage
    },

    /* ------------------ LOCKOUT helpers ------------------ */
    checkLockoutFromLocal() {
      const val = localStorage.getItem("otp_lockout_until");
      if (val && Date.now() < Number(val)) {
        this.lockoutUntil = Number(val);
        this.lockedOut = true;
        this.startLockoutTimer();
      } else {
        localStorage.removeItem("otp_lockout_until");
      }
    },

    setLockout(minutes = 5) {
      this.lockoutUntil = Date.now() + minutes * 60 * 1000;
      localStorage.setItem("otp_lockout_until", String(this.lockoutUntil));
      this.lockedOut = true;
      this.startLockoutTimer();
    },

    startLockoutTimer() {
      if (this.lockoutTimer) clearInterval(this.lockoutTimer);
      this.lockoutTimer = setInterval(() => {
        if (!this.lockoutUntil) return;
        if (Date.now() >= this.lockoutUntil) {
          clearInterval(this.lockoutTimer);
          this.lockedOut = false;
          this.lockoutUntil = null;
          localStorage.removeItem("otp_lockout_until");
          this.tick++;
          return;
        }
        this.tick++;
      }, 1000);
    },

    /* ------------------ LOGIN (step 1) ------------------ */
    async login() {
      if (this.lockedOut) return;

      this.errorMessage = "";

      if (!this.email || !this.password) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }

      this.loading = true;
      this.loadingMessage = "Logging in...";


      try {
        const res = await this.supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password,
        });

        if (res.error) {
          this.errorMessage = "Invalid email or password.";
          this.loading = false;
          return;
        }

        // If device already trusted -> mark verified and emit success
        if (localStorage.getItem("trusted_device") === "true") {
          localStorage.setItem("admin_verified", "true");
          this.$emit("loginSuccess", true);
          this.loading = false;
          return;
        }

        if (sessionStorage.getItem("temporary_trust") === "true") {
          localStorage.setItem("admin_verified", "true");
          this.$emit("loginSuccess", true);
          this.loading = false;
          return;
        }

        // Otherwise request server to create & email OTP
        this.loadingMessage = "Sending OTP...";
        const sendRes = await $fetch("/api/send-otp", {
          method: "POST",
          body: { email: this.email },
        });

        this.loading = false;

        if (!sendRes || sendRes.success === false) {
          this.errorMessage = sendRes?.message || "Failed to send OTP.";
          return;
        }

        // success -> go to OTP step
        this.step = "otp";
        this.resendCount = 0;
        this.startResendCooldown(30);
        this.$nextTick(() => this.$refs.otpBoxes?.[0]?.focus());
      } catch (err) {
        console.error("login error", err);
        this.loading = false;
        this.errorMessage = "Unexpected error. Try again.";
      }
    },

    /* ------------------ RESEND ------------------ */
    async resendOtp() {
      if (this.lockedOut) return;
      if (this.resendCooldown > 0) return;

      this.errorMessage = "";

      if (this.resendCount >= this.maxResendCount) {
        // enforce client lockout
        this.setLockout(5);
        return;
      }

      this.loading = true;
      this.loadingMessage = "Resending OTP...";

      try {
        const sendRes = await $fetch("/api/send-otp", {
          method: "POST",
          body: { email: this.email },
        });

        this.loading = false;

        if (!sendRes || sendRes.success === false) {
          this.errorMessage = sendRes?.message || "Failed to resend OTP.";
          // if server says locked -> set lockout
          if (sendRes?.locked) this.setLockout(5);
          return;
        }

        this.resendCount++;
        if (this.resendCount >= this.maxResendCount) {
          // optional: set short client-side lockout or keep allowing (we choose to set lockout)
          this.setLockout(5);
        } else {
          this.otp = ["", "", "", "", "", ""];
          this.$nextTick(() => this.$refs.otpBoxes?.[0]?.focus());
          this.startResendCooldown(30);
        }
      } catch (err) {
        console.error("resend error", err);
        this.loading = false;
        this.errorMessage = "Unexpected error while resending.";
      }
    },

    startResendCooldown(seconds = 30) {
      this.resendCooldown = seconds;
      if (this.cooldownInterval) clearInterval(this.cooldownInterval);
      this.cooldownInterval = setInterval(() => {
        if (this.resendCooldown > 0) {
          this.resendCooldown--;
        } else {
          clearInterval(this.cooldownInterval);
        }
      }, 1000);
    },

    /* ------------------ OTP navigation ------------------ */
    nextBox(i, event) {
      // auto-advance
      if (this.otp[i] && this.otp[i].length === 1 && i < 5) {
        this.$refs.otpBoxes[i + 1].focus();
      }

      // backspace behaviour
      if (event && event.inputType === "deleteContentBackward" && this.otp[i] === "" && i > 0) {
        this.$refs.otpBoxes[i - 1].focus();
      }

      // ensure single char
      if (this.otp[i] && this.otp[i].length > 1) {
        this.otp[i] = this.otp[i].slice(0, 1);
      }
    },

    /* ------------------ VERIFY OTP (step 2) ------------------ */
    async verifyOtp() {
      if (this.lockedOut) return;

      this.errorMessage = "";
      const code = this.otp.join("").trim();

      if (code.length !== 6) {
        this.errorMessage = "Enter all 6 digits.";
        return;
      }

      this.loading = true;
      this.loadingMessage = "Verifying OTP...";

      try {
        const res = await $fetch("/api/verify-otp", {
          method: "POST",
          body: { email: this.email, otp: code },
        });

        this.loading = false;

        if (!res) {
          this.errorMessage = "Server error verifying OTP.";
          return;
        }

        if (res.success === true) {
          // mark trust
          if (this.rememberDevice) {
            localStorage.setItem("trusted_device", "true");
          } else {
            sessionStorage.setItem("temporary_trust", "true");
          }

          localStorage.setItem("admin_verified", "true");

          // success -> emit loginSuccess
          this.$emit("loginSuccess", true);
          return;
        }

        // handle server feedback
        if (res.locked) {
          // server locked (too many attempts)
          this.setLockout(5); // 5 minutes default
          this.errorMessage = res.message || "Too many attempts. Locked.";
          return;
        }

        if (typeof res.attemptsLeft !== "undefined") {
          this.errorMessage = `Wrong OTP. Attempts left: ${res.attemptsLeft}`;
        } else {
          this.errorMessage = res.message || "Incorrect OTP.";
        }

        // if server returned an explicit "otp expired"
        if (res.message && res.message.toLowerCase().includes("expired")) {
          // Offer to resend (but respect resend cooldown)
        }
      } catch (err) {
        console.error("verify error", err);
        this.loading = false;
        this.errorMessage = "Unexpected error verifying OTP.";
      }
    },
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
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-float { animation: float 3s ease-in-out infinite; }
</style>
