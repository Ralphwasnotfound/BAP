<template>
  <div class="p-6 max-w-5xl mx-auto">

    <!-- ------------------------- -->
    <!-- LOGIN VIEW -->
    <!-- ------------------------- -->
    <div v-if="!session" class="flex justify-center mt-20">
      <div class="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border rounded px-3 py-2 mb-3"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          @click="login"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p v-if="errorMessage" class="mt-4 text-red-600 text-center">
          {{ errorMessage }}
        </p>
      </div>
    </div>

    <!-- ------------------------- -->
    <!-- ADMIN DASHBOARD -->
    <!-- ------------------------- -->
    <div v-else>

      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Admin Dashboard</h1>

        <button
          class="px-4 py-2 bg-red-600 text-white rounded"
          @click="logout"
        >
          Logout
        </button>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex gap-3 mb-4">
        <button class="px-4 py-2 bg-blue-600 text-white rounded" @click="openAddModal">
          + Add Person
        </button>

        <button class="px-4 py-2 bg-green-600 text-white rounded" @click="exportCSV">
          Export CSV
        </button>

        <button class="px-4 py-2 bg-yellow-500 text-white rounded" @click="exportExcel">
          Export Excel
        </button>

        <button class="px-4 py-2 bg-purple-600 text-white rounded" @click="openAnnouncementModal">
          + Add Announcement
        </button>
      </div>

      <!-- ANNOUNCEMENT MODAL -->
      <AnnouncementModal
        :show="showAnnouncementModal"
        :isEditing="isEditingAnnouncement"
        :form="announcementForm"
        @close="closeAnnouncementModal"
        @submit="handleAnnouncementSubmit"
      />

      <!-- PEOPLE TABLE -->
      <table class="w-full border text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Photo</th>
            <th class="p-2 border">Name</th>
            <th class="p-2 border">Work ID</th>
            <th class="p-2 border">Region</th>
            <th class="p-2 border">Designation</th>
            <th class="p-2 border">Expiry</th>
            <th class="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in people" :key="p.id" class="hover:bg-gray-50">
            <td class="p-2 border text-center">
              <img
                v-if="p.picture_url"
                :src="p.picture_url"
                class="w-10 h-10 rounded-full mx-auto object-cover border"
              />
              <span v-else class="text-gray-500">No Photo</span>
            </td>

            <td class="p-2 border">{{ p.full_name }}</td>
            <td class="p-2 border">{{ p.work_id }}</td>
            <td class="p-2 border">{{ p.region }}</td>
            <td class="p-2 border">{{ p.designation }}</td>
            <td class="p-2 border">{{ p.expiry_date }}</td>

            <td class="p-2 border text-center">
              <button
                class="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                @click="openEditModal(p)"
              >
                Edit
              </button>

              <button
                class="px-2 py-1 bg-red-600 text-white rounded"
                @click="openDeleteModal(p)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PERSON MODALS -->
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

    </div>
  </div>
</template>

<script>
import AddPersonelModal from '~/components/AddPersonelModal.vue';
import DeleteConfirm from '~/components/DeleteConfirm.vue';
import AnnouncementModal from '~/components/Announcement/AnnouncementModal.vue';

export default {
  components: {
    AnnouncementModal,
    AddPersonelModal,
    DeleteConfirm
  },

  data() {
    return {
      /* ANNOUNCEMENTS */
      showAnnouncementModal: false,
      isEditingAnnouncement: false,
      announcementForm: {
        title: "",
        content: "",
        image_url: ""
      },
      announcementPhotoFile: null,

      /* AUTH */
      email: "",
      password: "",
      errorMessage: "",
      session: null,

      /* PEOPLE */
      people: [],
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedPerson: null,

      form: {
        full_name: "",
        work_id: "",
        region: "",
        designation: "",
        chapter: "",
        valid_until: "",
        expiry_date: "",
        picture_url: ""
      },

      photoFile: null
    };
  },

  async mounted() {
    const { $supabase } = useNuxtApp();
    this.$supabase = $supabase;

    const { data } = await this.$supabase.auth.getSession();
    this.session = data.session;

    this.loadPeople();
  },

  methods: {
    /* ------------------------------  
       ANNOUNCEMENTS  
    ------------------------------ */
    openAnnouncementModal() {
      this.isEditingAnnouncement = false;
      this.announcementForm = { title: "", content: "", image_url: "" };
      this.announcementPhotoFile = null;
      this.showAnnouncementModal = true;
    },

    closeAnnouncementModal() {
      this.showAnnouncementModal = false;
    },

    async uploadAnnouncementImage() {
      if (!this.announcementPhotoFile) return null;

      const safeName = this.announcementPhotoFile.name
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "");

      const fileName = `${Date.now()}-${safeName}`;

      const { error } = await this.$supabase.storage
        .from("announcement_images")
        .upload(fileName, this.announcementPhotoFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: this.announcementPhotoFile.type
        });

      if (error) return null;

      const { data: urlData } = this.$supabase.storage
        .from("announcement_images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    },

    async addAnnouncement() {
      const imageUrl = await this.uploadAnnouncementImage();

      const payload = {
        ...this.announcementForm,
        image_url: imageUrl || null
      };

      await this.$supabase.from("announcements").insert([payload]);
      this.closeAnnouncementModal();
    },

    async handleAnnouncementSubmit({ form, photoFile }) {
      this.announcementForm = form;
      this.announcementPhotoFile = photoFile;

      if (this.isEditingAnnouncement) {
        // (Edit coming soon)
      } else {
        await this.addAnnouncement();
      }
    },

    /* ------------------------------  
       AUTH  
    ------------------------------ */
    async login() {
      this.errorMessage = "";

      const { data, error } = await this.$supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });

      if (error) {
        this.errorMessage = "Invalid login credentials";
        return;
      }

      this.session = data.session;
    },

    async logout() {
      await this.$supabase.auth.signOut();
      this.session = null;
    },

    /* ------------------------------  
       PEOPLE CRUD  
    ------------------------------ */
    async loadPeople() {
      const { data } = await this.$supabase.from("people").select("*");
      this.people = data || [];
    },

    openAddModal() {
      this.isEditing = false;
      this.resetForm();
      this.showModal = true;
    },

    openEditModal(person) {
      this.isEditing = true;
      this.form = { ...person };
      this.selectedPerson = person;
      this.showModal = true;
    },

    openDeleteModal(person) {
      this.selectedPerson = person;
      this.showDeleteModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    resetForm() {
      this.form = {
        full_name: "",
        work_id: "",
        region: "",
        designation: "",
        chapter: "",
        valid_until: "",
        expiry_date: "",
        picture_url: ""
      };
      this.photoFile = null;
    },

    /* PHOTO UPLOAD */
    handlePhoto(e) {
      this.photoFile = e.target.files[0];
    },

    async uploadPhoto() {
      if (!this.photoFile) return null;

      const safeName = this.photoFile.name
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "");

      const fileName = `${Date.now()}-${safeName}`;

      const { error } = await this.$supabase.storage
        .from("people_photos")
        .upload(fileName, this.photoFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: this.photoFile.type
        });

      if (error) return null;

      const { data: urlData } = this.$supabase.storage
        .from("people_photos")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    },

    /* CREATE PERSON */
    async addPerson() {
      const photoUrl = await this.uploadPhoto();

      const payload = {
        ...this.form,
        expiry_date: this.form.expiry_date || null,
        valid_until: this.form.valid_until || null,
        picture_url: photoUrl || this.form.picture_url
      };

      await this.$supabase.from("people").insert([payload]);

      this.closeModal();
      this.loadPeople();
    },

    /* UPDATE PERSON */
    async updatePerson() {
      const photoUrl = await this.uploadPhoto();

      const payload = {
        ...this.form,
        expiry_date: this.form.expiry_date || null,
        valid_until: this.form.valid_until || null,
        picture_url: photoUrl || this.form.picture_url
      };

      await this.$supabase
        .from("people")
        .update(payload)
        .eq("id", this.selectedPerson.id);

      this.closeModal();
      this.loadPeople();
    },

    /* DELETE PERSON */
    async deletePerson() {
      await this.$supabase.from("people").delete().eq("id", this.selectedPerson.id);
      this.showDeleteModal = false;
      this.loadPeople();
    },

    /* EXPORT CSV */
    exportCSV() {
      if (!this.people.length) return;

      let csv = "Full Name,Work ID,Region,Designation,Expiry Date\n";

      this.people.forEach(p => {
        csv += `${p.full_name},${p.work_id},${p.region},${p.designation},${p.expiry_date}\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = link;
      a.download = "people.csv";
      a.click();
    },

    /* EXPORT EXCEL */
    exportExcel() {
      let table = `<table>
        <tr>
          <th>Full Name</th><th>Work ID</th><th>Region</th><th>Designation</th><th>Expiry Date</th>
        </tr>
        ${this.people
          .map(
            p => `
          <tr>
            <td>${p.full_name}</td>
            <td>${p.work_id}</td>
            <td>${p.region}</td>
            <td>${p.designation}</td>
            <td>${p.expiry_date}</td>
          </tr>`
          )
          .join("")}
      </table>`;

      const blob = new Blob([table], {
        type: "application/vnd.ms-excel"
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "people.xls";
      a.click();
    },

    /* HANDLE PERSON SUBMIT */
    async handleModalSubmit({ form, photoFile }) {
      this.form = form;
      this.photoFile = photoFile;

      if (this.isEditing) {
        await this.updatePerson();
      } else {
        await this.addPerson();
      }
    }
  }
};
</script>
