<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]"
  >
    <div class="bg-white rounded-2xl shadow-xl w-[420px] max-h-[85vh] flex flex-col animate-fadeIn">

      <!-- HEADER -->
      <div class="p-5 border-b">
        <h2 class="text-2xl font-semibold text-gray-800 text-center">
          {{ isEditing ? "Edit Announcement" : "Add Announcement" }}
        </h2>
      </div>

      <!-- BODY (scrollable) -->
      <div class="overflow-y-auto px-5 py-4 space-y-4">

        <!-- TITLE -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Title</label>
          <input
            v-model="localForm.title"
            class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- CONTENT -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Content</label>
          <textarea
            v-model="localForm.content"
            class="w-full border border-gray-300 px-3 py-2 rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <!-- IMAGE UPLOAD -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Image</label>

          <!-- PREVIEW -->
          <div
            v-if="previewImage"
            class="mt-2 flex flex-col items-center border p-3 rounded-xl bg-gray-50"
          >
            <img
              :src="previewImage"
              class="w-28 h-28 object-cover rounded-md shadow"
            />

            <button
              class="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
              @click="removeImage"
            >
              Remove Image
            </button>
          </div>

          <!-- CUSTOM UPLOAD BUTTON -->
          <button
            @click="triggerFileInput"
            class="mt-3 px-4 py-2 bg-[#0f3975] text-white rounded-lg hover:bg-blue-700 transition w-full text-center text-sm"
          >
            Choose Image
          </button>

          <input
            type="file"
            ref="fileInput"
            class="hidden"
            @change="handlePhoto"
          />
        </div>

      </div>

      <!-- FOOTER -->
      <div class="p-4 border-t flex justify-end gap-3 bg-gray-50">
        <button
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="px-4 py-2 bg-[#0f3975] text-white rounded-lg hover:bg-blue-700 transition"
          @click="submitForm"
        >
          {{ isEditing ? "Update" : "Add" }}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    isEditing: Boolean,
    form: Object
  },

  data() {
    return {
      localForm: { ...this.form },
      photoFile: null,
      previewImage: this.form.image_url || null
    };
  },

  watch: {
    form: {
      deep: true,
      handler(newForm) {
        this.localForm = { ...newForm };
        this.previewImage = newForm.image_url || null;
        this.photoFile = null;
      }
    }
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handlePhoto(event) {
      const file = event.target.files[0];
      this.photoFile = file;

      if (file) {
        this.previewImage = URL.createObjectURL(file);

        // Reset old image filename
        this.localForm.image_filename = "";
      }
    },

    removeImage() {
      this.previewImage = null;
      this.photoFile = null;
      this.localForm.image_url = "";
      this.localForm.image_filename = "";
    },

    submitForm() {
      this.$emit("submit", {
        form: { ...this.localForm },
        photoFile: this.photoFile
      });
    }
  }
};
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.18s ease-out;
}
</style>
