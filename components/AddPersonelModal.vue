<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white p-6 rounded shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">

      <h2 class="text-2xl font-bold mb-4 text-center">
        {{ isEditing ? "Edit Person" : "Add Person" }}
      </h2>

      <!-- NAME FIELDS -->
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="font-semibold text-sm">First Name</label>
          <input v-model="localForm.first_name" class="border w-full px-2 py-1 rounded" />
        </div>

        <div>
          <label class="font-semibold text-sm">Middle Initial</label>
          <input v-model="localForm.middle_initial" maxlength="1" class="border w-full px-2 py-1 rounded" />
        </div>

        <div>
          <label class="font-semibold text-sm">Surname</label>
          <input v-model="localForm.last_name" class="border w-full px-2 py-1 rounded" />
        </div>
      </div>

      <!-- DESIGNATION / CHAPTER / REGION -->
      <div class="grid grid-cols-3 gap-3 mt-4">
        <div>
          <label class="font-semibold text-sm">Designation</label>
          <input v-model="localForm.designation" class="border w-full px-2 py-1 rounded" />
        </div>

        <div>
          <label class="font-semibold text-sm">Chapter</label>
          <input v-model="localForm.chapter" class="border w-full px-2 py-1 rounded" />
        </div>

        <div>
          <label class="font-semibold text-sm">Region</label>
          <input v-model="localForm.region" class="border w-full px-2 py-1 rounded" />
        </div>
      </div>

      <!-- ID NO -->
      <div class="mt-4">
        <label class="font-semibold text-sm">ID No.</label>
        <input v-model="localForm.work_id" class="border w-full px-2 py-1 rounded" />
      </div>

      <!-- EMERGENCY CONTACT SECTION -->
      <h3 class="font-bold mt-5 mb-2 text-gray-700">In Case of Emergency</h3>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="font-semibold text-sm">Name</label>
          <input v-model="localForm.emergency_name" class="border w-full px-2 py-1 rounded" />
        </div>

        <div>
          <label class="font-semibold text-sm">CP No.</label>
          <input v-model="localForm.emergency_cp" class="border w-full px-2 py-1 rounded" />
        </div>
      </div>

      <div class="mt-3">
        <label class="font-semibold text-sm">Address</label>
        <input v-model="localForm.emergency_address" class="border w-full px-2 py-1 rounded" />
      </div>

      <!-- VALID UNTIL / EXPIRY / PHOTO -->
      <div class="grid grid-cols-3 gap-3 mt-5">

        <!-- LEFT SIDE -->
        <div class="col-span-2">

          <!-- VALID UNTIL -->
          <div class="mb-3">
            <label class="font-semibold text-sm">Valid Until (Month & Year)</label>

            <div class="grid grid-cols-2 gap-2">
              <!-- MONTH -->
              <select v-model="validUntil.month" class="border px-2 py-1 rounded">
                <option disabled value="">Month</option>
                <option v-for="(m, i) in months" :key="i" :value="i + 1">
                  {{ m }}
                </option>
              </select>

              <!-- YEAR -->
              <select v-model="validUntil.year" class="border px-2 py-1 rounded">
                <option disabled value="">Year</option>
                <option v-for="y in yearOptions" :key="y" :value="y">
                  {{ y }}
                </option>
              </select>
            </div>
          </div>

          <!-- EXPIRY DATE -->
          <div>
            <label class="font-semibold text-sm">Expiry Date</label>

            <div class="grid grid-cols-3 gap-2">
              <!-- MONTH -->
              <select v-model="expiry.month" class="border px-2 py-1 rounded">
                <option value="">Month</option>
                <option v-for="(m, i) in months" :key="i" :value="i + 1">
                  {{ m }}
                </option>
              </select>

              <!-- DAY -->
              <select v-model="expiry.day" class="border px-2 py-1 rounded">
                <option value="">Day</option>
                <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
              </select>

              <!-- YEAR -->
              <select v-model="expiry.year" class="border px-2 py-1 rounded">
                <option value="">Year</option>
                <option v-for="y in yearOptions" :key="y" :value="y">
                  {{ y }}
                </option>
              </select>
            </div>
          </div>

        </div>

        <!-- PHOTO UPLOAD BOX -->
        <div class="flex flex-col items-center">
          <label class="font-semibold text-sm mb-1">Photo</label>

          <div
            class="w-24 h-24 border rounded-md flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-100 transition"
            @click="choosePhoto"
          >
            <img
              v-if="previewPhoto"
              :src="previewPhoto"
              class="w-full h-full object-cover rounded-md"
            />
            <span v-else>Click to Upload</span>
          </div>

          <input
            ref="photoInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handlePhoto"
          />
        </div>

      </div>

      <!-- BUTTONS -->
      <div class="flex justify-end mt-6">
        <button class="px-4 py-2 bg-gray-300 rounded mr-2" @click="$emit('close')">
          Cancel
        </button>

        <button class="px-4 py-2 bg-blue-600 text-white rounded" @click="submitForm">
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

      // image
      photoFile: null,
      previewPhoto: this.form.picture_url || null,

      // VALID UNTIL = month + year
      validUntil: { month: "", year: "" },

      // EXPIRY DATE = full date
      expiry: { day: "", month: "", year: "" },

      months: [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ],

      days: Array.from({ length: 31 }, (_, i) => i + 1),

      yearOptions: Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + i)
    };
  },

  watch: {
    form(newVal) {
      this.localForm = { ...newVal };
      this.previewPhoto = newVal.picture_url || null;
    },

    // VALID UNTIL CONVERSION
    validUntil: {
      deep: true,
      handler(v) {
        if (v.year && v.month) {
          this.localForm.valid_until = `${v.year}-${String(v.month).padStart(2, "0")}-01`;
        }
      }
    },

    // EXPIRY DATE CONVERSION
    expiry: {
      deep: true,
      handler(v) {
        if (v.year && v.month && v.day) {
          this.localForm.expiry_date =
            `${v.year}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`;
        }
      }
    }
  },

  methods: {
    choosePhoto() {
      this.$refs.photoInput.click();
    },

    handlePhoto(e) {
      const file = e.target.files[0];
      this.photoFile = file;

      if (file) {
        this.previewPhoto = URL.createObjectURL(file);
      }
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
