<template>
  <div
    class="rounded-2xl backdrop-blur-xl bg-black/30 shadow-xl
           border border-white/20 flex flex-col overflow-hidden
           w-full h-full"
  >

    <!-- IMAGE -->
    <img
      v-if="announcement.image_url"
      :src="announcement.image_url"
      class="w-full
             h-40 sm:h-48 md:h-52
             object-cover"
    />

    <!-- CONTENT -->
    <div
      class="p-3 sm:p-4
             flex flex-col flex-grow
             overflow-hidden"
    >

      <!-- TITLE -->
      <h3
        class="text-base sm:text-lg
               font-bold text-white drop-shadow
               line-clamp-1"
      >
        {{ announcement.title }}
      </h3>

      <!-- CONTENT -->
      <p
        class="text-xs sm:text-sm
               text-white/90 mt-2
               flex-grow overflow-y-auto
               custom-scroll"
      >
        {{ announcement.content }}
      </p>

      <!-- FOOTER -->
      <p
        class="text-[10px] sm:text-xs
               text-white/60 mt-3"
      >
        Posted: {{ new Date(announcement.created_at).toLocaleString() }}
      </p>

    </div>

  </div>
</template>

<script setup>
defineProps({
  announcement: Object
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 8px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.5);
}
</style>
