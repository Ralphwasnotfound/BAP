<template>
  <div class="hidden" ref="pdfTemplateRoot">
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

        <!-- NAME BLOCK -->
        <div>
  <div class="flex items-center gap-2 whitespace-nowrap">
    <span class="font-bold w-20">NAME:</span>

    <!-- FIRST NAME -->
    <div class="flex-1 flex flex-col items-center">
      <span class="border-b border-black w-full text-center pb-1 font-semibold text-[16px]">
        {{ pdfData.first_name }}
      </span>
      <span class="text-[11px] italic font-semibold mt-1">FIRST NAME</span>
    </div>

    <!-- MIDDLE INITIAL -->
    <div class="w-16 flex flex-col items-center">
      <span class="border-b border-black w-full text-center pb-1 font-semibold text-[16px]">
        {{ pdfData.middle_initial }}
      </span>
      <span class="text-[11px] italic font-semibold mt-1">MI</span>
    </div>

    <!-- LAST NAME -->
    <div class="flex-1 flex flex-col items-center">
      <span class="border-b border-black w-full text-center pb-1 font-semibold text-[16px]">
        {{ pdfData.last_name }}
      </span>
      <span class="text-[11px] italic font-semibold mt-1">SURNAME</span>
    </div>

    <!-- SUFFIX -->
    <div class="w-20 flex flex-col items-center">
      <span class="border-b border-black w-full text-center pb-1 font-semibold text-[16px]">
        {{ pdfData.suffix }}
      </span>
      <span class="text-[11px] italic font-semibold mt-1">SUFFIX</span>
    </div>
  </div>
</div>


        <!-- DESIGNATION -->
        <div class="flex items-center">
          <span class="font-bold w-32">DESIGNATION:</span>
          <span class="border-b border-black pb-1 inline-block w-40 font-semibold text-[16px]">
            {{ pdfData.designation }}
          </span>
        </div>

        <!-- ID / CHAPTER / REGION -->
        <div class="flex items-center gap-6 text-[13px]">
          <span class="font-bold">ID NO:</span>
          <span class="border-b border-black flex-1 pb-1 font-semibold text-[16px]">{{ pdfData.work_id }}</span>

          <span class="font-bold">CHAPTER:</span>
          <span class="border-b border-black flex-1 pb-1 font-semibold text-[16px]">{{ pdfData.chapter }}</span>

          <span class="font-bold">REGION:</span>
          <span class="border-b border-black flex-1 pb-1 font-semibold text-[16px]">{{ pdfData.region }}</span>
        </div>

        <!-- EMERGENCY -->
        <div class="space-y-3">
          <div class="font-bold text-[13px]">IN CASE OF EMERGENCY:</div>

          <div class="flex items-center gap-2 text-[13px]">
            <span class="font-bold">NAME:</span>
            <span class="border-b border-black flex-1 pb-1">{{ pdfData.emergency_name }}</span>

            <span class="font-bold">CP NO:</span>
            <span class="border-b border-black pb-1 w-[150px]">{{ pdfData.emergency_cp }}</span>
          </div>

          <div class="flex items-center">
            <span class="font-bold w-24">ADDRESS:</span>
            <span class="border-b border-black flex-1 pb-1">{{ pdfData.emergency_address }}</span>
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
            <span class="border-b border-black w-[200px] pb-1 text-center font-semibold text-[16px]">
              {{ formatMonthYear(pdfData.valid_until) }}
            </span>
          </div>
        </div>

      </div>

      <!-- FOOTER -->
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
</template>

<script>
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default {
  data() {
    return {
      pdfData: {}
    }
  },

  methods: {
    async exportPersonPDF(person) {
      this.pdfData = { ...person }
      await this.$nextTick()
      await this.generatePDF(person)
    },

    async generatePDF(person) {
      const node = this.$refs.pdfTemplateRoot.querySelector("#pdf-card")

      const clone = node.cloneNode(true)
      clone.style.position = "fixed"
      clone.style.left = "-9999px"
      document.body.appendChild(clone)

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      })

      const img = canvas.toDataURL("image/png")

      const pdf = new jsPDF({
        unit: "px",
        format: [794, 1123],
        orientation: "portrait"
      })

      pdf.addImage(img, "PNG", 0, 0, 794, 1123)

      const file = `${person.last_name}_${person.first_name}_${person.middle_initial}_BAP_Form.pdf`
        .replace(/\s+/g, "_")

      pdf.save(file)

      document.body.removeChild(clone)
    },

    formatMonthYear(date) {
      if (!date) return ""
      return new Date(date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    }
  }
}
</script>
