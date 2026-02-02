<template>
  <div class="p-3 max-w-6xl mx-auto">

    <!-- HEADER -->
    <div class="flex flex-row items-center sm:flex-row sm:items-center gap-3 mb-4">
      <img src="/img/BAP-2.png" alt="" class="w-20 sm:w-24">
      <h1 class="text-2xl sm:text-3xl font-bold">
        People Directory
      </h1>
    </div>

    <!-- RESULT + LEGEND -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">

      <!-- RESULT -->
      <div class="flex items-center min-h-[32px]">
        <div
          v-if="(
            search.trim().length > 0 || 
            filterRegion !== '' || 
            filterDesignation !== ''
          ) && filteredPeople.length > 0"
          class="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 border rounded-full 
                 text-sm text-gray-600"
        >
          <span class="font-semibold">{{ filteredPeople.length }}</span>
          {{ filteredPeople.length === 1 ? 'Item' : 'Items' }}
        </div>
      </div>

      <!-- STATUS FILTER -->
      <div class="flex gap-2 flex-wrap">
        <button
          class="px-3 py-1 rounded-full text-[10px] border"
          :class="statusFilter === '' ? 'bg-gray-100 text-gray-500' : ''"
          @click="statusFilter = ''"
        >
          All
        </button>
      
        <button
          class="px-3 py-1 rounded-full text-[10px] border bg-green-300 text-green-800"
          :class="statusFilter === 'valid' ? 'ring-2 ring-green-400' : ''"
          @click="statusFilter = 'valid'"
        >
          Active
        </button>
      
        <button
          class="px-3 py-1 rounded-full text-[10px] border bg-yellow-300 text-yellow-800"
          :class="statusFilter === 'expiring' ? 'ring-2 ring-yellow-400' : ''"
          @click="statusFilter = 'expiring'"
        >
          Expiring Soon
        </button>
      
        <button
          class="px-3 py-1 rounded-full text-[10px] border bg-red-300 text-red-800"
          :class="statusFilter === 'expired' ? 'ring-2 ring-red-400' : ''"
          @click="statusFilter = 'expired'"
        >
          Expired
        </button>
      </div>
    </div>

    <!-- SEARCH + FILTERS -->
    <div class="flex flex-col md:flex-row gap-3 mb-3">

      <!-- SEARCH -->
      <div class="relative flex-1">
        <input
          v-model="search"
          placeholder="Search name, ID No., or chapter..."
          class="w-full border rounded-full px-4 py-2 pl-10 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          fill="rgba(173,184,194,1)"
        >
          <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168Z"/>
        </svg>
      </div>

      <!-- REGION -->
      <div class="grid grid-gols-1 sm:grid-cols-3 gap-2">
        <select
          v-model="filterRegion"
          class="border rounded-full px-4 py-2 text-sm w-full md:w-44
                 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
        >
          <option value="">All Regions</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>

      <!-- CHAPTER ✅ -->
        <select
          v-model="filterChapter"
          class="border rounded-full px-4 py-2 text-sm w-full md:w-44
                 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
        >
          <option value="">All Chapters</option>
          <option v-for="c in chapterList" :key="c" :value="c">
            {{ c }}
          </option>
        </select>

        <!-- DESIGNATION -->
        <select
          v-model="filterDesignation"
          class="border rounded-full px-4 py-2 text-sm w-full md:w-40
                 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
        >
          <option value="">Designation</option>
          <option v-for="t in designationList" :key="t" :value="t">
            {{ t }}
          </option>
        </select>
      </div>
    </div>

    <!-- TABLE WRAPPER -->
    <div class="relative overflow-x-auto bg-white shadow rounded border">

      <table class="min-w-[900px] w-full text-sm text-left">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="p-3 border text-center w-[80px]">Photo</th>
            <th class="p-3 border">Name</th>
            <th class="p-3 border">ID. No</th>
            <th class="p-3 border">Region</th>
            <th class="p-3 border">Designation</th>
            <th class="p-3 border">Chapter</th>
            <th class="p-3 border">Valid Until</th>
          </tr>
        </thead>

        <tbody>
          <transition-group name="tableFade" as="template">
            <tr
              v-for="p in paginatedPeople"
              :key="p.id"
              class="hover:bg-gray-50 text-[13px] cursor-pointer"
              @click="openPersonCard(p)"
            >
              <td class="p-2 border text-center">
                <div class="relative w-10 h-10 mx-auto">
                
                  <!-- REAL PHOTO -->
                  <img
                    v-if="p.picture_url && !hasImageError[p.id]"
                    :src="p.picture_url"
                    class="w-10 h-10 rounded-full object-cover border"
                    @error="hasImageError[p.id] = true"
                  />
                
                  <!-- LOGO FALLBACK -->
                  <img
                    v-else
                    src="/assets/img/BAP-2.png"
                    class="w-10 h-10 rounded-full object-contain border bg-white p-1"
                    alt="No photo"
                  />
                
                  <!-- OVERLAY (PHOTO ONLY) -->
                  <div
                    v-if="!p.picture_url || hasImageError[p.id]"
                    class="absolute inset-0 rounded-full
                          flex items-center justify-center
                        bg-black/40"
                  >
                    <span class="text-[5px] text-white font-semibold">
                      NO PHOTO
                    </span>
                  </div>
                
                </div>
              </td>

              <td class="p-2 border font-medium text-gray-800">
                {{ formatFullName(p) }}
              </td>

              <td class="p-2 border text-gray-700">{{ p.work_id }}</td>
              <td class="p-2 border text-gray-700">{{ p.region }}</td>
              <td class="p-2 border text-gray-700">{{ p.designation }}</td>
              <td class="p-2 border text-gray-700">{{ p.chapter }}</td>

              <td
                class="p-2 border font-semibold"
                :class="getValidColor(p.valid_until)"
              >
                {{ formatMonthYear(p.valid_until) }}
              </td>
            </tr>
          </transition-group>

          <tr v-if="filteredPeople.length === 0">
            <td colspan="7" class="p-4 text-center text-gray-500">
              No matching records found.
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- PAGINATION -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">

      <span class="text-sm text-gray-500">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <div class="flex gap-2">
        <button
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
                 hover:bg-gray-200 disabled:opacity-50 transition"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Prev
        </button>

        <button
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
                 hover:bg-gray-200 disabled:opacity-50 transition"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>

    </div>

    <!-- PERSON MODAL -->
    <ClientOnly>
      <Teleport to="body">
        <PersonCardModal
          :show="showCardModal"
          :person="cardPerson"
          @close="showCardModal = false"
        />
      </Teleport>
    </ClientOnly>
  </div>
</template>


<script>
import PersonCardModal from "~/components/Modals/PersonCardModal.vue";

export default {
  components: {
    PersonCardModal
  },
  data() {
    return {
      showCardModal:false,
      cardPerson: null,
      supabase: null,
      hasImageError: {},
      people: [],
      loading: false,
      loadingProgress: 0,
      fullyLoaded: false,
      search: "",
      filterRegion: "",
      filterChapter: "", 
      filterDesignation: "",
      regions: [],
      designationList: [],
      chapterList: [], 
      currentPage: 1,
      pageSize: 10,
      statusFilter: ""
    };
  },

  async mounted() {
  this.supabase = useSupabaseClient();
  await this.loadPeople();   // wait for actual data
  this.$emit("loaded");      // tell parent that loading is finished
},


  computed: {
filteredPeople() {
  const s = this.search.toLowerCase();

  return this.people.filter((p) => {
    const matchesSearch = [
      this.formatFullName(p),
      p.work_id,
      p.chapter,
      p.region,
      p.designation,
    ]
      .filter(Boolean)
      .some((field) => (field || "").toLowerCase().includes(s));

    const matchesRegion =
      !this.filterRegion || p.region === this.filterRegion;

    const matchesDesignation =
      !this.filterDesignation || p.designation === this.filterDesignation;

    const matchesChapter =
      !this.filterChapter || p.chapter === this.filterChapter;

    const status = this.getStatus(p.valid_until);
    const matchesStatus =
      !this.statusFilter || status === this.statusFilter;

    return (
      matchesSearch &&
      matchesRegion &&
      matchesDesignation &&
      matchesChapter &&
      matchesStatus
    );
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
      filterChapter() {        
    this.currentPage = 1;
    },
    statusFilter() {     
    this.currentPage = 1;
    },
  },

  methods: {
    formatFullName(p) {
      const mi = p.middle_initial ? p.middle_initial + ". " : "";
      const suffix = p.suffix ? " " + p.suffix : "";
      return `${p.first_name} ${mi}${p.last_name}${suffix}`;
    },
    async loadPeople() {
      this.loading = true
      this.loadingProgress = 0

      const pageSize = 1000
      let from = 0
      let all = []

      try {
        while (true) {
          const { data, error } = await this.supabase
            .from("people")
            .select("*")
            .order("id", { ascending: true })
            .range(from, from + pageSize - 1)
        
          if (error) throw error
          if (!data || data.length === 0) break
        
          all.push(...data)
        
          // 🔥 update UI progressively
          this.people = [...all]
        
          // update progress (fake but useful UX)
          this.loadingProgress += data.length
        
          if (data.length < pageSize) break
          from += pageSize
        
          // 🧠 let UI breathe (VERY important)
          await new Promise(r => setTimeout(r, 0))
        }
      
        this.fullyLoaded = true
      
        // build filters ONCE (from full dataset)
        this.regions = [...new Set(all.map(p => p.region))].filter(Boolean)
        this.designationList = [...new Set(all.map(p => p.designation))].filter(Boolean)
        this.chapterList = [...new Set(all.map(p => p.chapter))].filter(Boolean).sort()
      
      } catch (err) {
        console.error("loadPeople failed:", err)
      } finally {
        this.loading = false
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    openPersonCard(person) {
      this.cardPerson = person
      this.showCardModal = true
    },

    getValidColor(validUntil) {
      if (!validUntil) return "";
      
      const today = new Date();
      
      // Extract ONLY year + month for today
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // 0–11
      
      // Extract ONLY year + month for expiration
      const expDate = new Date(validUntil);
      const expYear = expDate.getFullYear();
      const expMonth = expDate.getMonth();
      
      // Convert to total months for easy comparison
      const todayTotal = currentYear * 12 + currentMonth;
      const expTotal = expYear * 12 + expMonth;
      
      const diffMonths = expTotal - todayTotal;
      
      // EXPIRED (month-year earlier than today)
      if (diffMonths < 0) {
        return "text-red-600 font-bold";
      }
    
      if (diffMonths === 0) {
        return "text-red-600 font-bold";
      }
    
      // ALMOST EXPIRED (within 2 months)
      if (diffMonths <= 2) {
        return "text-yellow-600 font-bold";
      }
    
      // STILL VALID
      return "text-green-600 font-bold";
    },
    formatMonthYear(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleString("en-US", { month: "long", year: "numeric" });
    },
    getStatus(validUntil) {
  if (!validUntil) return "unknown";

  const now = new Date();
  const expiry = new Date(validUntil);

  const diffMonths =
    (expiry.getFullYear() - now.getFullYear()) * 12 +
    (expiry.getMonth() - now.getMonth());

  if (diffMonths < 0 || diffMonths === 0) return "expired";
  if (diffMonths <= 2) return "expiring";
  return "valid";
},

  },
};
</script>

<style scoped>

    /* Fade + Slide animation for table rows */
.tableFade-enter-active,
.tableFade-leave-active {
  transition: all 0.35s ease;
}

.tableFade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.tableFade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

</style>