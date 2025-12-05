<template>
  <div class="flex min-h-screen">

    <!-- 🔵 SIDEBAR COMPONENT -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- 🔶 MAIN CONTENT -->
    <main class="flex-1 ml-64 p-6 max-w-5xl">
      <h1 class="text-3xl font-bold mb-6">People Directory</h1>

      <!-- ACTION BUTTONS -->
      <div class="flex gap-3 mb-4">
        <button class="px-4 py-2 bg-blue-600 text-white rounded" @click="openAddModal">
          + Add Person
        </button>
        <button 
        class="px-4 py-2 bg-green-600 text-white rounded"
        @click="exportCSV"
        :class="downloadCSVLock ? 'opacity-50 cursor-not-allowed' : ''"
        :disabled="downloadCSVLock">
          Export CSV
        </button>
        <button 
        class="px-4 py-2 bg-yellow-500 text-white rounded" 
        @click="exportExcel"
        :class="downloadExcelLock ? 'opacity-50 cursor-not-allowed' : ''"
        :disabled="downloadExcelLock"
        >
          Export Excel
        </button>
      </div>

      <!-- SEARCH -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search people..."
          class="border px-3 py-2 rounded w-64"
        />
      </div>

      <!-- PEOPLE TABLE -->
      <table class="w-full border text-left mt-6">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Photo</th>
            <th class="p-2 border">Name</th>
            <th class="p-2 border">Work ID</th>
            <th class="p-2 border">Region</th>
            <th class="p-2 border">Designation</th>
            <th class="p-2 border">Chapter</th>
            <th class="p-2 border">Valid Until</th>
            <th class="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in people" :key="p.id">
            <td class="p-2 border text-center">
              <img
                v-if="p.picture_url"
                :src="p.picture_url"
                class="w-10 h-10 rounded-full object-cover mx-auto"
              />
              <span v-else>No Photo</span>
            </td>

            <td class="p-2 border">
              {{ formatFullName(p) }}
            </td>

            <td class="p-2 border">{{ p.work_id }}</td>
            <td class="p-2 border">{{ p.region }}</td>
            <td class="p-2 border">{{ p.designation }}</td>
            <td class="p-2 border">{{ p.chapter }}</td>

            <!-- REMOVED EXPIRY COLUMN -->
            <td class="p-2 border">{{ formatMonthYear(p.valid_until) }}</td>

            <td class="p-2 border text-center">
              <button class="px-2 py-1 bg-yellow-500 text-white rounded" @click="openEditModal(p)">Edit</button>
              <button class="px-2 py-1 bg-red-600 text-white rounded" @click="openDeleteModal(p)">Delete</button>

              <button 
                class="px-2 py-1 text-white rounded"
                :class="downloadLock ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600'"
                :disabled="downloadLock"
                @click="downloadPDF(p)"
              >
                PDF
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div class="flex justify-center items-center gap-4 mt-4">
        <button class="px-3 py-1 bg-gray-300 rounded" :disabled="currentPage === 1" @click="goPrevPage">
          Prev
        </button>

        <span class="font-semibold">Page {{ currentPage }} of {{ totalPages }}</span>

        <button class="px-3 py-1 bg-gray-300 rounded" :disabled="currentPage === totalPages" @click="goNextPage">
          Next
        </button>
      </div>

      <!-- MODALS -->
      <AddPersonelModal
        :show="showModal"
        :isEditing="isEditing"
        :form="form"
        @close="closeModal"
        @submit="handleModalSubmit"
      />

      <DeleteConfirm
        :show="showDeleteModal"
        :person="selectedPerson"
        @close="showDeleteModal = false"
        @confirm="deletePerson"
      />

      <NotificationModal
        :show="showNotice"
        :title="noticeTitle"
        :message="noticeMessage"
        :type="noticeType"
        @close="showNotice = false"
      />

      <ReDownloadConfirm 
        :show="reDownloadModal"
        @close="reDownloadModal = false; downloadLock = false"
        @confirm="confirmReDownload"
      />

      <ReDownloadConfirm
        :show="reDownloadCSVModal"
        @close="reDownloadCSVModal = false"
        @confirm="confirmReDownloadCSV"
        message="You already downloaded the CSV file. Download again?"
      />

      <ReDownloadConfirm
        :show="reDownloadExcelModal"
        @close="reDownloadExcelModal = false"
        @confirm="confirmReDownloadExcel"
        message="You already downloaded the Excel file. Download again?"
      />

      <LogoutConfirm
        :show="showLogout"
        @close="showLogout = false"
        @confirm="confirmLogout"
      />

      <!-- PDF TEMPLATE -->
      <div style="opacity:0; pointer-events:none; position:absolute; z-index:-1;">
        <PeopleForm ref="PeopleForm" />
      </div>
    </main>
  </div>
  <LoadingModal :show="loading" :message="loadingMessage" />
</template>

<script>
import AdminSideBar from '~/components/Admin/AdminSideBar.vue'
import AddPersonelModal from '~/components/AddPersonelModal.vue'
import DeleteConfirm from '~/components/DeleteConfirm.vue'
import PeopleForm from '~/components/PeopleForm.vue'
import NotificationModal from '~/components/NotificationModal.vue'
import ReDownloadConfirm from '~/components/ReDownloadConfirm.vue'
import LogoutConfirm from "~/components/LogoutConfirm.vue";
import LoadingModal from "~/components/Loading/LoadingModal.vue"

export default {
  components: {
    AdminSideBar,
    AddPersonelModal,
    DeleteConfirm,
    PeopleForm,
    NotificationModal,
    ReDownloadConfirm,
    LogoutConfirm,
    LoadingModal
  },

  data() {
    return {
      showLogout: false,
      people: [],
      searchQuery: "",
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,

      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedPerson: null,

      showNotice: false,
      noticeTitle: "",
      noticeMessage: "",
      noticeType: "",

      form: {},
      photoFile: null,

      downloadLock: false,
      reDownloadModal: false,
      pdfTargetPerson: null,

      loading: false,
      loadingMessage: "Please wait...",

      downloadCSVLock: false,
      downloadExcelLock: false,

      reDownloadCSVModal: false,
      reDownloadExcelModal: false,
    }
  },

  async mounted() {
    this.$supabase = useNuxtApp().$supabase
    this.checkAdmin()
    this.loadPeople()
  },

  methods: {
formatFullName(p) {
  if (!p) return "";
  const mi = p.middle_initial ? p.middle_initial + ". " : "";
  const suffix = p.suffix ? " " + p.suffix : "";
  return `${(p.first_name || "").trim()} ${mi}${(p.last_name || "").trim()}${suffix}`.replace(/\s+/g, " ").trim();
},


checkConnection() {
  if (!navigator.onLine) {
    this.loading = false;
    this.showNotification(
      "Connection Error",
      "No internet connection detected.",
      "error"
    );
    return false;
  }
  return true;
},
timeoutPromise(promise, ms = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
},

  showNotification(title, message, type = "success") {
  this.noticeTitle = title
  this.noticeMessage = message
  this.noticeType = type
  this.showNotice = true
},
    /* ---------------- SECURITY CHECK ---------------- */
    async checkAdmin() {
      const { data } = await this.$supabase.auth.getSession()
      const verified = localStorage.getItem("admin_verified") === "true"
      const trusted = localStorage.getItem("trusted_device") === "true"
      const temp = sessionStorage.getItem("temporary_trust") === "true"

      if (!data.session || !verified || (!trusted && !temp)) {
        this.$router.push("/login")
      }
    },

    /* ---------------- PDF DOWNLOAD ---------------- */
    async downloadPDF(person) {
      const key = `downloaded_${person.id}`

      if (sessionStorage.getItem(key)) {
        this.pdfTargetPerson = person
        this.reDownloadModal = true
        this.downloadLock = true
        return
      }

      await this.performPDFDownload(person)

      sessionStorage.setItem(key, "true")
    },

  async performPDFDownload(person) {
  if (!this.checkConnection()) return;

  this.loading = true;
  this.loadingMessage = "Generating PDF...";
  this.downloadLock = true;

  try {
    // if PeopleForm.exportPersonPDF returns a promise, wrap in timeout if desired:
    await this.timeoutPromise(this.$refs.PeopleForm.exportPersonPDF(person), 20000);
    this.showNotification("PDF Ready", "Download started.", "success");
  } catch (err) {
    console.error(err);
    if (err.message === "timeout") {
      this.showNotification("Timeout", "PDF generation timed out.", "error");
    } else {
      this.showNotification("Error", "Failed to generate PDF.", "error");
    }
  } finally {
    this.loading = false;
    setTimeout(() => (this.downloadLock = false), 2000);
  }
},


    async confirmReDownload() {
      if (!this.pdfTargetPerson) return
      await this.performPDFDownload(this.pdfTargetPerson)
      this.reDownloadModal = false
    },

    /* ---------------- LOAD PEOPLE ---------------- */
    async loadPeople() {
  if (!this.checkConnection()) return;

  this.loading = true;
  this.loadingMessage = "Loading people...";

  try {
    const from = (this.currentPage - 1) * this.pageSize;
    const to = from + this.pageSize - 1;

    let query = this.$supabase
      .from("people")
      .select("*", { count: "exact" })
      .order("id", { ascending: false })
      .range(from, to);

    if (this.searchQuery.trim()) {
      const s = this.searchQuery.trim();
      query = query.or(
        `first_name.ilike.%${s}%,middle_initial.ilike.%${s}%,last_name.ilike.%${s}%,suffix.ilike.%${s}%,work_id.ilike.%${s}%,region.ilike.%${s}%,designation.ilike.%${s}%,chapter.ilike.%${s}%`
      );
    }

    // ⏳ Apply timeout protection (10 seconds)
    const { data, count } = await this.timeoutPromise(query, 10000);

    this.people = data || [];
    this.totalPages = Math.ceil(count / this.pageSize);

  } catch (err) {
    console.error(err);

    if (err.message === "timeout") {
      this.showNotification("Timeout", "Server not responding. Try again.", "error");
    } else {
      this.showNotification("Error", "Failed to load people. Check your connection.", "error");
    }
  }

  this.loading = false;
},


    handleSearch() {
      this.currentPage = 1
      this.loadPeople()
    },

    goPrevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadPeople()
      }
    },

    goNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.loadPeople()
      }
    },

    /* ---------------- MODAL LOGIC ---------------- */
    openAddModal() {
      this.isEditing = false
      this.selectedPerson = null

      this.form = {
        first_name: "",
        middle_initial: "",
        last_name: "",
        work_id: "",
        region: "",
        designation: "",
        chapter: "",
        valid_until: "",
        emergency_name: "",
        emergency_cp: "",
        emergency_address: "",
        picture_url: ""
      }

      this.photoFile = null
      this.showModal = true
    },

    openEditModal(person) {
      this.isEditing = true
      this.selectedPerson = person
      this.form = { ...person }
      this.photoFile = null
      this.showModal = true
    },

    openDeleteModal(person) {
      this.selectedPerson = person
      this.showDeleteModal = true
    },

    closeModal() {
      this.showModal = false
      this.photoFile = null
    },

    /* ---------------- CRUD ---------------- */
    handleModalSubmit({ form, photoFile }) {
      this.form = form
      this.photoFile = photoFile

      if (this.isEditing) this.updatePerson()
      else this.addPerson()
    },

    async uploadPhoto() {
  if (!this.photoFile) return this.form.picture_url || "";

  if (!this.checkConnection()) return this.form.picture_url || "";

  const safe = this.photoFile.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
  const filename = `${Date.now()}_${safe}`;

  try {
    // timeout the upload (20s)
    const uploadRes = await this.timeoutPromise(
      this.$supabase.storage.from("people_photos").upload(filename, this.photoFile),
      20000
    );

    if (uploadRes.error) {
      console.error("Upload error:", uploadRes.error);
      this.showNotification("Upload failed", "Could not upload photo.", "error");
      return this.form.picture_url || "";
    }

    const { data: urlData, error: urlError } = await this.timeoutPromise(
      this.$supabase.storage.from("people_photos").getPublicUrl(filename),
      10000
    );

    if (urlError) {
      console.error("GetPublicUrl error:", urlError);
      return this.form.picture_url || "";
    }

    return urlData.publicUrl || this.form.picture_url || "";

  } catch (err) {
    console.error("uploadPhoto error", err);
    if (err.message === "timeout") {
      this.showNotification("Timeout", "Photo upload timed out.", "error");
    } else {
      this.showNotification("Upload error", "Failed to upload photo.", "error");
    }
    return this.form.picture_url || "";
  }
},


    async addPerson() {
  if (!this.checkConnection()) return;

  this.loading = true;
  this.loadingMessage = "Adding person...";

  try {
    const picture_url = await this.uploadPhoto();

    const { full_name, ...cleanData } = this.form;

    await this.timeoutPromise(
      this.$supabase.from("people").insert([{ ...cleanData, picture_url }]),
      10000
    );

    this.showNotification("Success!", "Person added successfully!", "success");
    this.closeModal();
    await this.loadPeople();
  } catch (err) {
    console.error(err);
    if (err.message === "timeout") {
      this.showNotification("Timeout", "Failed to add person. Server not responding.", "error");
    } else {
      this.showNotification("Error", "Failed to add person. Check your connection.", "error");
    }
  } finally {
    this.loading = false;
  }
},


async updatePerson() {
  if (!this.checkConnection()) return;

  this.loading = true;
  this.loadingMessage = "Updating person...";

  try {
    const picture_url = await this.uploadPhoto();
    const { full_name, ...cleanData } = this.form;

    await this.timeoutPromise(
      this.$supabase.from("people")
        .update({ ...cleanData, picture_url })
        .eq("id", this.selectedPerson.id),
      10000
    );

    this.showNotification("Updated!", "Person updated successfully!", "warning");
    this.closeModal();
    await this.loadPeople();
  } catch (err) {
    console.error(err);
    this.showNotification("Error", "Failed to update person.", "error");
  } finally {
    this.loading = false;
  }
},


    async deletePerson() {
  if (!this.checkConnection()) return;

  this.loading = true;
  this.loadingMessage = "Deleting person...";
  try {
    await this.timeoutPromise(
      this.$supabase.from("people").delete().eq("id", this.selectedPerson.id),
      10000
    );

    this.showNotification("Deleted!", "Person has been removed.", "error");
    this.showDeleteModal = false;
    await this.loadPeople();
  } catch (err) {
    console.error(err);
    this.showNotification("Error", "Failed to delete person.", "error");
  } finally {
    this.loading = false;
  }
},

    /* ---------------- EXPORT ---------------- */
exportCSV() {
  const key = "csv_downloaded";

  // IF ALREADY DOWNLOADED BEFORE → Ask for confirmation
  if (sessionStorage.getItem(key)) {
    this.reDownloadCSVModal = true;
    return;
  }

  // First download
  this.performCSVExport();
  sessionStorage.setItem(key, "true");
},
performCSVExport() {
  if (!this.people.length) return;

  let csv = "Full Name,Work ID,Region,Designation,Valid Until\n";

  this.people.forEach(p => {
    csv += `${this.formatFullName(p)},${p.work_id},${p.region},${p.designation},${p.valid_until}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "people.csv";
  a.click();
},
exportExcel() {
  const key = "excel_downloaded";

  if (sessionStorage.getItem(key)) {
    this.reDownloadExcelModal = true;
    return;
  }

  this.performExcelExport();
  sessionStorage.setItem(key, "true");
},
confirmReDownloadCSV() {
  this.performCSVExport();
  this.reDownloadCSVModal = false;
},

performExcelExport() {
  let table = `
    <table>
      <tr>
        <th>Name</th><th>Work ID</th>
        <th>Region</th><th>Designation</th><th>Valid Until</th>
      </tr>
      ${this.people
        .map(
          p => `
        <tr>
          <td>${this.formatFullName(p)}</td>
          <td>${p.work_id}</td>
          <td>${p.region}</td>
          <td>${p.designation}</td>
          <td>${this.formatMonthYear(p.valid_until)}</td>
        </tr>`
        )
        .join("")}
    </table>`;

  const blob = new Blob([table], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "people.xls";
  a.click();
},
confirmReDownloadExcel() {
  this.performExcelExport();
  this.reDownloadExcelModal = false;
},



    /* ---------------- DATE FORMATTING ---------------- */
    formatMonthYear(value) {
      if (!value) return ""
      const d = new Date(value)
      return d.toLocaleString("en-US", { month: "long", year: "numeric" })
    },

    confirmLogout() {
      this.showLogout = false;
      const { $supabase } = useNuxtApp();
      $supabase.auth.signOut();
      localStorage.removeItem("admin_verified");
      sessionStorage.removeItem("temporary_trust");
      this.$router.push("/login");
    }
  }
}
</script>
