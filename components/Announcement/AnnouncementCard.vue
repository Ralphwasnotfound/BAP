<template>
  <div class="bg-white shadow border rounded p-4">
    <h3 class="text-xl font-bold mb-2">{{ announcement.title }}</h3>

    <img
      v-if="announcement.image_url"
      :src="announcement.image_url"
      class="w-full h-48 object-cover rounded mb-3"
    />

    <p class="text-gray-700 mb-2">{{ announcement.content }}</p>

    <p class="text-sm text-gray-500">
      Posted: {{ new Date(announcement.created_at).toLocaleString() }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  announcement: Object
});
</script>
