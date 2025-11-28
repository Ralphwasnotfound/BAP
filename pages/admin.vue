<template>
  <div class="p-6 max-w-5xl mx-auto">

    <!-- LOGIN -->
    <div v-if="!session" class="flex justify-center mt-20">
      <div class="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <input v-model="email" type="email" placeholder="Email"
          class="w-full border rounded px-3 py-2 mb-3" />

        <input v-model="password" type="password" placeholder="Password"
          class="w-full border rounded px-3 py-2 mb-4" />

        <button @click="login"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>

        <p v-if="errorMessage" class="mt-4 text-red-600 text-center">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- DASHBOARD -->
    <div v-else>

      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Admin Dashboard</h1>

        <button class="px-4 py-2 bg-red-600 text-white rounded" @click="logout">
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

      <!-- ANNOUNCEMENT MODALS -->
      <AnnouncementModal
        :show="showAnnouncementModal"
        :isEditing="isEditingAnnouncement"
        :form="announcementForm"
        @close="closeAnnouncementModal"
        @submit="handleAnnouncementSubmit"
      />

      <DeleteAnnouncementModal
        :show="showDeleteAnnouncementModal"
        :announcement="selectedAnnouncement"
        @close="showDeleteAnnouncementModal = false"
        @confirm="deleteAnnouncement"
      />

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
            <th class="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in people" :key="p.id">
            <td class="p-2 border text-center">
              <img v-if="p.picture_url" :src="p.picture_url"
                class="w-10 h-10 rounded-full object-cover mx-auto" />
              <span v-else>No Photo</span>
            </td>

            <td class="p-2 border">{{ p.full_name }}</td>
            <td class="p-2 border">{{ p.work_id }}</td>
            <td class="p-2 border">{{ p.region }}</td>
            <td class="p-2 border">{{ p.designation }}</td>
            <td class="p-2 border">{{ p.chapter }}</td>
            <td class="p-2 border">{{ p.expiry_date }}</td>

            <td class="p-2 border text-center">
              <button class="px-2 py-1 bg-yellow-500 text-white mr-2 rounded"
                @click="openEditModal(p)">Edit</button>

              <button class="px-2 py-1 bg-red-600 text-white rounded"
                @click="openDeleteModal(p)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ANNOUNCEMENT LIST -->
      <h2 class="text-2xl font-bold mt-10 mb-4">Announcements</h2>

      <table class="w-full border text-left mb-6">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 border">Image</th>
            <th class="p-2 border">Title</th>
            <th class="p-2 border">Content</th>
            <th class="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="a in announcements" :key="a.id">
            <td class="p-2 border text-center">
              <img v-if="a.image_url" :src="a.image_url" class="w-12 h-12 object-cover rounded mx-auto" />
              <span v-else>No Image</span>
            </td>

            <td class="p-2 border">{{ a.title }}</td>
            <td class="p-2 border">{{ a.content }}</td>

            <td class="p-2 border text-center">
              <button class="px-2 py-1 bg-yellow-500 text-white mr-2 rounded"
                @click="openEditAnnouncement(a)">Edit</button>

              <button class="px-2 py-1 bg-red-600 text-white rounded"
                @click="openDeleteAnnouncement(a)">Delete</button>
            </td>
          </tr>

          <tr v-if="announcements.length === 0">
            <td colspan="4" class="text-center p-4">No announcements yet.</td>
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
import AddPersonelModal from '~/components/AddPersonelModal.vue'
import DeleteConfirm from '~/components/DeleteConfirm.vue'
import AnnouncementModal from '~/components/Announcement/AnnouncementModal.vue'
import DeleteAnnouncementModal from '~/components/Announcement/DeleteAnnouncementModal.vue'

export default {
  head() {
    return {
      title: "BAP Federation - Admin",
    }
  },

  components: {
    AnnouncementModal,
    DeleteAnnouncementModal,
    AddPersonelModal,
    DeleteConfirm
  },

  data() {
    return {
      announcements: [],

      /* ANNOUNCEMENT */
      showAnnouncementModal: false,
      showDeleteAnnouncementModal: false,
      isEditingAnnouncement: false,
      selectedAnnouncement: null,
      announcementForm: { title: "", content: "", image_url: "" },
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
    }
  },

  async mounted() {
    const { $supabase } = useNuxtApp()
    this.$supabase = $supabase

    const { data } = await this.$supabase.auth.getSession()
    this.session = data.session

    this.loadPeople()
    this.loadAnnouncements()
  },

  methods: {
    /* ------------------------------
       PEOPLE CRUD
    ------------------------------ */

    async loadPeople() {
      const { data, error } = await this.$supabase
        .from("people")
        .select("*")
        .order("id", { ascending: false })

      if (!error) this.people = data
    },

    handleModalSubmit({ form, photoFile }) {
      this.form = form
      this.photoFile = photoFile

      if (this.isEditing) {
        this.updatePerson()
      } else {
        this.addPerson()
      }
    },

    openAddModal() {
      this.isEditing = false
      this.selectedPerson = null

      this.form = {
        full_name: "",
        work_id: "",
        region: "",
        designation: "",
        chapter: "",
        valid_until: "",
        expiry_date: "",
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

    async uploadPhoto() {
      if (!this.photoFile) return this.form.picture_url

      const safe = this.photoFile.name.replace(/\s+/g, "_")
      const filename = `${Date.now()}_${safe}`

      const { error } = await this.$supabase.storage
        .from("people_photos")
        .upload(filename, this.photoFile)

      if (error) return this.form.picture_url

      const { data } = this.$supabase.storage
        .from("people_photos")
        .getPublicUrl(filename)

      return data.publicUrl
    },

    async addPerson() {
      const picture_url = await this.uploadPhoto()

      await this.$supabase.from("people").insert([
        { ...this.form, picture_url }
      ])

      this.closeModal()
      this.loadPeople()
    },

    async updatePerson() {
      const picture_url = await this.uploadPhoto()

      await this.$supabase
        .from("people")
        .update({ ...this.form, picture_url })
        .eq("id", this.selectedPerson.id)

      this.closeModal()
      this.loadPeople()
    },

    async deletePerson() {
      await this.$supabase.from("people").delete().eq("id", this.selectedPerson.id)
      this.showDeleteModal = false
      this.loadPeople()
    },

    closeModal() {
      this.showModal = false
      this.photoFile = null
    },

    /* ------------------------------
       ANNOUNCEMENTS CRUD
    ------------------------------ */

    async loadAnnouncements() {
      const { data } = await this.$supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })

      this.announcements = data || []
    },

    openAnnouncementModal() {
      this.isEditingAnnouncement = false
      this.announcementForm = { title: "", content: "", image_url: "" }
      this.announcementPhotoFile = null
      this.showAnnouncementModal = true
    },

    openEditAnnouncement(a) {
      this.isEditingAnnouncement = true
      this.selectedAnnouncement = a
      this.announcementForm = { ...a }
      this.announcementPhotoFile = null
      this.showAnnouncementModal = true
    },

    openDeleteAnnouncement(a) {
      this.selectedAnnouncement = a
      this.showDeleteAnnouncementModal = true
    },

    openDeleteModal(person) {
  this.selectedPerson = person
  this.showDeleteModal = true
},


    closeAnnouncementModal() {
      this.showAnnouncementModal = false
    },

    async uploadAnnouncementImage() {
      if (!this.announcementPhotoFile) return this.announcementForm.image_url

      const safe = this.announcementPhotoFile.name.replace(/\s+/g, "_")
      const filename = `${Date.now()}_${safe}`

      const { error } = await this.$supabase.storage
        .from("announcement_images")
        .upload(filename, this.announcementPhotoFile)

      if (error) return this.announcementForm.image_url

      const { data } = this.$supabase.storage
        .from("announcement_images")
        .getPublicUrl(filename)

      return data.publicUrl
    },

    async addAnnouncement() {
      const image_url = await this.uploadAnnouncementImage()

      await this.$supabase.from("announcements").insert([
        { ...this.announcementForm, image_url }
      ])

      this.closeAnnouncementModal()
      this.loadAnnouncements()
    },

    async updateAnnouncement() {
      const image_url = await this.uploadAnnouncementImage()

      await this.$supabase
        .from("announcements")
        .update({ ...this.announcementForm, image_url })
        .eq("id", this.selectedAnnouncement.id)

      this.closeAnnouncementModal()
      this.loadAnnouncements()
    },

    async deleteAnnouncement() {
      await this.$supabase.from("announcements").delete().eq("id", this.selectedAnnouncement.id)
      this.showDeleteAnnouncementModal = false
      this.loadAnnouncements()
    },

    handleAnnouncementSubmit({ form, photoFile }) {
      this.announcementForm = form
      this.announcementPhotoFile = photoFile

      if (this.isEditingAnnouncement) this.updateAnnouncement()
      else this.addAnnouncement()
    },

    /* ------------------------------
       EXPORT
    ------------------------------ */

    exportCSV() {
      if (!this.people.length) return

      let csv = "Full Name,Work ID,Region,Designation,Expiry\n"

      this.people.forEach(p => {
        csv += `${p.full_name},${p.work_id},${p.region},${p.designation},${p.expiry_date}\n`
      })

      const blob = new Blob([csv], { type: "text/csv" })
      const link = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = link
      a.download = "people.csv"
      a.click()
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
          <td>${p.full_name}</td>
          <td>${p.work_id}</td>
          <td>${p.region}</td>
          <td>${p.designation}</td>
          <td>${p.expiry_date}</td>
        </tr>`
          )
          .join("")}
      </table>`

      const blob = new Blob([table], { type: "application/vnd.ms-excel" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "people.xls"
      a.click()
    },

    /* ------------------------------
       AUTH
    ------------------------------ */

    async login() {
      this.errorMessage = ""

      const { data, error } = await this.$supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      })

      if (error) {
        this.errorMessage = "Invalid login credentials"
        return
      }

      this.session = data.session
    },

    async logout() {
      await this.$supabase.auth.signOut()
      this.session = null
    }
  }
}
</script>
