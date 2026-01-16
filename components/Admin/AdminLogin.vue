<template>
  <div class="min-h-screen flex items-center justify-center px-3 sm:px-4">

    <!-- CARD -->
    <div
      class="w-full max-w-md sm:max-w-lg md:max-w-4xl
             bg-white/90 rounded-2xl shadow-2xl overflow-hidden
             flex flex-col md:flex-row"
    >

      <!-- LEFT BRAND (hidden on mobile) -->
      <div
        class="hidden md:flex md:w-1/2
               flex-col items-center justify-center
               bg-blue-700 text-white
               p-8 lg:p-10 text-center"
      >
        <img
          src="/assets/img/BAP-2.png"
          class="w-32 lg:w-40 mb-6
                 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]"
        />
        <h2 class="text-2xl lg:text-3xl font-bold tracking-wide">
          BAP Federation
        </h2>
        <p class="text-white/80 mt-2 text-sm">
          Admin Access Portal
        </p>
      </div>

      <!-- RIGHT FORM -->
      <div
        class="w-full md:w-1/2
               p-6 sm:p-8 md:p-10"
        :class="{ 'shake': errorMessage }"
      >

        <!-- LOGIN -->
        <div v-if="step === 'login'">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">
            Admin Login
          </h2>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="admin@email.com"
              :class="errorMessage ? 'border-red-500 ring-1 ring-red-400' : ''"
              class="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="mb-6 relative">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 mt-1 pr-10
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- TOGGLE -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-[36px]
                     text-gray-500 hover:text-gray-700"
            >
              <!-- SVGs unchanged -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(173,184,194,1)"><path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path></svg>

              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(173,184,194,1)"><path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path></svg>
            </button>
          </div>

          <button
            @click="login"
            :disabled="loading || lockedOut"
            class="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold
                   hover:bg-blue-700 transition disabled:opacity-50"
          >
            {{ loading ? "Logging in..." : "Login" }}
          </button>

          <p v-if="lockedOut" class="mt-4 text-sm text-red-600 text-center">
            Too many attempts. Try again in {{ formattedLockout }}.
          </p>

          <p v-if="errorMessage" class="mt-4 text-sm text-red-600 text-center">
            {{ errorMessage }}
          </p>
        </div>

        <!-- OTP -->
        <div v-else-if="step === 'otp'">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4">
            Verify OTP
          </h2>

          <p class="text-center text-gray-600 text-sm mb-6">
            Enter the 6-digit code sent to<br />
            <span class="font-semibold">{{ email }}</span>
          </p>

          <div class="flex justify-center gap-2 sm:gap-3 mb-6">
            <input
              v-for="(_, i) in 6"
              :key="i"
              maxlength="1"
              v-model="otp[i]"
              ref="otpBoxes"
              @input="(e) => nextBox(i, e)"
              :disabled="lockedOut"
              class="w-10 h-10 sm:w-11 sm:h-11
                     text-center text-lg rounded-lg
                     border border-gray-300
                     focus:ring-2 focus:ring-blue-500
                     disabled:bg-gray-100"
            />
          </div>

          <button
            @click="verifyOtp"
            :disabled="loading || lockedOut"
            class="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold
                   hover:bg-green-700 transition disabled:opacity-50"
          >
            {{ loading ? "Verifying..." : "Verify OTP" }}
          </button>

          <label class="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
            <input type="checkbox" v-model="rememberDevice" />
            Remember this device
          </label>

          <p class="text-center mt-4 text-sm text-gray-600">
            Didn’t receive the code?
            <button
              @click="resendOtp"
              :disabled="lockedOut || resendCooldown > 0 || loading || resendCount >= maxResendCount"
              class="text-blue-600 font-semibold ml-1 disabled:text-gray-400"
            >
              Resend
            </button>
          </p>

          <p v-if="resendCooldown > 0" class="text-center text-xs text-gray-500 mt-1">
            Resend available in {{ resendCooldown }}s
          </p>

          <p v-if="errorMessage && !lockedOut" class="mt-3 text-sm text-red-600 text-center">
            {{ errorMessage }}
          </p>
        </div>

      </div>
    </div>

    <LoadingModal :show="loading" :message="loadingMessage" />
  </div>
</template>


<script>
import LoadingModal from '../Modals/LoadingModal.vue';

export default {
  components: { LoadingModal },
  emits: ["loginSuccess"],

  data() {
    return {
      showCard: false,
      showPassword: false,
      mounted: false,
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
    requestAnimationFrame(() => {
      this.mounted = true
    })
    
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

          await this.logAdminLogin();

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

          await this.logAdminLogin();

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
    async logAdminLogin() {
  try {
    const { data } = await this.supabase.auth.getSession()
    const user = data?.session?.user
    if (!user) return

    await this.supabase.from("activity_logs").insert([{
      action: "adminLogin",
      description: "Admin logged in",
      person_id: null,        // ✅ IMPORTANT
      admin_id: user.id,
      metadata: {
        email: user.email
      },
      created_at: new Date().toISOString()
    }])
  } catch (err) {
    console.warn("Login log skipped:", err)
  }
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
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-float { animation: float 3s ease-in-out infinite; }

.cardFade-enter-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.cardFade-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.98);
}

.cardFade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@keyframes subtleShake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
  100% { transform: translateX(0); }
}

.shake {
  animation: subtleShake 0.35s ease;
}

</style>
