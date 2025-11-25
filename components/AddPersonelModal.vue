<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="bg-white p-6 rounded shadow w-96">

      <h2 class="text-xl font-bold mb-4">
        {{ isEditing ? "Edit Person" : "Add Person" }}
      </h2>

      <!-- Full Name -->
      <div class="mb-3">
        <label>Full Name</label>
        <input v-model="localForm.full_name" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Work ID -->
      <div class="mb-3">
        <label>Work ID</label>
        <input v-model="localForm.work_id" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Region -->
      <div class="mb-3">
        <label>Region</label>
        <input v-model="localForm.region" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Designation -->
      <div class="mb-3">
        <label>Designation</label>
        <input v-model="localForm.designation" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Chapter -->
      <div class="mb-3">
        <label>Chapter</label>
        <input v-model="localForm.chapter" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Valid Until -->
      <div class="mb-3">
        <label>Valid Until</label>
        <input type="date" v-model="localForm.valid_until" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Expiry -->
      <div class="mb-3">
        <label>Expiry Date</label>
        <input type="date" v-model="localForm.expiry_date" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Photo -->
      <div class="mb-3">
        <label>Photo</label>
        <input type="file" @change="handlePhoto" />
      </div>

      <!-- Actions -->
      <div class="flex justify-end mt-4">
        <button class="px-3 py-1 bg-gray-300 rounded mr-2" @click="$emit('close')">
          Cancel
        </button>

        <button
          class="px-3 py-1 bg-blue-600 text-white rounded"
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
    form: Object,          // form from admin page
  },

  emits: ["close", "submit"],

  data() {
    return {
      localForm: { ...this.form },
      photoFile: null,
    };
  },

  watch: {
    form(newVal) {
      this.localForm = { ...newVal };
    }
  },

  methods: {
    handlePhoto(e) {
      this.photoFile = e.target.files[0];
    },

    submitForm() {
      this.$emit("submit", {
        form: this.localForm,
        photoFile: this.photoFile,
      });
    }
  }
};
</script>
