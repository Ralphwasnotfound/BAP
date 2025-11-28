<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded shadow w-96">

      <h2 class="text-xl font-bold mb-4">
        {{ isEditing ? "Edit Announcement" : "Add Announcement" }}
      </h2>

      <div class="mb-3">
        <label>Title</label>
        <input v-model="localForm.title" class="w-full border px-2 py-1 rounded" />
      </div>

      <div class="mb-3">
        <label>Content</label>
        <textarea
          v-model="localForm.content"
          class="w-full border px-2 py-1 rounded h-24"
        ></textarea>
      </div>

      <div class="mb-3">
        <label>Image</label>
        <input type="file" @change="handlePhoto" />
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button class="px-3 py-1 bg-gray-300 rounded" @click="$emit('close')">
          Cancel
        </button>

        <button class="px-3 py-1 bg-blue-600 text-white rounded" @click="submitForm">
          {{ isEditing ? "Update" : "Add" }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  isEditing: Boolean,
  form: Object
});

const emit = defineEmits(["submit", "close"]);

const localForm = ref({ ...props.form });
const photoFile = ref(null);

watch(
  () => props.form,
  () => {
    localForm.value = { ...props.form };
    photoFile.value = null; // Important fix
  }
);

function handlePhoto(e) {
  photoFile.value = e.target.files[0];
}

function submitForm() {
  emit("submit", {
    form: { ...localForm.value },
    photoFile: photoFile.value || null
  });
}
</script>
