<template>
  <div class="flex min-h-screen">

    <!-- 🔵 SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN -->
    <main class="flex-1 ml-64 p-6 max-w-5xl">
      <h1 class="text-3xl font-bold mb-6">Announcements</h1>

      

      <!-- SEARCH BAR -->
<!-- TOP BAR (Search + Add Btn) -->
<div class="flex items-center justify-between mb-6">

  <!-- SEARCH BAR -->
  <div class="relative w-80">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search announcements..."
      class="border px-4 py-2 rounded-full w-full pl-10 text-sm"
      @input="currentPage = 1"
    />

    <!-- ICON -->
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      width="20" height="20"
      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      fill="currentColor"
    >
      <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 
        19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 
        2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 
        15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 
        4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 
        15.8748 16.0247L16.0247 15.8748Z"/>
    </svg>
  </div>

  <!-- ADD ANNOUNCEMENT BUTTON -->
  <button
    class="px-4 py-2 bg-purple-600 text-white rounded"
    @click="openAddAnnouncement"
  >
    + Add Announcement
  </button>

</div>



      <!-- FACEBOOK-STYLE FEED WITH ANIMATION -->
      <transition-group
        name="fade"
        tag="div"
        class="space-y-4 max-2-2xl mx-auto"
      >
        <div
          v-for="a in paginatedAnnouncements"
          :key="a.id"
          class="bg-white rounded-lg shadow border p-2 hover:shadow-md transition"
        >

          <!-- HEADER -->
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold text-gray-800">{{ a.title }}</h2>
            <span class="text-xs text-gray-400">
              {{ new Date(a.created_at).toLocaleDateString() }}
            </span>
          </div>

          <!-- IMAGE -->
          <div v-if="a.image_url" class="w-full mb-3">
            <img
              :src="a.image_url"
              class="w-full h-auto rounded-lg object-cover"
            />
          </div>

          <!-- CONTENT -->
          <p class="text-gray-700 whitespace-pre-line leading-relaxed mb-3 break-words">
            {{ a.content }}
          </p>

          <!-- ACTIONS -->
          <div class="flex gap-4 text-sm font-medium text-gray-600">
            
            <!-- EDIT -->
            <button
              class="flex items-center gap-1 hover:text-yellow-600"
              @click="openEditAnnouncement(a)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor">
                <path d="M12.9 6.85L17.14 11.1L7.24 21H3v-4.25L12.9 6.85zm1.41-1.41L16.44 3.32c.39-.39 1.03-.39 1.42 0l2.83 2.83c.39.39.39 1.02 0 1.41L18.56 9.68L14.31 5.44z"/>
              </svg>
              Edit
            </button>

            <!-- DELETE -->
            <button
              class="flex items-center gap-1 hover:text-red-600"
              @click="openDeleteAnnouncement(a)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor">
                <path d="M17 4h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5V2h10v2zM9 9v8h2V9H9zm4 0v8h2V9h-2z"/>
              </svg>
              Delete
            </button>

          </div>

        </div>
      </transition-group>

      <!-- EMPTY STATE -->
      <div v-if="paginatedAnnouncements.length === 0"
           class="text-center py-10 text-gray-500">
        No announcements found.
      </div>

      <!-- PAGINATION -->
      <div class="flex justify-between items-center mt-6">
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <div class="flex gap-2">
          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
                   hover:bg-gray-200 hover:border-gray-400
                   disabled:opacity-50 transition"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Prev
          </button>

          <button
            class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg
                   hover:bg-gray-200 hover:border-gray-400
                   disabled:opacity-50 transition"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>

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

    <!-- GLOBAL LOADING -->
    <LoadingModal :show="loading" :message="loadingMessage" />

  </div>
</template>


<script>
import AdminSideBar from "~/components/Admin/AdminSideBar.vue";
import AnnouncementModal from "~/components/Announcement/AnnouncementModal.vue";
import DeleteAnnouncementModal from "~/components/Announcement/DeleteAnnouncementModal.vue";
import LogoutConfirm from "~/components/Modals/LogoutConfirm.vue";
import LoadingModal from "~/components/Modals/LoadingModal.vue";
import { usePageTitle } from '~/composables/usePageTitle.js'

export default {
  components: {
    AdminSideBar,
    AnnouncementModal,
    DeleteAnnouncementModal,
    LogoutConfirm,
    LoadingModal
  },

  data() {
    return {
      currentPage: 1,
      itemsPerPage: 2,

      supabase: null,
      showLogout: false,
      announcements: [],

      searchQuery: "",

      showAnnouncementModal: false,
      showDeleteAnnouncementModal: false,

      isEditingAnnouncement: false,
      selectedAnnouncement: null,

      announcementForm: { title: "", content: "", image_url: "", image_filename: "" },
      announcementPhotoFile: null,

      loading: false,
      loadingMessage: "Please wait...",
    };
  },

  async mounted() {
    usePageTitle('Admin Announcements')
    this.supabase = useSupabaseClient();
    await this.checkAdmin();
    await this.loadAnnouncements();
  },

  methods: {
    async checkAdmin() {
      const { data } = await this.supabase.auth.getSession();

      const verified = localStorage.getItem("admin_verified") === "true";
      const trusted = localStorage.getItem("trusted_device") === "true";
      const temp = sessionStorage.getItem("temporary_trust") === "true";

      if (!data.session || !verified || (!trusted && !temp)) {
        this.$router.push("/login");
      }
    },

    async loadAnnouncements() {
      try {
        this.loading = true;
        this.loadingMessage = "Loading announcements...";

        const { data, error } = await this.supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error) {
          this.announcements = data || [];
        }
      } finally {
        this.loading = false;
      }
    },

    openAddAnnouncement() {
      this.isEditingAnnouncement = false;
      this.announcementForm = { title: "", content: "", image_url: "", image_filename: "" };
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

    /* ======================
       IMAGE UPLOAD HANDLER
    ====================== */
    async uploadAnnouncementImage() {
      if (!this.announcementPhotoFile) {
        return {
          image_url: this.announcementForm.image_url || "",
          image_filename: this.announcementForm.image_filename || ""
        };
      }

      const extension = this.announcementPhotoFile.name.split(".").pop();
      const filename = `${crypto.randomUUID()}.${extension}`;

      try {
        const { error } = await this.supabase.storage
          .from("announcement_images")
          .upload(filename, this.announcementPhotoFile);

        if (error) throw error;

        const { data: urlData } = this.supabase.storage
          .from("announcement_images")
          .getPublicUrl(filename);

        return {
          image_url: urlData.publicUrl,
          image_filename: filename
        };
      } catch (err) {
        console.error("Upload error:", err);

        return {
          image_url: this.announcementForm.image_url || "",
          image_filename: this.announcementForm.image_filename || ""
        };
      }
    },

    /* ======================
       ADD ANNOUNCEMENT
    ====================== */
    async addAnnouncement() {
      try {
        this.loading = true;

        const uploaded = await this.uploadAnnouncementImage();

        await this.supabase.from("announcements").insert([
          {
            title: this.announcementForm.title,
            content: this.announcementForm.content,
            image_url: uploaded.image_url,
            image_filename: uploaded.image_filename
          }
        ]);

        this.closeAnnouncementModal();
        await this.loadAnnouncements();
      } finally {
        this.loading = false;
      }
    },

    /* ======================
       UPDATE ANNOUNCEMENT
    ====================== */
    async updateAnnouncement() {
      try {
        this.loading = true;

        const before = { ...this.selectedAnnouncement };
        const uploaded = await this.uploadAnnouncementImage();

        if (this.announcementPhotoFile && before.image_filename) {
          await this.deleteImageFromStorage(before.image_filename);
        }

        await this.supabase
          .from("announcements")
          .update({
            title: this.announcementForm.title,
            content: this.announcementForm.content,
            image_url: uploaded.image_url,
            image_filename: uploaded.image_filename
          })
          .eq("id", before.id);

        this.closeAnnouncementModal();
        await this.loadAnnouncements();
      } finally {
        this.loading = false;
      }
    },

    /* ======================
       DELETE ANNOUNCEMENT
    ====================== */
    async deleteAnnouncement() {
      try {
        this.loading = true;

        if (this.selectedAnnouncement.image_filename) {
          await this.deleteImageFromStorage(this.selectedAnnouncement.image_filename);
        }

        await this.supabase
          .from("announcements")
          .delete()
          .eq("id", this.selectedAnnouncement.id);

        this.showDeleteAnnouncementModal = false;
        await this.loadAnnouncements();
      } finally {
        this.loading = false;
      }
    },

    async deleteImageFromStorage(filename) {
      try {
        const { error } = await this.supabase.storage
          .from("announcement_images")
          .remove([filename]);

        if (error) console.warn("Failed to delete image:", filename, error);
      } catch (err) {
        console.error("deleteImageFromStorage error:", err);
      }
    },

    /* ======================
       LOGOUT
    ====================== */
    confirmLogout() {
      this.showLogout = false;
      this.loading = true;
      this.loadingMessage = "Logging out...";

      this.supabase.auth.signOut().finally(() => {
        localStorage.removeItem("admin_verified");
        sessionStorage.removeItem("temporary_trust");

        setTimeout(() => {
          this.loading = false;
          this.$router.push("/login");
        }, 400);
      });
    }
  },
  computed: {
filteredAnnouncements() {
  const q = this.searchQuery.trim().toLowerCase();
  if (!q) return this.announcements;

  return this.announcements.filter(a => {
    const title = (a.title || "").toLowerCase();
    const content = (a.content || "").toLowerCase();

    if (!a.created_at) return title.includes(q) || content.includes(q);

    const dateObj = new Date(a.created_at);

    // Built-in Supabase/ISO date string (YYYY-MM-DD HH:mm:ss)
    const rawDate = a.created_at.toLowerCase();

    // Format: January 12, 2025
    const readableDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).toLowerCase();

    // Format: 12/12/2025 (MM/DD/YYYY)
    const mmddyyyy = (
      ("0" + (dateObj.getMonth() + 1)).slice(0, 2) +
      "/" +
      ("0" + dateObj.getDate()).slice(-2) +
      "/" +
      dateObj.getFullYear()
    ).toLowerCase();

    // Format: 12/12/2025, 3:40 PM
    const readableDateTime = dateObj
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
      })
      .toLowerCase();

    // Time formats
    const time12 = dateObj
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })
      .toLowerCase();

    const time24 = dateObj
      .toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
      .toLowerCase();

    return (
      title.includes(q) ||
      content.includes(q) ||
      rawDate.includes(q) ||
      readableDate.includes(q) ||
      mmddyyyy.includes(q) ||        // 🔥 THIS ENABLES 12/12/2025 SEARCH
      readableDateTime.includes(q) ||
      time12.includes(q) ||
      time24.includes(q)
    );
  });
},

paginatedAnnouncements() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredAnnouncements.slice(start, start + this.itemsPerPage);
},


totalPages() {
  return Math.ceil(this.filteredAnnouncements.length / this.itemsPerPage) || 1;
}


  }
};
</script>

<style scoped>
  .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

</style>
