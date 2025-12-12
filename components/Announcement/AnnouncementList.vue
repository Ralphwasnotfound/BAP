<template>
  <section class="w-full -translate-y-[50px]">
    <div 
      v-if="announcements.length > 0"
      class="relative h-[85vh] flex justify-center group"
    >
      <div class="relative w-full max-w-[480px] h-full">

<!-- UP ARROW -->
<button
  @click="prevSlide"
  class="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2
         bg-white/80 shadow-lg rounded-full w-10 h-10 border border-white/40
         items-center justify-center transition z-20
         opacity-0 group-hover:opacity-100 duration-300"
>
  <svg width="22" height="22" fill="currentColor" class="rotate-90">
    <path d="M15 4l-8 7 8 7" />
  </svg>
</button>

<!-- DOWN ARROW -->
<button
  @click="nextSlide"
  class="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2
         bg-white/80 shadow-lg rounded-full w-10 h-10 border border-white/40
         items-center justify-center transition z-20
         opacity-0 group-hover:opacity-100 duration-300"
>
  <svg width="22" height="22" fill="currentColor" class="-rotate-90">
    <path d="M15 4l-8 7 8 7" />
  </svg>
</button>



        <!-- SLIDER -->
        <div class="overflow-hidden h-full relative">
          <transition name="fadeSlide" mode="out-in">
            <div
              v-if="currentAnnouncement"
              :key="currentAnnouncement.id"
              class="absolute inset-0 flex justify-center items-start px-4"
            >
              <AnnouncementCard :announcement="currentAnnouncement" />
            </div>
          </transition>
        </div>

        <!-- DOTS -->
        <div class="absolute right-[-20px] top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
          <span
            v-for="(_, i) in announcements"
            :key="i"
            class="w-3 h-3 rounded-full transition-all duration-300 pointer-events-auto"
            :class="currentIndex === i ? 'bg-white scale-125' : 'bg-white/40'"
            @click="goTo(i)"
          ></span>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import AnnouncementCard from "./AnnouncementCard.vue";

export default {
  components: { AnnouncementCard },

  data() {
    return {
      supabase: null,
      announcements: [],
      currentIndex: 0,
      autoPlayInterval: null,
      autoplayMs: 8000, // ⏳ SLOWER CHANGE (8 seconds)
    };
  },

  computed: {
    currentAnnouncement() {
      return this.announcements.length
        ? this.announcements[this.currentIndex]
        : null;
    }
  },

  async mounted() {
    this.supabase = useSupabaseClient();
    await this.loadAnnouncements();
    this.setupAutoPlay();
  },

  beforeUnmount() {
    clearInterval(this.autoPlayInterval);
  },

  watch: {
    announcements() {
      this.currentIndex = 0;
      this.setupAutoPlay();
    }
  },

  methods: {
    async loadAnnouncements() {
      const { data } = await this.supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      this.announcements = data ?? [];
    },

    nextSlide() {
      this.currentIndex =
        (this.currentIndex + 1) % this.announcements.length;
    },

    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.announcements.length) %
        this.announcements.length;
    },

    goTo(i) {
      this.currentIndex = i;
    },

    setupAutoPlay() {
      clearInterval(this.autoPlayInterval);

      if (this.announcements.length <= 1) return;

      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoplayMs);
    },
  }
};
</script>

<style scoped>
.fadeSlide-enter-active,
.fadeSlide-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
  position: absolute;
  width: 100%;
  height: 100%;
}

.fadeSlide-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.995);
}

.fadeSlide-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.995);
}
</style>
