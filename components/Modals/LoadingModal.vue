<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
  >
    <!-- Ball + Message -->
    <div class="flex flex-col items-center">

      <!-- DRIBBLING + SPINNING PNG BALL -->
      <div class="relative mb-3">
        
        <!-- PNG ball -->
        <img 
          src="/img/ball.png" 
          class="animate-ball w-14 h-14 object-contain select-none"
          draggable="false"
        />

        <!-- Shadow -->
        <div
          class="absolute left-1/2 -translate-x-1/2 bottom-0 
          w-12 h-2 bg-black/30 rounded-full animate-ball-shadow"
        ></div>
      </div>

      <p class="text-lg font-semibold text-gray-400 drop-shadow-lg">
        {{ message }}
      </p>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    message: {
      type: String,
      default: "Please wait..."
    }
  }
}
</script>

<style scoped>
/* ------------------------------ */
/* DRIBBLE + SPIN PNG ANIMATION   */
/* ------------------------------ */

@keyframes dribbleSpin {
  0%   { transform: translateY(0) rotate(0deg); }
  30%  { transform: translateY(20px) rotate(140deg); }
  60%  { transform: translateY(0) rotate(280deg); }
  100% { transform: translateY(0) rotate(360deg); }
}

.animate-ball {
  animation: dribbleSpin 0.65s infinite cubic-bezier(.45, .05, .55, .95);
  transform-origin: center;
}

/* Shadow squish animation */
@keyframes shadowPulse {
  0% { transform: scaleX(1); opacity: 0.35; }
  30% { transform: scaleX(1.7); opacity: 0.15; }
  60% { transform: scaleX(1); opacity: 0.35; }
  100% { transform: scaleX(1); opacity: 0.35; }
}

.animate-ball-shadow {
  animation: shadowPulse 0.65s infinite ease-in-out;
}
</style>
