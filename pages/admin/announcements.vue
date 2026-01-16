<template>
  <div class="flex min-h-screen bg-gray-100 md:py-0 py-10">

    <!-- 🔵 SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN -->
    <main
      class="
        flex-1
        p-4 sm:p-6
        md:ml-64
        max-w-5xl
        w-full
      "
    >
      <!-- TITLE -->
      <h1 class="text-2xl sm:text-3xl font-bold mb-6">
        Announcements
      </h1>

      <!-- TOP BAR -->
      <div
        class="
          flex flex-col sm:flex-row
          sm:items-center sm:justify-between
          gap-3
          mb-6
        "
      >
        <!-- SEARCH -->
        <div class="relative w-full sm:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search announcements..."
            class="
              border px-4 py-2 rounded-full
              w-full pl-10 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
            @input="currentPage = 1"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            fill="currentColor"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 
              19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 
              2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168Z"/>
          </svg>
        </div>

        <!-- ADD BUTTON -->
        <button
          class="
            w-full sm:w-auto
            px-4 py-2
            bg-[#0f3975] text-white
            rounded-lg
            hover:bg-blue-700
            transition
          "
          @click="openAddAnnouncement"
        >
          + Add Announcement
        </button>
      </div>

      <!-- FEED -->
      <transition-group
        name="fade"
        tag="div"
        class="space-y-4"
      >
        <div
          v-for="a in paginatedAnnouncements"
          :key="a.id"
          class="
            bg-white rounded-lg shadow
            border p-3 sm:p-4
            hover:shadow-md transition
          "
        >
          <!-- HEADER -->
          <div
            class="
              flex flex-col sm:flex-row
              sm:items-center sm:justify-between
              gap-1 mb-3
            "
          >
            <h2 class="text-base sm:text-lg font-semibold text-gray-800">
              {{ a.title }}
            </h2>

            <span class="text-xs text-gray-400">
              {{ new Date(a.created_at).toLocaleDateString() }}
            </span>
          </div>

          <!-- IMAGE -->
          <div v-if="a.image_url" class="w-full mb-3">
            <img
              :src="a.image_url"
              class="w-full max-h-[420px] object-cover rounded-lg"
            />
          </div>

          <!-- CONTENT -->
          <p
            class="
              text-gray-700 text-sm sm:text-base
              whitespace-pre-line
              leading-relaxed
              break-words
              mb-3
            "
          >
            {{ a.content }}
          </p>

          <!-- ACTIONS -->
          <div
            class="
              flex flex-wrap gap-4
              text-sm font-medium text-gray-600
            "
          >
            <button
              class="flex items-center gap-1 hover:text-yellow-600"
              @click="openEditAnnouncement(a)"
            >
              <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="24" 
              height="24"
              class="fill-current transition group-hover:text-yellow-600" 
              fill="rgba(173,184,194,1)"><path d="M12.8995 6.85453L17.1421 11.0972L7.24264 20.9967H3V16.754L12.8995 6.85453ZM14.3137 5.44032L16.435 3.319C16.8256 2.92848 17.4587 2.92848 17.8492 3.319L20.6777 6.14743C21.0682 6.53795 21.0682 7.17112 20.6777 7.56164L18.5563 9.68296L14.3137 5.44032Z"></path></svg> Edit
            </button>

            <button
              class="flex items-center gap-1 hover:text-red-600"
              @click="openDeleteAnnouncement(a)"
            >
              <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              width="24" 
              height="24"
              class="fill-current transition group-hover:text-red-600"
              fill="rgba(173,184,194,1)"><path d="M17 4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7V2H17V4ZM9 9V17H11V9H9ZM13 9V17H15V9H13Z"></path></svg> Delete
            </button>
          </div>
        </div>
      </transition-group>

      <!-- EMPTY STATE -->
      <div
        v-if="paginatedAnnouncements.length === 0"
        class="text-center py-12 text-gray-500"
      >
        No announcements found.
      </div>

      <!-- PAGINATION -->
      <div
        class="
          flex flex-col sm:flex-row
          sm:items-center sm:justify-between
          gap-3
          mt-6
        "
      >
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <div class="flex gap-2">
          <button
            class="
              px-4 py-2 rounded-lg
              bg-gray-100 border
              hover:bg-gray-200
              disabled:opacity-50
            "
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Prev
          </button>

          <button
            class="
              px-4 py-2 rounded-lg
              bg-gray-100 border
              hover:bg-gray-200
              disabled:opacity-50
            "
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>

      <!-- MODALS (UNCHANGED) -->
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
    async logAnnouncement(action, description, announcementId = null, metadata = {}) {
  try {
    // ensure metadata is safe JSON
    const safeMetadata = JSON.parse(JSON.stringify(metadata))

    await this.logActivity(
      action,
      description,
      null,
      {
        announcement_id: announcementId,
        ...safeMetadata
      }
    )
  } catch (err) {
    console.warn("Announcement activity log skipped:", err)
  }
},

async logActivity(action, description, entityId = null, metadata = {}) {
  const { data: sessionData } = await this.supabase.auth.getSession()
  const adminId = sessionData?.session?.user?.id || null

  const { error } = await this.supabase
    .from("activity_logs")
    .insert([{
      action,
      description,
      person_id: entityId,
      admin_id: adminId,
      metadata: JSON.parse(JSON.stringify(metadata)),
      created_at: new Date().toISOString()
    }])

  if (error) console.error("Activity log failed:", error)
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

        this.logAnnouncement(
  "addAnnouncement",
  "Added an announcement",
  null,
  {
    title: this.announcementForm.title
  }
);


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

    const { error } = await this.supabase
      .from("announcements")
      .update({
        title: this.announcementForm.title,
        content: this.announcementForm.content,
        image_url: uploaded.image_url,
        image_filename: uploaded.image_filename
      })
      .eq("id", before.id);

    // ❌ STOP if update failed
    if (error) {
      console.error("Update announcement failed:", error);
      return;
    }

    // ✅ LOG ONLY AFTER SUCCESS
    await this.logAnnouncement(
      "updatedAnnouncement",
      "Updated an announcement",
      before.id,
      {
        before: {
          title: before.title,
          content: before.content
        },
        after: {
          title: this.announcementForm.title,
          content: this.announcementForm.content
        }
      }
    );

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
      await this.deleteImageFromStorage(
        this.selectedAnnouncement.image_filename
      );
    }

    const { error } = await this.supabase
      .from("announcements")
      .delete()
      .eq("id", this.selectedAnnouncement.id);

    // ❌ STOP if delete failed
    if (error) {
      console.error("Delete announcement failed:", error);
      return;
    }

    // ✅ LOG ONLY AFTER SUCCESS
    await this.logAnnouncement(
      "deletedAnnouncement",
      "Deleted an announcement",
      this.selectedAnnouncement.id,
      {
        title: this.selectedAnnouncement.title
      }
    );

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
    async confirmLogout() {
      this.showLogout = false;
      this.loading = true;
      this.loadingMessage = "Logging out...";

      await this.logAdminLogout();

      this.supabase.auth.signOut().finally(() => {
        localStorage.removeItem("admin_verified");
        sessionStorage.removeItem("temporary_trust");

        setTimeout(() => {
          this.loading = false;
          this.$router.push("/login");
        }, 400);
      });
    },
    async logAdminLogout() {
  try {
    const { data } = await this.supabase.auth.getSession()
    const user = data?.session?.user
    if (!user) return

    await this.supabase.from("activity_logs").insert([{
      action: "adminLogout",
      description: "Admin logged out",
      person_id: null,        // ✅ IMPORTANT
      admin_id: user.id,
      metadata: {
        email: user.email
      },
      created_at: new Date().toISOString()
    }])
  } catch (err) {
    console.warn("Logout log skipped:", err)
  }
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
