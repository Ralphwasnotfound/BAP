<template>
  <div class="flex min-h-screen">

    <!-- 🔵 SIDEBAR (always visible) -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN CONTENT -->
    <main class="flex-1 ml-64 p-6 max-w-5xl">
      <h1 class="text-3xl font-bold mb-6">Announcements</h1>

      <!-- ACTION BUTTON -->
      <button
        class="px-4 py-2 bg-purple-600 text-white rounded mb-4"
        @click="openAddAnnouncement"
      >
        + Add Announcement
      </button>

      <!-- TABLE -->
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
              <img
                v-if="a.image_url"
                :src="a.image_url"
                class="w-12 h-12 object-cover rounded mx-auto"
              />
              <span v-else>No Image</span>
            </td>

            <td class="p-2 border">{{ a.title }}</td>
            <td class="p-2 border">{{ a.content }}</td>

            <td class="p-2 border text-center">
              <button
                class="px-2 py-1 bg-yellow-500 text-white rounded"
                @click="openEditAnnouncement(a)"
              >
                Edit
              </button>
              <button
                class="px-2 py-1 bg-red-600 text-white rounded"
                @click="openDeleteAnnouncement(a)"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="announcements.length === 0">
            <td colspan="4" class="text-center p-4">No announcements yet.</td>
          </tr>
        </tbody>
      </table>

      <!-- MODALS -->
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

      <LogoutConfirm
        :show="showLogout"
        @close="showLogout = false"
        @confirm="confirmLogout"
      />
    </main>

  </div>
</template>

<script>
import AdminSideBar from "~/components/Admin/AdminSideBar.vue";
import AnnouncementModal from "~/components/Announcement/AnnouncementModal.vue";
import DeleteAnnouncementModal from "~/components/Announcement/DeleteAnnouncementModal.vue";
import LogoutConfirm from "~/components/LogoutConfirm.vue";

export default {
  components: {
    AdminSideBar,
    AnnouncementModal,
    DeleteAnnouncementModal,
    LogoutConfirm
  },

  data() {
    return {
      showLogout: false,
      announcements: [],

      showAnnouncementModal: false,
      showDeleteAnnouncementModal: false,

      isEditingAnnouncement: false,
      selectedAnnouncement: null,

      announcementForm: { title: "", content: "", image_url: "" },
      announcementPhotoFile: null,
    };
  },

  async mounted() {
    await this.checkAdmin();
    this.loadAnnouncements();
  },

  methods: {
    /* ------------------ SECURITY ------------------ */
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

    /* ------------------ LOAD ------------------ */
    async loadAnnouncements() {
      const { data } = await this.$supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      this.announcements = data || [];
    },

    /* ------------------ MODALS ------------------ */
    openAddAnnouncement() {
      this.isEditingAnnouncement = false;
      this.announcementForm = { title: "", content: "", image_url: "" };
      this.announcementPhotoFile = null;
      this.showAnnouncementModal = true;
    },

    openEditAnnouncement(a) {
      this.isEditingAnnouncement = true;
      this.announcementForm = { ...a };
      this.selectedAnnouncement = a;
      this.announcementPhotoFile = null;
      this.showAnnouncementModal = true;
    },

    openDeleteAnnouncement(a) {
      this.selectedAnnouncement = a;
      this.showDeleteAnnouncementModal = true;
    },

    closeAnnouncementModal() {
      this.showAnnouncementModal = false;
    },

    handleAnnouncementSubmit({ form, photoFile }) {
      this.announcementForm = form;
      this.announcementPhotoFile = photoFile;

      if (this.isEditingAnnouncement) this.updateAnnouncement();
      else this.addAnnouncement();
    },

    /* ------------------ IMAGE UPLOAD ------------------ */
    async uploadAnnouncementImage() {
      if (!this.announcementPhotoFile) return this.announcementForm.image_url;

      const safe = this.announcementPhotoFile.name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");

      const filename = `${Date.now()}_${safe}`;

      const { error } = await this.$supabase.storage
        .from("announcement_images")
        .upload(filename, this.announcementPhotoFile);

      if (error) return this.announcementForm.image_url;

      const { data } = this.$supabase.storage
        .from("announcement_images")
        .getPublicUrl(filename);

      return data.publicUrl;
    },

    /* ------------------ CRUD ------------------ */
    async addAnnouncement() {
      const image_url = await this.uploadAnnouncementImage();

      await this.$supabase.from("announcements").insert([
        { ...this.announcementForm, image_url },
      ]);

      this.closeAnnouncementModal();
      this.loadAnnouncements();
    },

    async updateAnnouncement() {
      const image_url = await this.uploadAnnouncementImage();

      await this.$supabase
        .from("announcements")
        .update({ ...this.announcementForm, image_url })
        .eq("id", this.selectedAnnouncement.id);

      this.closeAnnouncementModal();
      this.loadAnnouncements();
    },

    async deleteAnnouncement() {
      await this.$supabase
        .from("announcements")
        .delete()
        .eq("id", this.selectedAnnouncement.id);

      this.showDeleteAnnouncementModal = false;
      this.loadAnnouncements();
    },
    confirmLogout() {
      this.showLogout = false;
      const { $supabase } = useNuxtApp()
      $supabase.auth.signOut()

      localStorage.removeItem("admin_verified");
      sessionStorage.removeItem("temporary_trust");

      this.$router.push("/login");
    },
  },
};
</script>
