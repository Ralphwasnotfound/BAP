
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
  >
    <div
      class="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <!-- HEADER -->
      <div class="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-800">
          Bulk Import People
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>

      <!-- BODY -->
      <div class="p-6 space-y-6 max-h-[85vh] overflow-auto">

        <!-- STEP 1 -->
        <div v-if="step === 1" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- CSV -->
            <div class="bg-gray-50 rounded-xl p-4 border">
              <label class="block text-sm font-medium mb-2 text-gray-700">
                Upload CSV
              </label>
              <input
                type="file"
                accept=".csv"
                @change="handleCSVUpload"
                class="block w-full text-sm"
              />
              <p class="text-xs text-gray-500 mt-2">
                CSV must include a header row.
              </p>
            </div>

            <!-- PHOTOS -->
            <div class="bg-gray-50 rounded-xl p-4 border">
              <label class="block text-sm font-medium mb-2 text-gray-700">
                Photo Folder (Optional)
              </label>
              <input
                type="file"
                webkitdirectory
                directory
                @change="handlePhotoFolder"
                class="block w-full text-sm"
              />
              <p class="text-xs text-gray-500 mt-2">
                Folder containing image files.
              </p>

              <div
                v-if="photoCount"
                class="mt-3 text-sm text-blue-700 font-medium"
              >
                📸 {{ photoCount }} photos detected
              </div>
            </div>
          </div>

          <!-- CSV PREVIEW -->
          <div v-if="csvPreview.length">
            <h3 class="text-sm font-semibold text-gray-700 mb-2">
              CSV Preview (first 5 rows)
            </h3>
            <div class="rounded-xl border overflow-auto">
              <table class="w-full text-xs">
                <thead class="bg-gray-100 sticky top-0">
                  <tr>
                    <th
                      v-for="h in headers"
                      :key="h"
                      class="px-3 py-2 text-left border-b"
                    >
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(r, i) in csvPreview"
                    :key="i"
                    class="hover:bg-gray-50"
                  >
                    <td
                      v-for="h in headers"
                      :key="h"
                      class="px-3 py-2 border-b"
                    >
                      {{ r[h] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              @click="closeModal"
            >
              Cancel
            </button>

            <button
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              :disabled="headers.length === 0"
              @click="step = 2"
            >
              Next →
            </button>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-if="step === 2" class="space-y-5">
          <h3 class="text-lg font-semibold text-gray-800">
            Column Mapping
          </h3>

          <div
            v-if="unmappedColumns.length"
            class="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800"
          >
            ⚠ Ignored columns:
            <strong>{{ unmappedColumns.join(", ") }}</strong>
          </div>

          <div class="rounded-xl border overflow-auto max-h-72">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="p-3 border-b text-left">CSV Column</th>
                  <th class="p-3 border-b text-left">Map To</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="col in headers"
                  :key="col"
                  class="hover:bg-gray-50"
                >
                  <td class="p-3 border-b">{{ col }}</td>
                  <td class="p-3 border-b">
                    <select
                      v-model="columnMapping[col]"
                      class="w-full border rounded-lg px-2 py-1 text-sm"
                    >
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

          <label class="flex items-center gap-2 text-sm text-gray-700">
            <input 
            type="checkbox" 
            v-model="autoSplitName" 
            :disabled="!Object.values(columnMapping).includes('full_name')"
            />
            Auto-split FULL NAME into parts
          </label>

          <div class="flex justify-between pt-4 border-t">
            <button
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              @click="step = 1"
            >
              ← Back
            </button>

            <button
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              @click="goToSimulation"
            >
              Next →
            </button>
          </div>
        </div>

        <!-- STEP 3 -->
        <div v-if="step === 3" class="space-y-5">
          <h3 class="text-lg font-semibold text-gray-800">
            Simulation Preview
          </h3>

          <div
            v-if="errors.length"
            class="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700"
          >
            <p class="font-semibold mb-2">⚠ Validation Errors</p>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(e,i) in errors" :key="i">{{ e }}</li>
            </ul>
          </div>

          <div
            v-if="photoMatchSummary"
            class="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800"
          >
            <p class="font-semibold">📸 Photo Matching</p>
            <p>✔ Found: {{ photoMatchSummary.matched }}</p>
            <p>⚠ Missing: {{ photoMatchSummary.missing }}</p>
          </div>

          <div class="rounded-xl border overflow-auto max-h-64">
            <table class="w-full text-xs">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th
                    v-for="h in simulatedHeaders"
                    :key="h"
                    class="p-2 border-b"
                  >
                    {{ h }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(r,i) in simulatedData.slice(0,10)"
                  :key="i"
                  class="hover:bg-gray-50"
                >
                  <td
                    v-for="h in simulatedHeaders"
                    :key="h"
                    class="p-2 border-b"
                  >
                    {{ r[h] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between pt-4 border-t">
            <button
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              @click="step = 2"
            >
              ← Back
            </button>

            <button
              class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
              :disabled="errors.length"
              @click="confirmImport"
            >
              Import {{ simulatedData.length }} Rows
            </button>
          </div>
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
        "last_name",
        "first_name",
        "middle_initial",
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
    let usedFullName = false;

    // ONLY loop real CSV headers
    for (const col of Object.keys(row)) {
      const field = this.columnMapping[col];
      if (!field) continue;

      if (field === "full_name" && this.autoSplitName) {
        Object.assign(obj, this.splitFullName(row[col]));
        usedFullName = true;
        continue;
      }

      if (obj.suffix && /^[A-Z]$/i.test(obj.suffix)) {
  obj.middle_initial = obj.suffix;
  obj.suffix = "";
}

      obj[field] = row[col];
    }

    // ✅ ENSURE fields exist (but DO NOT overwrite)
    if (!usedFullName) {
      obj.middle_initial = obj.middle_initial ?? "";
      obj.suffix = obj.suffix ?? "";
    }

    // Normalize region
    obj.region = this.normalizeRegion(obj.region);

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
      
        // =========================
        // REQUIRED CORE FIELDS
        // =========================
        if (!row.work_id)
          errors.push(`Row ${i}: Missing work_id`);
      
        if (!row.first_name)
          errors.push(`Row ${i}: Missing first_name`);
      
        if (!row.last_name)
          errors.push(`Row ${i}: Missing last_name`);
      
        // =========================
        // DUPLICATE CHECK
        // =========================
        if (row.work_id) {
          if (seen.has(row.work_id)) {
            errors.push(`Row ${i}: Duplicate work_id (${row.work_id})`);
          }
          seen.add(row.work_id);
        }
      
        // =========================
        // DATE VALIDATION
        // =========================
        if (row.valid_until && isNaN(Date.parse(row.valid_until))) {
          errors.push(`Row ${i}: Invalid valid_until date`);
        }
      
        // =========================
        // EMERGENCY CONTACT VALIDATION
        // =========================
        if (!row.emergency_name) {
          errors.push(`Row ${i}: Missing emergency_name`);
        }
      
        if (!row.emergency_cp) {
          errors.push(`Row ${i}: Missing emergency_cp`);
        } else {
          // allow numbers, +, spaces, dashes
          const phone = String(row.emergency_cp).replace(/\s+/g, "");
          if (!/^[0-9+\-]{7,15}$/.test(phone)) {
            errors.push(`Row ${i}: Invalid emergency_cp (${row.emergency_cp})`);
          }
        }
      
        if (!row.emergency_address) {
          errors.push(`Row ${i}: Missing emergency_address`);
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
normalizeRegion(value) {
  // Default region
  const DEFAULT = "Region 10";

  if (!value) return DEFAULT;

  let v = String(value).trim().toUpperCase();

  // Special regions (keep as-is)
  const special = ["NCR", "CAR", "BARMM"];
  if (special.includes(v)) return v;

  // Roman → Number
  const romanMap = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
    IX: 9,
    X: 10,
    XI: 11,
    XII: 12,
    XIII: 13
  };

  // Remove "REGION" text
  v = v.replace(/^REGION\s*/i, "");

  // Roman numeral input
  if (romanMap[v]) {
    return `Region ${romanMap[v]}`;
  }

  // Numeric input
  if (/^\d+$/.test(v)) {
    return `Region ${parseInt(v, 10)}`;
  }

  // Fallback
  return DEFAULT;
}

 
  },
};
</script>

<style scoped>
/* Minimal styling cleanup */
</style>
