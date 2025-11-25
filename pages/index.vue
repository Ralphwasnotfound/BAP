<template>
  <div class="p-6 max-w-4xl mx-auto">

    <Navbar />
    
    <!-- ADMIN LOGIN BUTTON -->
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Admin Login
      </NuxtLink>
    </div>


    <h1 class="text-3xl font-bold mb-6">People Directory</h1>

    <!-- Search + Filters -->
    <div class="flex flex-col md:flex-row gap-3 mb-6">

      <!-- Search -->
      <input
        v-model="search"
        placeholder="Search by name or work ID..."
        class="border px-3 py-2 rounded w-full"
      />

      <!-- Region Filter -->
      <select
        v-model="filterRegion"
        class="border px-3 py-2 rounded w-full md:w-40"
      >
        <option value="">All Regions</option>
        <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
      </select>

      <!-- Designation Filter -->
      <select
        v-model="filterDesignation"
        class="border px-3 py-2 rounded w-full md:w-32"
      >
        <option value="">Designation</option>
        <option v-for="t in designationList" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <!-- People List -->
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
            <th class="p-2 border">Expiry</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in filteredPeople"
            :key="p.id"
            class="border hover:bg-gray-50"
          >
            <!-- PHOTO -->
            <td class="p-2 border text-center">
              <img
                v-if="p.picture_url"
                :src="p.picture_url"
                class="w-12 h-12 rounded-full object-cover mx-auto border"
              />
              <span v-else class="text-gray-500 text-sm">No Photo</span>
            </td>

            <td class="p-2 border">{{ p.full_name }}</td>
            <td class="p-2 border">{{ p.work_id }}</td>
            <td class="p-2 border">{{ p.region }}</td>
            <td class="p-2 border">{{ p.designation }}</td>
            <td class="p-2 border">{{ p.chapter }}</td>
            <td class="p-2 border">{{ p.valid_until }}</td>
            <td
              class="p-2 border"
              :class="{
                'text-red-600 font-bold': isExpired(p.expiry_date),
                'text-yellow-600 font-semibold': willExpireSoon(p.expiry_date)
              }"
            >
              {{ p.expiry_date }}
            </td>
          </tr>

          <!-- No results -->
          <tr v-if="filteredPeople.length === 0">
            <td colspan="8" class="text-center p-4 text-gray-500">
              No matching records found.
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue';

export default {
    components: {
        Navbar
    },
  data() {
    return {
      people: [],
      search: "",
      filterRegion: "",
      filterDesignation: "",
      regions: [],
      designationList: []
    };
  },

  async mounted() {
    const { $supabase } = useNuxtApp();
    this.$supabase = $supabase;

    this.loadPeople();
  },

  methods: {
    async loadPeople() {
      const { data, error } = await this.$supabase.from("people").select("*");

      if (!error) {
        this.people = data;

        this.regions = [...new Set(data.map(p => p.region))].filter(Boolean);

        this.designationList = [...new Set(data.map(p => p.designation))].filter(Boolean);
      }
    },

    isExpired(date) {
      return new Date(date) < new Date();
    },

    willExpireSoon(date) {
      const now = new Date();
      const d = new Date(date);

      const diffDays = (d - now) / (1000 * 60 * 60 * 24);
      return diffDays > 0 && diffDays <= 30;
    }
  },

  computed: {
    filteredPeople() {
      return this.people.filter(p => {
        const matchesSearch = [
            p.full_name,
            p.work_id,
            p.chapter
        ]
            .filter(Boolean)
            .some(field =>
                field.toLowerCase().includes(this.search.toLowerCase())
            );


        const matchesRegion = this.filterRegion
          ? p.region === this.filterRegion
          : true;

        const matchesDesignation = this.filterDesignation
          ? p.designation === this.filterDesignation
          : true;

        return matchesSearch && matchesRegion && matchesDesignation;
      });
    }
  }
};
</script>
