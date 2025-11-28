<template>
  <div class="p-2 max-w-4xl mx-auto">

    <!-- HEADER -->
    <div class="flex flex-1 items-center">
      <img src="/assets/img/BAP.png" alt="" class="w-24">
      <h1 class="text-3xl font-bold mb-6">People Directory</h1>
    </div>

    <!-- Search + Filters -->
    <div class="flex flex-col md:flex-row gap-3 mb-6">
      <input
        v-model="search"
        placeholder="Search by name, work ID, or chapter..."
        class="border px-3 py-2 rounded w-full"
      />

      <select v-model="filterRegion" class="border px-3 py-2 rounded w-full md:w-40">
        <option value="">All Regions</option>
        <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
      </select>

      <select v-model="filterDesignation" class="border px-3 py-2 rounded w-full md:w-32">
        <option value="">Designation</option>
        <option v-for="t in designationList" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <!-- People Table -->
    <div class="bg-white shadow rounded overflow-hidden border">
      <table class="w-full text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Photo</th>
            <th class="p-2 border">Name</th>
            <th class="p-2 border">Work ID</th>
            <th class="p-2 border">Region</th>
            <th class="p-2 border">Designation</th>
            <th class="p-2 border">Chapter</th>
            <th class="p-2 border">Valid Until</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in paginatedPeople"
            :key="p.id"
            class="border hover:bg-gray-50"
          >
            <td class="p-2 border text-center">
              <img
                v-if="p.picture_url"
                :src="p.picture_url"
                class="w-12 h-12 rounded-full object-cover mx-auto border"
              />
              <span v-else class="text-gray-500 text-sm">No Photo</span>
            </td>

            <td class="p-2 border">{{ p.first_name }} {{ p.middle_initial }}. {{ p.last_name }}</td>
            <td class="p-2 border">{{ p.work_id }}</td>
            <td class="p-2 border">{{ p.region }}</td>
            <td class="p-2 border">{{ p.designation }}</td>
            <td class="p-2 border">{{ p.chapter }}</td>

            <!-- VALID UNTIL COLOR-HIGHLIGHT -->
            <td class="p-2 border" :class="getValidColor(p.valid_until)">
              {{ formatMonthYear(p.valid_until) }}
            </td>
          </tr>

          <tr v-if="filteredPeople.length === 0">
            <td colspan="8" class="text-center p-4 text-gray-500">
              No matching records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-4 mt-4">
      <button
        class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>

      <span class="font-semibold">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      people: [],
      search: "",
      filterRegion: "",
      filterDesignation: "",
      regions: [],
      designationList: [],
      currentPage: 1,
      pageSize: 10,
    };
  },

  async mounted() {
    const { $supabase } = useNuxtApp();
    this.$supabase = $supabase;
    this.loadPeople();
  },

  computed: {
    filteredPeople() {
      const s = this.search.toLowerCase();

      return this.people.filter((p) => {
        const matchesSearch = [
          `${p.first_name} ${p.middle_initial} ${p.last_name}`,
          p.work_id,
          p.chapter,
          p.region,
          p.designation,
        ]
          .filter(Boolean)
          .some((field) => (field || "").toLowerCase().includes(s));

        const matchesRegion = this.filterRegion
          ? p.region === this.filterRegion
          : true;

        const matchesDesignation = this.filterDesignation
          ? p.designation === this.filterDesignation
          : true;

        return matchesSearch && matchesRegion && matchesDesignation;
      });
    },

    paginatedPeople() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredPeople.slice(start, start + this.pageSize);
    },

    totalPages() {
      return Math.ceil(this.filteredPeople.length / this.pageSize) || 1;
    },
  },

  watch: {
    search() {
      this.currentPage = 1;
    },
    filterRegion() {
      this.currentPage = 1;
    },
    filterDesignation() {
      this.currentPage = 1;
    },
  },

  methods: {
    async loadPeople() {
      const { data } = await this.$supabase.from("people").select("*");
      if (data) {
        this.people = data;
        this.regions = [...new Set(data.map((p) => p.region))].filter(Boolean);
        this.designationList = [...new Set(data.map((p) => p.designation))].filter(Boolean);
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    getValidColor(validUntil) {
      if (!validUntil) return "";

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const d = new Date(validUntil);
      const expMonth = d.getMonth();
      const expYear = d.getFullYear();

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return "text-red-600 font-bold"; // expired
      }

      if (expYear === currentYear && expMonth === currentMonth) {
        return "text-yellow-600 font-bold"; // expiring this month
      }

      return "text-green-600 font-bold"; // valid future
    },

    formatMonthYear(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleString("en-US", { month: "long", year: "numeric" });
    },
  },
};
</script>
