<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-lg w-[900px] max-h-[90vh] overflow-auto">
      <h2 class="text-2xl font-bold mb-4">Bulk Import People</h2>

      <!-- STEP 1: CSV + PHOTO FOLDER -->
      <div v-if="step === 1" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">

          <!-- CSV -->
          <div>
            <label class="block mb-2 font-medium">Upload CSV</label>
            <input type="file" accept=".csv" @change="handleCSVUpload" />
            <p class="text-sm text-gray-600 mt-1">CSV must include a header row.</p>
          </div>

          <!-- PHOTO FOLDER -->
          <div>
            <label class="block mb-2 font-medium">Choose Photo Folder (Optional)</label>
            <input type="file" webkitdirectory directory @change="handlePhotoFolder" />
            <p class="text-sm text-gray-600 mt-1">
              Select the folder containing the photos.
            </p>
            <div v-if="photoCount" class="mt-2 text-sm text-gray-700">
              Photos detected: <strong>{{ photoCount }}</strong>
            </div>
          </div>
        </div>

        <!-- CSV Preview -->
        <div v-if="csvPreview.length" class="mt-4">
          <h3 class="font-semibold mb-2">CSV Preview (first 5 rows)</h3>
          <div class="max-h-40 overflow-auto border rounded">
            <table class="w-full text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th v-for="h in headers" :key="h" class="p-1 border">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in csvPreview" :key="i">
                  <td v-for="h in headers" :key="h" class="p-1 border">{{ r[h] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- CONTROLS -->
        <div class="flex justify-end gap-3 mt-4">
          <button class="px-3 py-2 bg-gray-500 text-white rounded" @click="closeModal">
            Cancel
          </button>

          <button
            class="px-3 py-2 bg-blue-600 text-white rounded"
            :disabled="headers.length === 0"
            @click="step = 2"
          >
            Next → Column Mapping
          </button>
        </div>
      </div>

      <!-- STEP 2: COLUMN MAPPING -->
      <div v-if="step === 2" class="space-y-4">
        <h3 class="text-xl font-semibold">Column Mapping</h3>

        <div
          v-if="unmappedColumns.length"
          class="p-2 bg-yellow-100 text-yellow-900 rounded text-sm"
        >
          ⚠ Ignored columns: <strong>{{ unmappedColumns.join(', ') }}</strong>
        </div>

        <div class="max-h-64 overflow-auto border rounded">
          <table class="w-full text-sm">
            <thead class="bg-gray-200">
              <tr>
                <th class="p-2 border">CSV Column</th>
                <th class="p-2 border">Map To</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="col in headers" :key="col">
                <td class="p-2 border">{{ col }}</td>
                <td class="p-2 border">
                  <select v-model="columnMapping[col]" class="border p-1 rounded w-full">
                    <option value="">Ignore</option>
                    <option
                      v-for="f in allowedFields"
                      :key="f"
                      :value="f"
                    >
                      {{ f }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" id="autosplit" v-model="autoSplitName" />
          <label for="autosplit" class="text-sm">
            Auto-split FULL NAME → first/middle/last/suffix
          </label>
        </div>

        <div class="flex justify-between mt-4">
          <button class="px-3 py-2 bg-gray-500 text-white rounded" @click="step = 1">
            ← Back
          </button>

          <button class="px-3 py-2 bg-blue-600 text-white rounded" @click="goToSimulation">
            Next → Validate & Simulate
          </button>
        </div>
      </div>

      <!-- STEP 3: SIMULATION -->
      <div v-if="step === 3" class="space-y-4">
        <h3 class="text-xl font-semibold">Simulation Preview</h3>

        <!-- ERRORS -->
        <div v-if="errors.length" class="p-3 bg-red-100 text-red-700 rounded">
          <h4 class="font-bold">⚠ Validation Errors:</h4>
          <ul class="list-disc pl-5">
            <li v-for="(e,i) in errors" :key="i">{{ e }}</li>
          </ul>
        </div>

        <!-- PHOTO MATCH SUMMARY -->
        <div
          v-if="photoMatchSummary"
          class="p-2 bg-blue-100 text-blue-900 rounded text-sm"
        >
          <p class="font-semibold">📸 Photo Matching:</p>
          <p>✔ Found: <strong>{{ photoMatchSummary.matched }}</strong></p>
          <p>⚠ Missing: <strong>{{ photoMatchSummary.missing }}</strong></p>
        </div>

        <!-- SIMULATION TABLE -->
        <div class="max-h-60 overflow-auto border rounded">
          <table class="w-full text-xs border">
            <thead class="bg-gray-100">
              <tr>
                <th v-for="h in simulatedHeaders" :key="h" class="p-1 border">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r,i) in simulatedData.slice(0,10)" :key="i">
                <td v-for="h in simulatedHeaders" :key="h" class="p-1 border">
                  {{ r[h] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-sm text-gray-500">
          Showing first 10 rows — total:
          <strong>{{ simulatedData.length }}</strong>
        </p>

        <div class="flex justify-between mt-4">
          <button class="px-3 py-2 bg-gray-500 text-white rounded" @click="step = 2">
            ← Back
          </button>

          <button
            class="px-3 py-2 bg-green-600 text-white rounded"
            :disabled="errors.length"
            @click="confirmImport"
          >
            Import {{ simulatedData.length }} Rows
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "ImportPeopleModal",
  props: { show: Boolean },
  emits: ["close", "import"],

  data() {
    return {
      step: 1,
      headers: [],
      parsedCSV: [],
      csvPreview: [],
      columnMapping: {},
      autoSplitName: true,

      simulatedData: [],
      simulatedHeaders: [],
      photoMatchSummary: null,
      errors: [],

      photoFilesMap: new Map(),

      allowedFields: [
        "first_name",
        "middle_initial",
        "last_name",
        "suffix",
        "full_name",
        "work_id",
        "region",
        "designation",
        "chapter",
        "valid_until",
        "emergency_name",
        "emergency_cp",
        "emergency_address",
        "photo_filename",
      ],
    };
  },

  computed: {
    unmappedColumns() {
      return this.headers.filter((h) => !this.columnMapping[h]);
    },
    photoCount() {
      return this.photoFilesMap.size;
    },
  },

  methods: {
    closeModal() {
      this.$emit("close");
      this.resetAll();
    },

    resetAll() {
      this.step = 1;
      this.headers = [];
      this.parsedCSV = [];
      this.csvPreview = [];
      this.columnMapping = {};
      this.simulatedData = [];
      this.photoFilesMap.clear();
      this.errors = [];
      this.photoMatchSummary = null;
    },

    handleCSVUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          this.parsedCSV = res.data;
          this.headers = res.meta.fields || [];
          this.csvPreview = res.data.slice(0, 5);

          // auto-map columns
          this.headers.forEach((h) => {
            const lower = h.toLowerCase();
            const match = this.allowedFields.find((f) => f === lower);
            this.columnMapping[h] = match || "";
          });
        },
      });
    },

    handlePhotoFolder(e) {
      const files = Array.from(e.target.files || []);
      this.photoFilesMap.clear();

      files.forEach((f) => {
        this.photoFilesMap.set(f.name.trim(), f);
      });
    },

    splitFullName(name) {
      if (!name) return {};

      const parts = name.trim().split(/\s+/);
      const suffixList = ["Jr", "Jr.", "Sr", "Sr.", "III", "IV"];

      let suffix = "";
      if (suffixList.includes(parts[parts.length - 1])) {
        suffix = parts.pop();
      }

      const first = parts.shift() || "";
      const last = parts.pop() || "";
      const mi = parts.join(" ");

      return {
        first_name: first,
        middle_initial: mi,
        last_name: last,
        suffix,
      };
    },

    buildFinalData() {
      const out = [];

      for (const row of this.parsedCSV) {
        const obj = {};

        for (const col of this.headers) {
          const field = this.columnMapping[col];
          if (!field) continue;

          if (field === "full_name" && this.autoSplitName) {
            Object.assign(obj, this.splitFullName(row[col]));
          } else {
            obj[field] = row[col];
          }
        }

        obj.created_at = new Date().toISOString();
        out.push(obj);
      }

      return out;
    },

    goToSimulation() {
      this.simulatedData = this.buildFinalData();
      this.simulatedHeaders = Object.keys(this.simulatedData[0] || {});
      this.validateImport();
      this.matchPhotos();
      this.step = 3;
    },

    validateImport() {
      const errors = [];
      const seen = new Set();

      this.simulatedData.forEach((row, index) => {
        const i = index + 1;

        if (!row.work_id) errors.push(`Row ${i}: Missing work_id`);
        if (!row.first_name) errors.push(`Row ${i}: Missing first_name`);
        if (!row.last_name) errors.push(`Row ${i}: Missing last_name`);

        if (row.work_id) {
          if (seen.has(row.work_id)) {
            errors.push(`Duplicate work_id: ${row.work_id}`);
          }
          seen.add(row.work_id);
        }

        if (row.valid_until && isNaN(Date.parse(row.valid_until))) {
          errors.push(`Row ${i}: Invalid valid_until date`);
        }
      });

      this.errors = errors;
    },

    matchPhotos() {
      let matched = 0;
      let missing = 0;

      for (const row of this.simulatedData) {
        if (!row.photo_filename) continue;

        const found = this.findMatchingPhoto(this.photoFilesMap, row.photo_filename);

        if (found) matched++;
        else missing++;
      }

      this.photoMatchSummary = { matched, missing };
    },
    findMatchingPhoto(photoMap, rawName) {
      if (!rawName) return null;
        
      let name = rawName.trim();
      name = name.replace(/^.*[\\/]/, ""); // remove directories
        
      const lower = name.toLowerCase();
      const noExt = lower.replace(/\.(jpg|jpeg|png|webp)$/i, "");
        
      // Exact match
      for (const key of photoMap.keys()) {
        if (key.toLowerCase() === lower) return photoMap.get(key);
      }
    
      // Match without extension
      for (const key of photoMap.keys()) {
        const base = key.toLowerCase().replace(/\.(jpg|jpeg|png|webp)$/i, "");
        if (base === noExt) return photoMap.get(key);
      }
    
      // Starts-with match
      for (const key of photoMap.keys()) {
        if (key.toLowerCase().startsWith(noExt)) return photoMap.get(key);
      }
    
      return null;
    },
    confirmImport() {
      const photoFilesObj = {};
      for (const [k, v] of this.photoFilesMap.entries()) {
        photoFilesObj[k] = v;
      }

      this.$emit("import", {
        rows: this.simulatedData,
        photoFiles: photoFilesObj,
      });

      this.resetAll();
    },
  },
};
</script>

<style scoped>
/* Minimal styling cleanup */
</style>
