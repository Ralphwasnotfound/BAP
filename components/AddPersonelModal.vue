<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
  >
    <div class="bg-white p-6 rounded shadow w-96">

      <h2 class="text-xl font-bold mb-4">
        {{ isEditing ? "Edit Person" : "Add Person" }}
      </h2>

      <!-- First Name -->
      <div class="mb-3">
        <label>First Name</label>
        <input v-model="localForm.first_name" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Middle Initial -->
      <div class="mb-3">
        <label>Middle Initial</label>
        <input v-model="localForm.middle_initial" class="w-full border px-2 py-1 rounded" maxlength="1" />
      </div>

      <!-- Last Name -->
      <div class="mb-3">
        <label>Last Name</label>
        <input v-model="localForm.last_name" class="w-full border px-2 py-1 rounded" />
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

      <!-- Expiry Date -->
      <div class="mb-3">
        <label>Expiry Date</label>
        <input type="date" v-model="localForm.expiry_date" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Emergency Name -->
      <div class="mb-3">
        <label>Emergency Contact Name</label>
        <input v-model="localForm.emergency_name" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Emergency CP No -->
      <div class="mb-3">
        <label>Emergency CP No.</label>
        <input v-model="localForm.emergency_cp" class="w-full border px-2 py-1 rounded" />
      </div>

      <!-- Emergency Address -->
      <div class="mb-3">
        <label>Emergency Address</label>
        <input v-model="localForm.emergency_address" class="w-full border px-2 py-1 rounded" />
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
    form: Object,
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
