<template>
  <div class="p-6 max-w-5xl mx-auto">

    <h1 class="text-3xl font-bold mb-6">People Directory</h1>
    <!-- PDF TEMPLATE (hidden) -->
    <div ref="pdfTemplateRoot" class="hidden">
      <div
        id="pdf-card"
        class="w-[794px] min-h-[1123px] bg-white p-10 font-serif text-black"
      >
        <!-- HEADER -->
        <div class="flex justify-between items-start">
          <img src="/img/BAP-3.png" class="w-28 h-auto" />

          <div class="text-center leading-tight font-bold text-[14px]">
            <div>BASKETBALL ASSOCIATION OF THE PHILIPPINES</div>
            <div>FEDERATION ROLL D’ BALL</div>
            <div>OFFICE OF THE REGIONAL COMMISSIONER</div>
            <div>CAMP-ONE MARAMAG BUKIDNON Region 10</div>
          </div>

          <div class="border-2 border-black w-[110px] h-[110px] flex items-center justify-center">
            <img
              v-if="pdfData.picture_url"
              :src="pdfData.picture_url"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-xs text-gray-500">No Photo</div>
          </div>
        </div>

        <!-- BODY -->
        <div class="mt-6 space-y-4 text-[14px]">

                <!-- NAME -->
        <div>
            <div class="flex items-center gap-2 whitespace-nowrap">
                <span class="font-bold w-20">NAME:</span>

    <!-- FIRST NAME -->
                <div class="flex-1 flex flex-col items-center">
                    <span class="border-b border-black w-full text-center pb-1 leading-[2] font-semibold text-[16px]"
                        style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">
                        {{ pdfData.first_name }}
                    </span>
                    <span class="text-[11px] font-semibold italic mt-1">FIRST NAME</span>
                </div>
    <!-- MI -->
                <div class="w-16 flex flex-col items-center">
                    <span class="border-b border-black w-full text-center pb-1 leading-[2] font-semibold text-[16px]"
                        style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">
                        {{ pdfData.middle_initial }}
                    </span>
                    <span class="text-[11px] font-semibold italic mt-1">MI</span>
                </div>

    <!-- SURNAME -->
                <div class="flex-1 flex flex-col items-center">
                    <span class="border-b border-black w-full text-center pb-1 leading-[2] font-semibold text-[16px]"
                        style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">
                        {{ pdfData.last_name }}
                    </span>
                    <span class="text-[11px] font-semibold italic mt-1">SURNAME</span>
                </div>
            </div>
        </div>


          <!-- DESIGNATION -->
          <div class="flex items-center">
            <span class="font-bold w-32">DESIGNATION:</span>
            <span class="border-b border-black pb-1 font-semibold text-[16px] inline-block w-40"
                    style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">
              {{ pdfData.designation }}
            </span>
          </div>

          <!-- ID / CHAPTER / REGION -->
          <div class="flex items-center gap-6 text-[13px]">
            <span class="font-bold">ID NO:</span>
            <span class="border-b border-black flex-1 pb-1 font-semibold text-[16px]"
                style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">{{ pdfData.work_id }}</span>

            <span class="font-bold">CHAPTER:</span>
            <span class="border-b border-black flex-1 pb-1 font-semibold text-[16px]"
                style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">{{ pdfData.chapter }}</span>

            <span class="font-bold">REGION:</span>
            <span class="border-b border-black flex-1 pb-1 font-semibold text-[16px]"
                style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">{{ pdfData.region }}</span>
          </div>

          <!-- EMERGENCY SECTION -->
          <div class="space-y-3">
            <div class="font-bold text-[13px]">IN CASE OF EMERGENCY:</div>

            <div class="flex items-center gap-2 text-[13px]">
              <span class="font-bold">NAME:</span>
              <span class="border-b border-black flex-1 pb-1"
                style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">{{ pdfData.emergency_name }}</span>

              <span class="font-bold">CP NO:</span>
              <span class="border-b border-black pb-1 w-[150px]"
                style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">{{ pdfData.emergency_cp }}</span>
            </div>

            <div class="flex items-center">
              <span class="font-bold w-24">ADDRESS:</span>
              <span class="border-b border-black flex-1 pb-1"
                style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">{{ pdfData.emergency_address }}</span>
            </div>
          </div>

          <!-- VALID UNTIL -->
          <div class="flex items-center justify-between text-[13px]">
            <div class="flex items-center flex-1">
                <span class="font-bold mr-2">SPECIMEN'S SIGNATURE:</span>
                <span class="flex-1 pb-1"></span>
            </div>

            <div class="flex items-center ml-10">
                <span class="font-bold mr-2">VALID UNTIL:</span>
                <span class="border-b border-black w-[200px] pb-1 text-center"
                    style="font-family:'Roboto', sans-serif; font-size:18px; font-weight:700;">{{ formatMonthYear(pdfData.valid_until) }}</span>
            </div>
          </div>
        </div>

        <!-- FOOTER SIGNATURES -->
        <div class="flex justify-between mt-16">
          <div class="text-center w-1/2">
            <img src="/img/Sign2.png" class="w-52 mx-auto" />
            <div class="font-bold text-xs mt-1 leading-tight">
              JOSEPH B. LANTONG<br />
              REGIONAL COMMISSIONER
            </div>
          </div>

          <div class="text-center w-1/2">
            <img src="/img/Sign1.png" class="w-48 mx-auto" />
            <div class="font-bold text-xs mt-1 leading-tight">
              WINEFREDO N. NIEZ<br />
              BAP NATIONAL PRESIDENT
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

      pdfData: {
        first_name: "",
        middle_initial: "",
        last_name: "",
        designation: "",
        work_id: "",
        chapter: "",
        region: "",
        picture_url: "",
        valid_until: "",
        expiry_date: "",
        emergency_name: "",
        emergency_cp: "",
        emergency_address: ""
      }
    };
  },

  async mounted() {
    const { $supabase } = useNuxtApp();
    this.$supabase = $supabase;
    await this.loadPeople();
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
          p.designation
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(s));

        const matchesRegion = this.filterRegion ? p.region === this.filterRegion : true;
        const matchesDesignation = this.filterDesignation ? p.designation === this.filterDesignation : true;

        return matchesSearch && matchesRegion && matchesDesignation;
      });
    },

    paginatedPeople() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredPeople.slice(start, start + this.pageSize);
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredPeople.length / this.pageSize));
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

    async exportPersonPDF(person) {
      this.pdfData = { ...person };

      await this.$nextTick();

      const node = this.$refs.pdfTemplateRoot.querySelector("#pdf-card");

      const cloned = node.cloneNode(true);
      cloned.style.position = "fixed";
      cloned.style.left = "-10000px";
      document.body.appendChild(cloned);

      const canvas = await html2canvas(cloned, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "px",
        format: [794, 1123],
        orientation: "portrait",
      });

      pdf.addImage(img, "PNG", 0, 0, 794, 1123);

      const filename = `${person.last_name}_${person.first_name}_${person.middle_initial}_BAP_Form.pdf`
        .replace(/\s+/g, "_");

      pdf.save(filename);
      document.body.removeChild(cloned);
    },
    formatMonthYear(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

  },
};
</script>
