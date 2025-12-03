<template>
  <div class="p-6 max-w-5xl mx-auto">

    <h1 class="text-3xl font-bold mb-6">People Directory</h1>

    <!-- ACTION BUTTONS -->
    <div class="flex gap-3 mb-4">
      <button class="px-4 py-2 bg-blue-600 text-white rounded" @click="openAddModal">+ Add Person</button>
      <button class="px-4 py-2 bg-green-600 text-white rounded" @click="exportCSV">Export CSV</button>
      <button class="px-4 py-2 bg-yellow-500 text-white rounded" @click="exportExcel">Export Excel</button>
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
          <th class="p-2 border">Expiry</th>
          <th class="p-2 border">Valid Until</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in people" :key="p.id">
          <td class="p-2 border text-center">
            <img v-if="p.picture_url" :src="p.picture_url" class="w-10 h-10 rounded-full object-cover mx-auto" />
            <span v-else>No Photo</span>
          </td>

          <td class="p-2 border">{{ p.first_name }} {{ p.middle_initial }}. {{ p.last_name }}</td>
          <td class="p-2 border">{{ p.work_id }}</td>
          <td class="p-2 border">{{ p.region }}</td>
          <td class="p-2 border">{{ p.designation }}</td>
          <td class="p-2 border">{{ p.chapter }}</td>
          <td class="p-2 border">{{ formatFullDate(p.expiry_date) }}</td>
          <td class="p-2 border">{{ formatMonthYear(p.valid_until) }}</td>

          <td class="p-2 border text-center">
            <button class="px-2 py-1 bg-yellow-500 text-white rounded" @click="openEditModal(p)">Edit</button>
            <button class="px-2 py-1 bg-red-600 text-white rounded" @click="openDeleteModal(p)">Delete</button>
            <button class="px-2 py-1 bg-indigo-600 text-white rounded" @click="$refs.PeopleForm.exportPersonPDF(p)">PDF</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- PAGINATION -->
    <div class="flex justify-center items-center gap-4 mt-4">
      <button class="px-3 py-1 bg-gray-300 rounded" :disabled="currentPage === 1" @click="goPrevPage">Prev</button>
      <span class="font-semibold">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="px-3 py-1 bg-gray-300 rounded" :disabled="currentPage === totalPages" @click="goNextPage">Next</button>
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

    <PeopleForm ref="PeopleForm" class="hidden" />
  </div>
</template>

<script>
import AddPersonelModal from '~/components/AddPersonelModal.vue'
import DeleteConfirm from '~/components/DeleteConfirm.vue'
import PeopleForm from "~/components/PeopleForm.vue"

export default {
  layout: "admin",

  components: { AddPersonelModal, DeleteConfirm, PeopleForm },

  data() {
    return {
      people: [],
      searchQuery: "",
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,

      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedPerson: null,

      form: {},
      photoFile: null
    }
  },

  async mounted() {
    await this.checkAdmin();
    this.loadPeople();
  },

  methods: {
    /* -------------------------
       ADMIN PROTECTION
    ------------------------- */
    async checkAdmin() {
      const { $supabase } = useNuxtApp();
      const { data } = await $supabase.auth.getSession();

      const verified = localStorage.getItem("admin_verified") === "true";
      const trusted = localStorage.getItem("trusted_device") === "true";
      const temp = sessionStorage.getItem("temporary_trust") === "true";

      if (!data.session || !verified || (!trusted && !temp)) {
        this.$router.push("/login");
      }
    },

    /* -------------------------
       LOAD PEOPLE
    ------------------------- */
    async loadPeople() {
      const from = (this.currentPage - 1) * this.pageSize;
      const to = from + this.pageSize - 1;

      let query = this.$supabase
        .from("people")
        .select("*", { count: "exact" })
        .order("id", { ascending: false })
        .range(from, to);

      if (this.searchQuery.trim() !== "") {
        const s = this.searchQuery.trim();
        query = query.or(
          `first_name.ilike.%${s}%,middle_initial.ilike.%${s}%,last_name.ilike.%${s}%,work_id.ilike.%${s}%,region.ilike.%${s}%,designation.ilike.%${s}%,chapter.ilike.%${s}%`
        );
      }

      const { data, count } = await query;

      this.people = data || [];
      this.totalPages = Math.ceil(count / this.pageSize);
    },

    handleModalSubmit({ form, photoFile }) {
  this.form = form;
  this.photoFile = photoFile;

  if (this.isEditing) {
    this.updatePerson();
  } else {
    this.addPerson();
  }
},


    /* -------------------------
       SEARCH + PAGINATION
    ------------------------- */
    handleSearch() {
      this.currentPage = 1;
      this.loadPeople();
    },

    goPrevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadPeople();
      }
    },

    goNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadPeople();
      }
    },

    /* -------------------------
       PHOTO UPLOAD
    ------------------------- */
    async uploadPhoto() {
      if (!this.photoFile) return this.form.picture_url;

      const safe = this.photoFile.name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");

      const filename = `${Date.now()}_${safe}`;

      const { error } = await this.$supabase.storage
        .from("people_photos")
        .upload(filename, this.photoFile);

      if (error) return this.form.picture_url;

      const { data } = this.$supabase.storage
        .from("people_photos")
        .getPublicUrl(filename);

      return data.publicUrl;
    },

    /* -------------------------
       MODALS
    ------------------------- */
    openAddModal() {
      this.isEditing = false;
      this.selectedPerson = null;

      this.form = {
        first_name: "",
        middle_initial: "",
        last_name: "",
        work_id: "",
        region: "",
        designation: "",
        chapter: "",
        valid_until: "",
        expiry_date: "",
        emergency_name: "",
        emergency_cp: "",
        emergency_address: "",
        picture_url: ""
      };

      this.photoFile = null;
      this.showModal = true;
    },

    openEditModal(person) {
      this.isEditing = true;
      this.selectedPerson = person;
      this.form = { ...person };
      this.photoFile = null;
      this.showModal = true;
    },

    openDeleteModal(person) {
      this.selectedPerson = person;
      this.showDeleteModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.photoFile = null;
    },

    /* -------------------------
       ADD PERSON
    ------------------------- */
    async addPerson() {
      const picture_url = await this.uploadPhoto();

      const { full_name, ...cleanData } = this.form;

      await this.$supabase.from("people").insert([
        { ...cleanData, picture_url }
      ]);

      this.closeModal();
      this.loadPeople();
    },

    /* -------------------------
       UPDATE PERSON
    ------------------------- */
    async updatePerson() {
      const picture_url = await this.uploadPhoto();

      const { full_name, ...cleanData } = this.form;

      await this.$supabase
        .from("people")
        .update({ ...cleanData, picture_url })
        .eq("id", this.selectedPerson.id);

      this.closeModal();
      this.loadPeople();
    },

    /* -------------------------
       DELETE PERSON
    ------------------------- */
    async deletePerson() {
      await this.$supabase
        .from("people")
        .delete()
        .eq("id", this.selectedPerson.id);

      this.showDeleteModal = false;
      this.loadPeople();
    },

    /* -------------------------
       EXPORT
    ------------------------- */
    exportCSV() {
      if (!this.people.length) return;

      let csv = "Full Name,Work ID,Region,Designation,Expiry\n";

      this.people.forEach(p => {
        csv += `${p.last_name}, ${p.first_name} ${p.middle_initial},${p.work_id},${p.region},${p.designation},${p.expiry_date}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const link = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = link;
      a.download = "people.csv";
      a.click();
    },

    exportExcel() {
      let table = `
        <table>
          <tr>
            <th>Name</th><th>Work ID</th><th>Region</th><th>Designation</th><th>Expiry</th>
          </tr>
          ${this.people
            .map(
              p => `
          <tr>
            <td>${p.first_name} ${p.middle_initial}. ${p.last_name}</td>
            <td>${p.work_id}</td>
            <td>${p.region}</td>
            <td>${p.designation}</td>
            <td>${p.expiry_date}</td>
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

    /* -------------------------
       DATE FORMATTING
    ------------------------- */
    formatMonthYear(value) {
      if (!value) return "";
      const d = new Date(value);
      return d.toLocaleString("en-US", { month: "long", year: "numeric" });
    },

    formatFullDate(value) {
      if (!value) return "";
      const d = new Date(value);
      return d.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    }
  }
}
</script>

<script setup>
definePageMeta({
  layout: "admin",
});
</script>
