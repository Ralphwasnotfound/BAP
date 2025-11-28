<template>
  <section class="my-10 max-w-4xl mx-auto px-4">
    <h2 class="text-3xl font-bold mb-6 text-center">Announcements</h2>

    <div v-if="announcements.length === 0" class="text-center text-gray-500">
      No announcements yet.
    </div>

    <div class="grid gap-4">
      <AnnouncementCard
        v-for="item in announcements"
        :key="item.id"
        :announcement="item"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AnnouncementCard from "~/components/Announcement/AnnouncementCard.vue";

const announcements = ref([]);

const { $supabase } = useNuxtApp();

onMounted(async () => {
  const { data } = await $supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  announcements.value = data || [];
});
</script>
