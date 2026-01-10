<template>
  <!-- Overlay fade -->
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]"
      @click.self="$emit('close')"   <!-- click backdrop to close -->
    >
      <!-- Card pop -->
      <transition name="pop">
        <!-- card container (only rendered while show) -->
        <div v-if="show" class="relative" @click.stop>
          <!-- CLOSE BUTTON -->
          <button
            class="absolute top-1 right-0 px-3 py-1 rounded z-50 transition-opacity duration-300"
            :class="{ 'opacity-0 pointer-events-none': hideClose }"
            @click.stop="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12">
              <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"/>
            </svg>
          </button>

          <!-- FLIP CARD (click toggles flip) - "click" here toggles isFlipped,
               @click.stop above prevents overlay close when clicking inside. -->
          <div
            class="card-wrapper"
            :class="{ flipped: isFlipped }"
            @click="toggleFlip"
            role="button"
            tabindex="0"
          >
            <!-- FRONT -->
            <div class="card-side card-front">
              <div class="p-4 bg-gradient-to-bl from-white/100 via-[#0f3975]/100 to-[#0f3975]
                          rounded shadow w-[400px] h-[250px] border overflow-hidden">

                <div class="relative flex justify-center items-center pb-2 h-22">
                  <img src="/img/BAP-2.png" class="w-24 h-24 absolute left-0 top-[-1] drop-shadow-[0_-6px_20px_rgba(255,255,255,0.9)]"/>
                  <div class="px-2 text-center">
                    <p class="text-[12px] font-bold leading-tight text-outline">
                      BASKETBALL ASSOCIATION <br />OF THE PHILIPPINES
                    </p>
                    <p class="text-[9px] leading-tight text-outline">
                      EVERWIN TOWER 1190-1206 San Andres St. <br />
                      Malate Manila Philippines <br />
                      SEC Reg. No: 2022090069757-40
                    </p>
                  </div>
                  <img src="/img/SPSG.png" class="w-24 h-24 absolute right-0 top-[-1]" />
                </div>

                <div class="flex justify-center items-start gap-4">
                    <div class="relative flex flex-col items-center">
                        <img :src="person.picture_url" class="w-20 h-20 rounded object-cover border bg-white"/>
                        <img src="" alt="">
                        <p class="text-outline leading-tight text-[10px] font-semibold absolute -bottom-10">Signature</p>
                    </div>

                  <div class="bg-white px-2 py-1 rounded w-[250px] space-y-1 leading-tight">
                    <div>
                      <p class="text-[9px] font-semibold uppercase">Name :</p>
                      <p class="text-[12px] leading-tight font-bold ml-2 truncate">{{ fullName }}</p>
                    </div>

                    <div>
                      <p class="text-[9px] font-semibold uppercase">Designation :</p>
                      <p class="text-[12px] leading-tight font-bold ml-2 truncate">{{ person.designation }}</p>
                    </div>

                    <div>
                      <p class="text-[9px] font-semibold uppercase">ID :</p>
                      <p class="text-[12px] leading-tight font-bold ml-2">{{ person.work_id }}</p>
                    </div>

                    <div class="flex gap-14">
                      <div>
                        <p class="text-[9px] font-semibold uppercase">Region :</p>
                        <p class="text-[12px] leading-tight font-bold ml-2">{{ person.region }}</p>
                      </div>

                      <div>
                        <p class="text-[9px] font-semibold uppercase">Chapter :</p>
                        <p class="text-[12px] leading-tight font-bold ml-2">{{ person.chapter }}</p>
                      </div>
                    </div>

                    <div>
                      <p class="text-[9px] font-semibold uppercase">Valid Until :</p>
                      <p class="text-[12px] leading-tight font-bold ml-2">
                        {{ formatMonthYear(person.valid_until) }}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- BACK -->
            <div class="card-side card-back">
              <div class="p-4 bg-white rounded shadow w-[400px] h-[250px] border">

                <ul class="space-y-1 text-[10px] leading-tight pb-1">
                  <li class="flex items-start gap-2">
                    <svg width="8" height="8"><circle cx="4" cy="4" r="4"/></svg>
                    <span>This card is non-transferable</span>
                  </li>

                  <li class="flex items-start gap-2">
                    <svg width="8" height="8"><circle cx="4" cy="4" r="4"/></svg>
                    <p>
                      The BAP Secretariat reserve the right to revoke the membership of <br>
                      any member in case of delinquency, misconduct or failure to follow <br>
                      the rules and regulations
                    </p>
                  </li>
                </ul>

                <div class="border border-black p-1 mb-1">
                  <h3 class="text-sm font-semibold mb-1 text-center leading-tight">
                    In Case of Emergency, Please Notify
                  </h3>

                  <div class="grid grid-cols-[70px_1fr] gap-y-1">
                    <p class="font-semibold text-[10px] uppercase leading-tight">Name:</p>
                    <p class="font-bold text-[12px] leading-tight break-words">{{ person.emergency_name }}</p>

                    <p class="font-semibold text-[10px] uppercase leading-tight">Address:</p>
                    <p class="font-bold text-[12px] leading-tight break-words">{{ person.emergency_address }}</p>

                    <p class="font-semibold text-[10px] uppercase leading-tight">Contact:</p>
                    <p class="font-bold text-[12px] leading-tight break-words">{{ person.emergency_cp }}</p>
                  </div>
                </div>

                <ul class="flex justify-evenly text-center mt-1">
                  <li class="relative flex flex-col items-center w-24">
                    <img src="/img/sign/winfredo.png" class="w-14 h-14 object-contain" />
                    <div class="absolute top-10 leading-tight">
                      <p class="text-[11px] font-semibold">Winfredo N. Niez</p>
                      <p class="text-[9px] font-bold">President</p>
                    </div>
                  </li>

                  <li class="relative flex flex-col items-center w-24">
                    <img src="/img/sign/Jedel.png" class="w-14 h-14 object-contain" />
                    <div class="absolute top-10 leading-tight">
                      <p class="text-[11px] font-semibold">Jedel Agron</p>
                      <p class="text-[9px] font-bold">Secretary General</p>
                    </div>
                  </li>

                  <li class="relative flex flex-col items-center w-24">
                    <img src="/img/sign/gil.png" class="w-14 h-14 object-contain" />
                    <div class="absolute top-10 leading-tight">
                      <p class="text-[11px] font-semibold">Gil S. Regio</p>
                      <p class="text-[9px] font-bold">Nat'l. Commissioner</p>
                    </div>
                  </li>
                </ul>

              </div>
            </div>
          </div> <!-- end card-wrapper -->

        </div> <!-- end pop container -->
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  props: { show: Boolean, person: Object },
  emits: ["close"],
  data() {
    return { 
      isFlipped: false,
      hideClose: false 
    };
  },
  computed: {
    fullName() {
      if (!this.person) return "";
      const p = this.person;
      const mi = p.middle_initial ? p.middle_initial + ". " : "";
      const suffix = p.suffix ? " " + p.suffix : "";
      return `${p.first_name} ${mi}${p.last_name}${suffix}`;
    },
  },
  methods: {
    toggleFlip() {
      this.hideClose = true
      this.isFlipped = !this.isFlipped;

      setTimeout(() => {
        this.hideClose = false
      }, 600)
    },
    formatMonthYear(date) {
      if (!date) return "";
      return new Date(date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
/* overlay fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* pop card */
.pop-enter-active,
.pop-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.pop-enter-from,
.pop-leave-to {
  transform: scale(0.92);
  opacity: 0;
}

/* Flip card styles */
.card-wrapper {
  width: 400px;   /* keep a consistent 450 w used earlier */
  height: 250px;
  perspective: 1000px;
  cursor: pointer;
  position: relative;
}
.card-side {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}
.card-front { transform: rotateY(0deg); }
.card-back  { transform: rotateY(180deg); }
.card-wrapper.flipped .card-front { transform: rotateY(180deg); }
.card-wrapper.flipped .card-back  { transform: rotateY(360deg); }

/* small helper */
.text-outline {
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

@media (max-width: 480px) {
  .card-wrapper {
    transform: scale(0.85);
    transform-origin: center;
  }
}

/* Small phones */
@media (max-width: 360px) {
  .card-wrapper {
    transform: scale(0.78);
  }
}

</style>
