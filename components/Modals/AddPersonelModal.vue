<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white p-6 rounded shadow-xl w-[600px] max-h-[90vh] overflow-y-auto">

      <h2 class="text-2xl font-bold mb-4 text-center">
        {{ isEditing ? "Edit Person" : "Add Person" }}
      </h2>

      <!-- NAME FIELDS -->
      <div class="grid grid-cols-4 gap-3">
        <div>
          <label class="font-semibold text-sm">First Name</label>
          <input
            v-model="localForm.first_name"
            @blur="localForm.first_name = capitalizeWords(localForm.first_name)"
            class="border w-full px-2 py-1 rounded"
          />
          <p v-if="errors.first_name" class="text-red-500 text-xs mt-1">{{ errors.first_name }}</p>
        </div>

        <div>
          <label class="font-semibold text-sm">Middle Initial</label>
          <input
            v-model="localForm.middle_initial"
            maxlength="1"
            class="border w-full px-2 py-1 rounded"
          />
          <p v-if="errors.middle_initial" class="text-red-500 text-xs mt-1">{{ errors.middle_initial }}</p>
        </div>

        <div>
          <label class="font-semibold text-sm">Surname</label>
          <input
            v-model="localForm.last_name"
            @blur="localForm.last_name = capitalizeWords(localForm.last_name)"
            class="border w-full px-2 py-1 rounded"
          />
          <p v-if="errors.last_name" class="text-red-500 text-xs mt-1">{{ errors.last_name }}</p>
        </div>

        <!-- SUFFIX FIELD -->
        <div>
          <label class="font-semibold text-sm">Suffix</label>
          <input
            v-model="localForm.suffix"
            @blur="localForm.suffix = capitalizeWords(localForm.suffix)"
            class="border w-full px-2 py-1 rounded"
          />
        </div>
      </div>

      <!-- DESIGNATION / CHAPTER / REGION -->
      <div class="grid grid-cols-3 gap-3 mt-4">
        <div>
          <label class="font-semibold text-sm">Designation</label>
          <input
            v-model="localForm.designation"
            @blur="localForm.designation = capitalizeWords(localForm.designation)"
            class="border w-full px-2 py-1 rounded"
          />
          <p v-if="errors.designation" class="text-red-500 text-xs mt-1">{{ errors.designation }}</p>
        </div>

        <div>
          <label class="font-semibold text-sm">Chapter</label>
          <input
            v-model="localForm.chapter"
            @blur="localForm.chapter = capitalizeWords(localForm.chapter)"
            class="border w-full px-2 py-1 rounded"
          />
          <p v-if="errors.chapter" class="text-red-500 text-xs mt-1">{{ errors.chapter }}</p>
        </div>

        <div>
          <label class="font-semibold text-sm">Region</label>
          <input
            v-model="localForm.region"
            @blur="handleRegionInput()"
            class="border w-full px-2 py-1 rounded"
          />
          <p v-if="errors.region" class="text-red-500 text-xs mt-1">{{ errors.region }}</p>
        </div>
      </div>

      <!-- ID NO -->
      <div class="mt-4">
        <label class="font-semibold text-sm">ID No.</label>
        <input v-model="localForm.work_id"
        @input="localForm.work_id = localForm.work_id.slice(0, 12)"
        maxlength="12"
        class="border w-full px-2 py-1 rounded"
        />
        <p v-if="errors.work_id" class="text-red-500 text-xs mt-1">{{ errors.work_id }}</p>
      </div>

      <!-- EMERGENCY CONTACT -->
      <h3 class="font-bold mt-5 mb-2 text-gray-700">In Case of Emergency</h3>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="font-semibold text-sm">Name</label>
          <input
            v-model="localForm.emergency_name"
            @blur="localForm.emergency_name = capitalizeWords(localForm.emergency_name)"
            class="border w-full px-2 py-1 rounded"
          />
          <p v-if="errors.emergency_name" class="text-red-500 text-xs mt-1">{{ errors.emergency_name }}</p>
        </div>

        <div>
          <label class="font-semibold text-sm">Mobile No.</label>
          <input v-model="localForm.emergency_cp" class="border w-full px-2 py-1 rounded" />
          <p v-if="errors.emergency_cp" class="text-red-500 text-xs mt-1">{{ errors.emergency_cp }}</p>
        </div>
      </div>

      <div class="mt-3">
        <label class="font-semibold text-sm">Address</label>
        <input
          v-model="localForm.emergency_address"
          @blur="localForm.emergency_address = capitalizeWords(localForm.emergency_address)"
          class="border w-full px-2 py-1 rounded"
        />
        <p v-if="errors.emergency_address" class="text-red-500 text-xs mt-1">{{ errors.emergency_address }}</p>
      </div>

      <!-- VALID UNTIL ONLY -->
      <div class="mt-5">
        <label class="font-semibold text-sm">Valid Until (Month & Year)</label>

        <div class="grid grid-cols-2 gap-2">
          <select v-model="validUntil.month" class="border px-2 py-1 rounded">
            <option disabled value="">Month</option>
            <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
          </select>

          <select v-model="validUntil.year" class="border px-2 py-1 rounded">
            <option disabled value="">Year</option>
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <p v-if="errors.valid_until" class="text-red-500 text-xs mt-1">{{ errors.valid_until }}</p>
      </div>

      <!-- PHOTO -->
      <div class="mt-4 flex flex-col items-center">
        <label class="font-semibold text-sm mb-1">Photo</label>

        <div
          class="w-24 h-24 border rounded-md flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-100 transition"
          @click="choosePhoto"
        >
          <img v-if="previewPhoto" :src="previewPhoto" class="w-full h-full object-cover rounded-md" />
          <span v-else>Click to Upload</span>
        </div>

        <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="handlePhoto" />
      </div>

      <!-- BUTTONS -->
      <div class="flex justify-end mt-6">
        <button class="px-4 py-2 bg-gray-300 rounded mr-2" @click="$emit('close')">Cancel</button>

        <button class="px-4 py-2 bg-blue-600 text-white rounded" @click="submitForm">
          {{ isEditing ? "Update" : "Add" }}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: { show: Boolean, isEditing: Boolean, form: Object },
  emits: ["close", "submit"],

  data() {
    return {
      errors: {},

      localForm: { ...this.form },
      photoFile: null,
      previewPhoto: this.form.picture_url || null,

      validUntil: { month: "", year: "" },

      months: [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
      ],

      yearOptions: Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + i),
    };
  },

  watch: {
    form(newVal) {
      this.localForm = { ...newVal };
      this.previewPhoto = newVal.picture_url || null;
    },

    validUntil: {
      deep: true,
      handler(v) {
        if (v.year && v.month) {
          this.localForm.valid_until =
            `${v.year}-${String(v.month).padStart(2, "0")}-01`;
        }
      }
    },

    "localForm.middle_initial"(val) {
      if (!val) return;
      this.localForm.middle_initial = val.trim().toUpperCase().slice(0, 1);
    },
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
      this.errors = this.validateForm();
      if (Object.keys(this.errors).length > 0) return;

      // Build full name with suffix included
      this.localForm.full_name =
        `${this.localForm.first_name} ` +
        `${this.localForm.middle_initial ? this.localForm.middle_initial + ". " : ""}` +
        `${this.localForm.last_name}` +
        `${this.localForm.suffix ? " " + this.localForm.suffix : ""}`;

      this.$emit("submit", {
        form: this.localForm,
        photoFile: this.photoFile
      });
    },

    validateForm() {
      const errors = {};

      if (!this.localForm.first_name?.trim()) errors.first_name = "First name is required.";
      if (!this.localForm.last_name?.trim()) errors.last_name = "Last name is required.";
      if (!this.localForm.designation?.trim()) errors.designation = "Designation is required.";
      if (!this.localForm.chapter?.trim()) errors.chapter = "Chapter is required.";
      if (!this.localForm.region?.trim()) errors.region = "Region is required.";
      if (!this.localForm.work_id?.trim()) errors.work_id = "ID No. is required.";

      if (!this.localForm.emergency_name?.trim()) errors.emergency_name = "Emergency contact name is required.";
      if (!this.localForm.emergency_address?.trim()) errors.emergency_address = "Emergency address is required.";
      if (!this.localForm.emergency_cp?.trim()) errors.emergency_cp = "Emergency contact number is required.";

      if (!this.validUntil.year || !this.validUntil.month)
        errors.valid_until = "Valid Until is required.";

      if (this.localForm.emergency_cp && !/^[0-9]+$/.test(this.localForm.emergency_cp))
        errors.emergency_cp = "Must contain digits only.";

      if (/\d/.test(this.localForm.first_name))
        errors.first_name = "First name cannot contain numbers.";

      if (/\d/.test(this.localForm.last_name))
        errors.last_name = "Last name cannot contain numbers.";

      return errors;
    },
    toRoman(num) {
      if (!num) return "";
      num = parseInt(num);
      if (isNaN(num)) return "";

      const map = [
        { value: 1000, numeral: "M" },
        { value: 900, numeral: "CM" },
        { value: 500, numeral: "D" },
        { value: 400, numeral: "CD" },
        { value: 100, numeral: "C" },
        { value: 90, numeral: "XC" },
        { value: 50, numeral: "L" },
        { value: 40, numeral: "XL" },
        { value: 10, numeral: "X" },
        { value: 9, numeral: "IX" },
        { value: 5, numeral: "V" },
        { value: 4, numeral: "IV" },
        { value: 1, numeral: "I" }
      ];

      let result = "";
      for (const entry of map) {
        while (num >= entry.value) {
          result += entry.numeral;
          num -= entry.value;
        }
      }
      return result;
    },
    handleRegionInput() {
      let value = this.localForm.region.trim().toUpperCase();

      // NCR
      if (value === "NCR" || value === "NATIONAL CAPITAL REGION") {
        this.localForm.region = "NCR";
        return;
      }
    
      // CAR
      if (value === "CAR" || value === "CORDILLERA" || value === "CORDILLERA ADMINISTRATIVE REGION") {
        this.localForm.region = "CAR";
        return;
      }
    
      // ✔ Roman numeral detection (I, II, III, IV... XIII... XX...)
      const romanRegex = /^(M|CM|D|CD|C|XC|L|XL|X|IX|V|IV|I)+$/;
    
      if (romanRegex.test(value)) {
        // keep roman numeral formatting proper
        this.localForm.region = `Region ${value}`;
        return;
      }
    
      // ✔ Convert numbers to Roman numeral
      if (/^\d+$/.test(value)) {
        const numeral = this.toRoman(value);
        this.localForm.region = `Region ${numeral}`;
        return;
      }
    
      // ✔ Otherwise just capitalize normally
      this.localForm.region = this.capitalizeWords(this.localForm.region);
    },

    capitalizeWords(str) {
      if (!str) return "";
      return str
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
};
</script>
