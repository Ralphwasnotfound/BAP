<template>
  <div class="flex min-h-screen py-10 md:py-0">

    <!-- SIDEBAR -->
    <AdminSideBar @logout="showLogout = true" />

    <!-- MAIN -->
    <main class="flex-1 p-4 sm:p-6 max-w-full md:ml-64">
      <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">People Directory</h1>

      <!-- ACTIONS -->
      <div class="flex flex-wrap gap-3 mb-4">
      
        <!-- Add Person -->
        <button
          class="btn-primary w-full sm:w-auto"
          @click="openAddModal"
        >
          + Add Person
        </button>

        <!-- EXPORT / IMPORT GROUP -->
        <div class="bg-gray-400 md:bg-transparent rounded p-2 text-white w-full sm:w-auto">

        <!-- MOBILE TOGGLE BUTTON -->
        <button
          class="sm:hidden w-full btn-gray flex items-center justify-between"
          @click="showExportMenu = !showExportMenu"
        >
          <span>Exports & Import</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            :class="{ 'rotate-180': showExportMenu }"
            class="transition-transform"
            viewBox="0 0 24 24"
          >
            <path d="M12 15l-6-6h12z"/>
          </svg>
        </button>

      <!-- BUTTONS -->
          <div
            class="
              mt-2
              space-y-2
              sm:mt-0
              sm:space-y-0
              sm:flex
              sm:gap-3
            "
            :class="{
              'hidden': !showExportMenu,
              'block': showExportMenu,
              'sm:block': true
            }"
          >
          
            <!-- Export CSV -->
            <button
              class="btn-green flex items-center gap-2 w-full sm:w-auto"
              @click="exportCSV"
              :class="{ 'btn-disabled': downloadCSVLock }"
              :disabled="downloadCSVLock"
            >
              <!-- icon -->
              Export CSV
            </button>
          
            <!-- Export Excel -->
            <button
              class="btn-yellow flex items-center gap-2 w-full sm:w-auto"
              @click="exportExcel"
              :class="{ 'btn-disabled': downloadExcelLock }"
              :disabled="downloadExcelLock"
            >
              Export Excel
            </button>
          
            <!-- Import CSV -->
            <button
              class="btn-purple flex items-center gap-2 w-full sm:w-auto"
              @click="showImportModal = true"
            >
              Import CSV
            </button>
          
          </div>
        </div>
      </div>


      <!-- SEARCH -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="relative mb-4">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search people..."
            class="border px-4 py-2 rounded-full w-full md:w-64 pr-10"  
          />

          <!-- ICON INSIDE INPUT -->
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24" 
            width="18" 
            height="18"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            fill="rgba(173,184,194,1)"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"/>
          </svg>
        </div>
        <!-- SHOW ONLY WHEN SEARCHING AND RESULTS > 0 -->
        <div
            v-if="searchQuery.trim() && people.length > 0"
            class="px-3 py-1 bg-gray-100 border rounded-full text-sm text-gray-400 mt-2"
          >
            <span class="font-semibold">{{ people.length }}</span>
            {{ people.length === 1 ? 'Item' : 'Items' }}
        </div>

      <!-- Bulk Delete -->
        <div class="flex flex-row gap-2 items-center ">
          <button
            v-if="bulkMode && selectedRows.length > 0"
            class="btn-red flex items-center gap-2 w-full sm:w-auto"
            :disabled="selectedRows.length === 0"
            @click="openBulkDeleteModal"
          >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path></svg>
            Delete Selected ({{ selectedRows.length }})
          </button>
        
          <button 
            v-if="bulkMode"
            class="px-4 py-2 bg-gray-500 text-white flex items-center gap-2 rounded"
            @click="cancelBulkMode"
          >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"></path></svg>
            Cancel
          </button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="relative overflow-x-auto bg-white shadow rounded-lg border">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 border-b">
            <tr class="text-[11px] sm:text-xs md:text-sm">
              <!-- BULK DELETE / SELECT ALL COLUMN -->
              <th 
                class="p-2 border text-center w-[50px]"
              >
                <!-- Trash icon when NOT in bulk mode -->
                <button 
                  v-if="!bulkMode"
                  @click="bulkMode = true"
                  class="mx-auto block"
                  title="Enable Bulk Delete Mode"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,5,5,1)">
                    <path d="M14 14.252V22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM23 18V20H15V18H23Z"></path>
                  </svg>
                </button>
              
                <!-- Select all checkbox -->
                <input 
                  v-else 
                  type="checkbox" 
                  v-model="selectAll" 
                  @change="toggleSelectAll"
                  class="mx-auto block"
                />
              </th>
            
              <th class="p-2 border">Photo</th>
              <th class="p-2 border">Name</th>
              <th class="p-2 border">ID No.</th>
              <th class="p-2 border">Region</th>
              <th class="p-2 border">Designation</th>
              <th class="p-2 border">Chapter</th>
              <th class="p-2 border">Valid Until</th>
            
              <!-- Actions Column -->
              <th class="p-2 border text-center w-[70px]">
                <div class="inline-flex items-center justify-center text-gray-500" title="Actions">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="rgba(116,126,134,1)" viewBox="0 0 24 24">
                    <path d="M5.33409 4.54491C6.3494 3.63637 7.55145 2.9322 8.87555 2.49707C9.60856 3.4128 10.7358 3.99928 12 3.99928C13.2642 3.99928 14.3914 3.4128 15.1245 2.49707C16.4486 2.9322 17.6506 3.63637 18.6659 4.54491C18.2405 5.637 18.2966 6.90531 18.9282 7.99928C19.5602 9.09388 20.6314 9.77679 21.7906 9.95392C21.9279 10.6142 22 11.2983 22 11.9993C22 12.7002 21.9279 13.3844 21.7906 14.0446C20.6314 14.2218 19.5602 14.9047 18.9282 15.9993C18.2966 17.0932 18.2405 18.3616 18.6659 19.4536C17.6506 20.3622 16.4486 21.0664 15.1245 21.5015C14.3914 20.5858 13.2642 19.9993 12 19.9993C10.7358 19.9993 9.60856 20.5858 8.87555 21.5015C7.55145 21.0664 6.3494 20.3622 5.33409 19.4536C5.75952 18.3616 5.7034 17.0932 5.0718 15.9993C4.43983 14.9047 3.36862 14.2218 2.20935 14.0446C2.07212 13.3844 2 12.7002 2 11.9993C2 11.2983 2.07212 10.6142 2.20935 9.95392C3.36862 9.77679 4.43983 9.09388 5.0718 7.99928C5.7034 6.90531 5.75952 5.637 5.33409 4.54491ZM13.5 14.5974C14.9349 13.7689 15.4265 11.9342 14.5981 10.4993C13.7696 9.0644 11.9349 8.57277 10.5 9.4012C9.06512 10.2296 8.5735 12.0644 9.40192 13.4993C10.2304 14.9342 12.0651 15.4258 13.5 14.5974Z"/>
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
        
          <tbody :key="currentPage">
            <transition-group name="tableFade" as="template" >
            <tr 
              v-for="p in people" 
              :key="p.id"
              @click="openPersonCard(p)"
              class="cursor-pointer hover:bg-gray-50 text-xs font-medium"
            >
          
              <!-- BULK MODE -->
              <td v-if="bulkMode" class="p-2 border text-center w-[50px]">
                <button 
                  @click.stop="toggleSelect(p)"
                  class="mx-auto flex items-center justify-center"
                >
                  <!-- NOT SELECTED -->
                  <svg 
                    v-if="!selectedRows.includes(p)"
                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="rgba(173,184,194,1)">
                    <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5Z"/>
                  </svg>
                
                  <!-- SELECTED -->
                  <svg 
                    v-else
                    xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="rgba(253,2,2,1)">
                    <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"/>
                  </svg>
                </button>
              </td>
            
              <!-- EMPTY CELL WHEN NOT BULK MODE -->
              <td v-else class="p-2 border text-center w-[50px]"></td>
            
              <!-- PHOTO -->
              <td class="p-1 border max-w-[120px] sm:max-w-[150px]">
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

            
              <!-- NAME -->
              <td 
                class="p-1 border whitespace-nowrap text-left truncate max-w-[150px]"
                :title="formatFullName(p)"
              >
                {{ formatTableName(p) }}
              </td>
            
              <td class="p-1 border max-w-[120px] sm:max-w-[150px] truncate text-left">{{ p.work_id }}</td>
              <td class="p-1 border max-w-[120px] sm:max-w-[150px] truncate text-left">{{ p.region }}</td>
              <td class="p-1 border max-w-[120px] sm:max-w-[150px] truncate text-left">{{ p.designation }}</td>
              <td class="p-1 border max-w-[120px] sm:max-w-[150px] truncate text-left">{{ p.chapter }}</td>
              <td class="p-1 border max-w-[120px] sm:max-w-[150px] truncate text-left">{{ formatMonthYear(p.valid_until) }}</td>
            
              <!-- ACTION BUTTONS -->
              <td class="p-1 border text-center max-w-[120px] sm:max-w-[150px] truncate">
                <div class="flex items-center justify-center gap-2">
                
                  <!-- EDIT -->
                  <button 
                    @click.stop="openEditModal(p)"
                    class="text-yellow-500 hover:text-yellow-400"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.9 6.85L17.14 11.1L7.24 21H3v-4.25L12.9 6.85zm1.41-1.41L16.44 3.32c.39-.39 1.03-.39 1.42 0l2.83 2.83c.39.39.39 1.02 0 1.41L18.56 9.68L14.31 5.44z"/>
                    </svg>
                  </button>
                
                  <!-- DELETE -->
                  <button 
                    @click.stop="openDeleteModal(p)"
                    class="text-red-500 hover:text-red-400"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 4h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5V2h10v2zM9 9v8h2V9H9zm4 0v8h2V9h-2z"/>
                    </svg>
                  </button>
                
                  <!-- PDF -->
                  <button
                    :disabled="downloadLock"
                    @click.stop="downloadPDF(p)"
                    class="text-indigo-600 hover:text-indigo-400 disabled:text-gray-400"
                    title="Download PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 2l5 5v14c0 .55-.45 1-1 1H4c-.55 0-1-.46-1-1V3c0-.55.45-1 1-1h12zm-3 10V8h-2v4H8l4 4 4-4h-3z"/>
                    </svg>
                  </button>
                
                </div>
              </td>
            
            </tr>
            </transition-group>
          
            <!-- EMPTY MESSAGE -->
            <tr v-if="!people.length">
              <td colspan="9" class="p-4 text-center text-gray-500">
                No people found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6">

        <!-- Left: Page Text -->
        <span class="text-sm text-gray-500 leading-tight">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

          <!-- Right: Pagination Buttons -->
        <div class="flex items-center gap-3">
        
          <!-- Prev -->
          <button
            class="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300
                  text-gray-700 hover:bg-gray-200 hover:border-gray-400
                  transition disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:border-gray-300"
            :disabled="currentPage === 1"
            @click="goPrevPage"
          >
            Prev
          </button>
        
          <!-- Next -->
          <button
            class="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300
                  text-gray-700 hover:bg-gray-200 hover:border-gray-400
                  transition disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:border-gray-300"
            :disabled="currentPage === totalPages"
            @click="goNextPage"
          >
            Next
          </button>
        
        </div>
      </div>

      <!-- MODALS & TEMPLATES -->
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
        @close="() => { reDownloadModal = false; downloadLock = false }"
        @confirm="confirmReDownload"
      />

      <ReDownloadConfirm
        :show="reDownloadCSVModal"
        @close="() => { reDownloadCSVModal = false }"
        @confirm="confirmReDownloadCSV"
        message="You already downloaded the CSV file. Download again?"
      />

      <ReDownloadConfirm
        :show="reDownloadExcelModal"
        @close="() => { reDownloadExcelModal = false }"
        @confirm="confirmReDownloadExcel"
        message="You already downloaded the Excel file. Download again?"
      />

      <DeleteConfirm
        :show="showBulkDeleteModal"
        :person="{ name: selectedRows.length + ' selected people' }"
        @close="showBulkDeleteModal = false"
        @confirm="bulkDelete"
      />

      <ImportPeopleModal
        :show="showImportModal"
        @close="showImportModal = false"
        @import="processBulkImport"
      />

      <LogoutConfirm
        :show="showLogout"
        @close="() => { showLogout = false }"
        @confirm="confirmLogout"
      />

      <NotificationListModal 
        :show="showNotificationModal"
        :logs="newNotifications"
        :getPersonName="getPersonName"
        :getPersonWorkID="getPersonWorkID"
        @close="showNotificationModal = false"
      />

      <Teleport to="body">
        <PersonCardModal
          :show="showCardModal"
          :person="cardPerson"
          @close="showCardModal = false"
        />
      </Teleport>

      <!-- Hidden PDF template -->
      <div style="opacity:0; pointer-events:none; position:absolute; z-index:-1;">
        <PeopleForm ref="PeopleForm" />
      </div>
    </main>
  </div>

  <!-- GLOBAL LOADING -->
  <LoadingModal :show="loading" :message="loadingMessage" />
</template>

<script>
import AdminSideBar from '~/components/Admin/AdminSideBar.vue'
import AddPersonelModal from '~/components/Modals/AddPersonelModal.vue'
import DeleteConfirm from '~/components/Modals/DeleteConfirm.vue'
import PeopleForm from '~/components/Admin/PeopleForm.vue'
import NotificationModal from '~/components/Modals/NotificationModal.vue'
import ReDownloadConfirm from '~/components/Modals/ReDownloadConfirm.vue'
import LogoutConfirm from "~/components/Modals/LogoutConfirm.vue";
import LoadingModal from "~/components/Modals/LoadingModal.vue";
import ImportPeopleModal from '~/components/Modals/Import/ImportPeopleModal.vue'
import NotificationListModal from '~/components/Modals/NotificationListModal.vue'
import PersonCardModal from '~/components/Modals/PersonCardModal.vue'
import { usePageTitle } from '~/composables/usePageTitle.js'


export default {
  components: {
    AdminSideBar,
    AddPersonelModal,
    DeleteConfirm,
    PeopleForm,
    NotificationModal,
    ReDownloadConfirm,
    LogoutConfirm,
    LoadingModal,
    ImportPeopleModal,
    NotificationListModal,
    PersonCardModal
  },
  data() {
    return {
      //just for design
      showExportMenu: false,
      searchDebounce: null,

      showCardModal: false,
      cardPerson: null,
      supabase: null,
      showNotificationModal: false,
      newNotifications: [],
      selectedPerson: null,
      hasImageError: {},
      selectedRows: [],
      selectAll: false,
      bulkMode: false,
      showBulkDeleteModal: false,
      showImportModal: false,

      // UI state
      showLogout: false,
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      showNotice: false,
      noticeTitle: "",
      noticeMessage: "",
      noticeType: "",

      // People data & pagination
      people: [],
      searchQuery: "",
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,

      // form / uploads
      form: {},
      photoFile: null,

      // download / locks
      downloadLock: false,
      pdfTargetPerson: null,
      reDownloadModal: false,
      downloadCSVLock: false,
      downloadExcelLock: false,
      reDownloadCSVModal: false,
      reDownloadExcelModal: false,

      // loading
      loading: false,
      loadingMessage: "Please wait...",

      // progress state for imports
      importProgress: {
        running: false,
        percent: 0,
        message: '',
        photosTotal: 0,
        photosUploaded: 0,
        photosSkipped: 0,
        photosFailed: 0,
        rowsInserted: 0
      },
    }
  },

  async mounted() {
    usePageTitle('Admin People Directory')
      this.supabase = useSupabaseClient()
      await this.checkAdmin();

      // Always load full people list FIRST
      const allPeople = await this.loadAllPeople();

      // Generate notifications from complete list
      await this.checkExpirations(allPeople);

      // Load UI paginated table
      await this.loadPeople();

      // Load notifications for popup
      await this.refreshNotifications();

      await this.checkMonthlyNotifications();
    },
    methods: {
      /* ---------------- Helpers ---------------- */
      formatFullName(p) {
        if (!p) return ''
        const mi = p.middle_initial ? p.middle_initial + '. ' : ''
        const suffix = p.suffix ? ' ' + p.suffix : ''
        return `${(p.first_name||'').trim()} ${mi}${(p.last_name||'').trim()}${suffix}`.replace(/\s+/g,' ').trim()
      },

      formatMonthYear(value) {
        if (!value) return ''
        const d = new Date(value)
        return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
      },

      checkConnection() {
        if (!navigator.onLine) {
          this.loading = false
          this.showNotification('Connection Error', 'No internet connection detected.', 'error')
          return false
        }
        return true
      },

      timeoutPromise(promise, ms = 10000) {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('timeout')), ms)
          promise.then(res => {
            clearTimeout(timer)
            resolve(res)
          }).catch(err => {
            clearTimeout(timer)
            reject(err)
          })
        })
      },

      showNotification(title, message, type = 'success') {
        this.noticeTitle = title
        this.noticeMessage = message
        this.noticeType = type
        this.showNotice = true
      },

      /* ---------------- Security ---------------- */
      async checkAdmin() {
        try {
          const { data } = await this.supabase.auth.getSession()
          const verified = localStorage.getItem('admin_verified') === 'true'
          const trusted = localStorage.getItem('trusted_device') === 'true'
          const temp = sessionStorage.getItem('temporary_trust') === 'true'
          if (!data.session || !verified || (!trusted && !temp)) {
            this.$router.push('/login')
          }
        } catch (err) {
          console.error('checkAdmin error', err)
          this.$router.push('/login')
        }
      },

      /* ---------------- PDF ---------------- */
      async downloadPDF(person) {
        const key = `downloaded_${person.id}`
        if (sessionStorage.getItem(key)) {
          this.pdfTargetPerson = person
          this.reDownloadModal = true
          this.downloadLock = true
          return
        }

        await this.performPDFDownload(person)
        sessionStorage.setItem(key, 'true')
      },

      async performPDFDownload(person) {
        if (!this.checkConnection()) return

        this.loading = true
        this.loadingMessage = 'Generating PDF...'
        this.downloadLock = true

        try {
          await this.timeoutPromise(this.$refs.PeopleForm.exportPersonPDF(person), 20000)
          this.showNotification('PDF Ready', 'Download started.', 'success')
          await this.logActivity('downloadPDF', `Download PDF for ${this.formatFullName(person)}`, person.work_id)
        }  catch (err) {
          console.error('performPDFDownload', err)
          if (err?.message === 'timeout') this.showNotification('Timeout', 'PDF generation timed out.', 'error')
          else this.showNotification('Error', 'Failed to generate PDF.', 'error')
        } finally {
          this.loading = false
          setTimeout(() => (this.downloadLock = false), 2000)
        }
      },

      async confirmReDownload() {
        if (!this.pdfTargetPerson) return
        await this.performPDFDownload(this.pdfTargetPerson)
        this.reDownloadModal = false
      },

    /* ---------------- Load People ---------------- */
      async loadPeople() {
        if (!this.checkConnection()) return

        this.loading = true
        this.loadingMessage = 'Loading people...'

        try {
          const from = (this.currentPage - 1) * this.pageSize
          const to = from + this.pageSize - 1

          let query = this.supabase
            .from('people')
            .select('*', { count: 'exact' })
            .order('id', { ascending: false })
            .range(from, to)

          if (this.searchQuery.trim()) {
            const s = this.searchQuery.trim()
            query = query.or(
              `first_name.ilike.%${s}%,middle_initial.ilike.%${s}%,last_name.ilike.%${s}%,suffix.ilike.%${s}%,work_id.ilike.%${s}%,region.ilike.%${s}%,designation.ilike.%${s}%,chapter.ilike.%${s}%`
            )
          }

          const { data, count, error } = await this.timeoutPromise(query, 10000)
          if (error) throw error

          this.people = data || []
          this.totalPages = Math.max(1, Math.ceil((count || this.people.length) / this.pageSize))
        } catch (err) {
          console.error('loadPeople', err)
          await this.logError('loadPeople', err.message || String(err))
          if (err?.message === 'timeout') this.showNotification('Timeout', 'Server not responding. Try again.', 'error')
          else this.showNotification('Error', 'Failed to load people. Check your connection.', 'error')
        } finally {
          this.loading = false
        }
      },

      handleSearch() {
        this.currentPage = 1

        clearTimeout(this.searchDebounce)
        this.searchDebounce = setTimeout(() => {
          this.loadPeople()
        }, 600)
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

      async loadAllPeople() {
        const { data } = await this.supabase
        .from("people")
        .select("*");
        return data || [];
      },


    /* ---------------- Modal logic ---------------- */
      openAddModal() {
        this.isEditing = false
        this.selectedPerson = null
        this.form = {
          first_name: '',
          middle_initial: '',
          last_name: '',
          work_id: '',
          region: '',
          designation: '',
          chapter: '',
          valid_until: '',
          emergency_name: '',
          emergency_cp: '',
          emergency_address: '',
          picture_url: ''
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
        this.downloadLock = false
      },

      openDeleteModal(person) {
        this.downloadLock = false
        this.selectedPerson = person
        this.showDeleteModal = true
      },

      closeModal() {
        this.showModal = false
        this.photoFile = null
      },

      handleModalSubmit({ form, photoFile }) {
        this.form = form
        this.photoFile = photoFile
        if (this.isEditing) this.updatePerson()
        else this.addPerson()
      },
      async confirmLogout() {
        this.showLogout = false;
        this.loading = true;
        this.loadingMessage = "Logging out...";

        await this.logAdminLogout();
        // 🔴 Sign out
        this.supabase.auth.signOut().finally(() => {
          // Remove auth flags
          localStorage.removeItem("admin_verified");
          sessionStorage.removeItem("temporary_trust");
        
          // Stop loading after a small delay for smoother UI
          setTimeout(() => {
            this.loading = false;
            this.$router.push("/login");
          }, 400);
        });
      },
    /* ---------------- Upload photo ---------------- */
      async uploadPhoto() {
        if (!this.photoFile) {
          return {
            picture_url: this.form.picture_url || '',
            picture_filename: this.form.picture_filename || ''
          };
        }
      
        const extension = this.photoFile.name.split('.').pop();
        const filename = `${crypto.randomUUID()}.${extension}`;
      
        try {
          // Upload photo
          const { error } = await this.supabase.storage
            .from('people_photos')
            .upload(filename, this.photoFile);
        
          if (error) throw error;
        
          // Get public URL
          const { data: urlData } = this.supabase.storage
            .from('people_photos')
            .getPublicUrl(filename);
        
          return {
            picture_url: urlData.publicUrl,
            picture_filename: filename
          };
        } catch (err) {
          console.error("uploadPhoto error:", err);
        
          return {
            picture_url: this.form.picture_url || '',
            picture_filename: this.form.picture_filename || ''
          };
        }
      },

    /* ---------------- CRUD ---------------- */
      async addPerson() {
        if (!this.checkConnection()) return

        this.loading = true
        this.loadingMessage = 'Adding person...'

        try {
          const { picture_url, picture_filename } = await this.uploadPhoto()
          const isoDate = this.normalizeValidUntil(this.form.valid_until);

          const { full_name, ...cleanData } = this.form;

          await this.supabase.from("people").insert([
            { 
              ...cleanData,
              valid_until: isoDate,
              picture_url,
              picture_filename
            }
          ]);

          await this.logActivity(
            'addPerson',
            'Added Person',
            this.form.work_id,
            {
              work_id: this.form.work_id,
              full_name: this.formatFullName(this.form),
              region: this.form.region,
              chapter: this.form.chapter,
              designation: this.form.designation
            }
          )

          this.showNotification('Success!', 'Person added successfully!', 'success')
          this.closeModal()
          await this.loadPeople()
        } catch (err) {
          console.error('addPerson', err)
          await this.logError('addPerson', err.message || String(err), this.form)
          if (err?.message === 'timeout') this.showNotification('Timeout', 'Failed to add person. Server not responding.', 'error')
          else this.showNotification('Error', 'Failed to add person. Check your connection.', 'error')
        } finally {
          this.loading = false
        }
      },

      async updatePerson() {
        if (!this.checkConnection()) return;
            
        this.loading = true;
        this.loadingMessage = "Updating person...";
            
        try {
          const before = { ...this.selectedPerson };
        
          // Preserve current values
          let picture_url = before.picture_url;
          let picture_filename = before.picture_filename;
        
          // If user uploaded a new photo
          if (this.photoFile) {
          
            // Delete old file only if it exists
            if (before.picture_filename) {
              await this.deletePhotoFromStorage(before.picture_filename);
            }
          
            // Upload new photo → returns { picture_url, picture_filename }
            const uploaded = await this.uploadPhoto();
            picture_url = uploaded.picture_url;
            picture_filename = uploaded.picture_filename;
          }
        
          // Normalize date
          const isoDate = this.normalizeValidUntil(this.form.valid_until);
        
          const after = {
            ...this.form,
            valid_until: isoDate,
            picture_url,
            picture_filename
          };
        
          const changes = this.generateChanges(before, after);
        
          // Remove full_name before update
          const { full_name, ...cleanData } = after;
        
          // Update database
          await this.timeoutPromise(
            this.supabase
              .from("people")
              .update(cleanData)
              .eq("id", this.selectedPerson.id),
            10000
          );
        
          // Update notifications
          await this.updateNotificationForPerson(this.selectedPerson.id);
        
          // Log activity
          await this.logActivity(
            "updatedPerson",
            "Updated Person",
            this.form.work_id,
            {
              work_id: this.form.work_id,
              full_name: this.formatFullName(after),
              changes: changes.length
                ? changes
                : [{ field: "No Changes", oldValue: "-", newValue: "-" }]
            }
          );
          
          this.showNotification("Updated!", "Person updated successfully!", "warning");
          this.closeModal();
          
          await this.loadPeople();
          
        } catch (err) {
          console.error("updatePerson", err);
        
          await this.logError(
            "updatePerson",
            err.message || String(err),
            { person_id: this.selectedPerson?.id, form: this.form }
          );
        
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
          // Delete photo from storage (if exists)
          if (this.selectedPerson.picture_filename) {
            await this.deletePhotoFromStorage(this.selectedPerson.picture_filename);
          }
        
          // Delete person from DB
          await this.timeoutPromise(
            this.supabase
              .from("people")
              .delete()
              .eq("id", this.selectedPerson.id),
            10000
          );
        
          // Log activity
          await this.logActivity(
            "deletedPerson",
            "Deleted Person",
            this.selectedPerson.work_id,
            {
              work_id: this.selectedPerson.work_id,
              full_name: this.formatFullName(this.selectedPerson),
              region: this.selectedPerson.region,
              chapter: this.selectedPerson.chapter,
              designation: this.selectedPerson.designation,
              photo_deleted: !!this.selectedPerson.picture_url
            }
          );
          
          this.showNotification("Deleted!", "Person has been removed.", "error");
          this.showDeleteModal = false;
          
          await this.loadPeople();
          
        } catch (err) {
          console.error("deletePerson", err);
          await this.logError(
            "deletePerson",
            err.message || String(err),
            { person_id: this.selectedPerson?.work_id }
          );
        
          this.showNotification("Error", "Failed to delete person.", "error");
        } finally {
          this.loading = false;
        }
      },  

      async deletePhotoFromStorage(filename) {
        if (!filename) return;

        try {
          const { error } = await this.supabase.storage
            .from('people_photos')
            .remove([filename]);
        
          if (error) console.warn("Failed to delete:", filename, error);
        } catch (err) {
          console.error("deletePhotoFromStorage error:", err);
        }
      },
    /* ---------------- Exports ---------------- */
      exportCSV() {
        const key = 'csv_downloaded'
        if (sessionStorage.getItem(key)) {
          this.reDownloadCSVModal = true
          return
        }
        this.performCSVExport().then(() => sessionStorage.setItem(key, 'true'))
      },

      async performCSVExport() {
        if (!this.people.length) return

        let csv = 'Full Name,ID No.,Region,Designation,Chapter,Valid Until\n'
        this.people.forEach(p => {
          csv += `${this.formatFullName(p)},${p.work_id},${p.region},${p.designation},${p.chapter},${p.valid_until}\n`
        })

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'people.csv'
        a.click()

        await this.logActivity('exportCSV', 'Download CSV file', null, { total_rows: this.people.length })
      },  

      exportExcel() {
        const key = 'excel_downloaded'
        if (sessionStorage.getItem(key)) {
          this.reDownloadExcelModal = true
          return
        }
        this.performExcelExport().then(() => sessionStorage.setItem(key, 'true'))
      },  

      async performExcelExport() {
        if (!this.people.length) return

        let table = `
          <table>
            <tr>
              <th>Name</th><th>ID No.</th>
              <th>Region</th><th>Chapter</th><th>Designation</th><th>Valid Until</th>
            </tr>
          ${this.people
            .map(p => `
            <tr>
              <td>${this.formatFullName(p)}</td>
              <td>${p.work_id}</td>
              <td>${p.region}</td>
              <td>${p.chapter}</td>
              <td>${p.designation}</td>
              <td>${this.formatMonthYear(p.valid_until)}</td>
            </tr>`).join('')}
          </table>`

        const blob = new Blob([table], { type: 'application/vnd.ms-excel' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'people.xls'
        a.click()

        await this.logActivity('exportExcel', 'Download Excel file', null, { total_rows: this.people.length })
      },

      confirmReDownloadCSV() {
        this.performCSVExport()
        this.reDownloadCSVModal = false
      },

      confirmReDownloadExcel() {
        this.performExcelExport()
        this.reDownloadExcelModal = false
      },

    /* ---------------- Logging ---------------- */
      async logError(action, message, details = {}) {
        try {
          await this.supabase.from('error_logs').insert([{ action, message, details, created_at: new Date() }])
        } catch (err) {
          console.error('Failed to log error to db:', err)
        }
      },

      async logActivity(action, description, personId = null, metadata = {}) {
        const { data: sessionData } = await this.supabase.auth.getSession()
        const adminId = sessionData?.session?.user?.id || null

        const { error } = await this.supabase
          .from('activity_logs')
          .insert([{
            action,
            description,
            person_id: personId,
            admin_id: adminId,
            metadata,
            created_at: new Date().toISOString()
          }])

        if (error) {
          console.error('ACTIVITY LOG FAILED:', error)
        }
      },

    /* ---------------- Utilities ---------------- */
      generateChanges(before, after) {
        const changes = []
        for (const key in after) {
          if (before[key] !== after[key]) {
            changes.push({ field: key, oldValue: before[key] ?? '', newValue: after[key] ?? '' })
          }
        }
        return changes
      },
      toggleSelectAll() {
        if (this.selectAll) {
          this.selectedRows = [...this.people]
        } else {
          this.selectedRows = []
        }
      },

      openBulkDeleteModal() {
      this.showBulkDeleteModal = true
      },

      async bulkDelete() {
        if (!this.checkConnection()) return;

        this.loading = true;
        this.loadingMessage = "Deleting selected people...";

      try {
        const ids = this.selectedRows.map(p => p.id);
        const workIds = this.selectedRows.map(p => p.work_id);

        await this.supabase
          .from("people")
          .delete()
          .in("id", ids);

      // Activity log
        await this.logActivity(
          "bulkDelete",
          `Bulk deleted ${ids.length} people`,
          null,
          {
            total_deleted: ids.length,
            work_ids: workIds
          }
        );

        this.showNotification("Deleted!", `${ids.length} people removed.`, "error");

        this.selectedRows = [];
        this.selectAll = false;
        this.showBulkDeleteModal = false;

        await this.loadPeople();

      } catch (err) {
        console.error(err);
        await this.logError("bulkDelete", err.message, { ids: this.selectedRows });

        this.showNotification("Error", "Bulk delete failed.", "error");
      }

      this.loading = false;
      },

      cancelBulkMode() {
        this.bulkMode = false;
        this.selectAll = false;
        this.selectedRows = [];
      },

      async processBulkImport({ rows, photoFiles }) {
        // rows: array of objects ready to be inserted
        // photoFiles: plain object { filename: File, ... } coming from modal
        if (!rows || !rows.length) return;
        if (!this.checkConnection()) return;
        // prepare
        this.importProgress.running = true;
        this.importProgress.percent = 0;
        this.importProgress.message = 'Starting import...';
        this.importProgress.photosTotal = 0;
        this.importProgress.photosUploaded = 0;
        this.importProgress.photosSkipped = 0;
        this.importProgress.photosFailed = 0;
        this.importProgress.rowsInserted = 0;
        // convert photoFiles to Map for convenience
        const photoMap = new Map(Object.entries(photoFiles || {}));
        // find which rows reference photo filenames
        // common CSV mapping field name we used: photo_filename
        const rowsWithPhoto = rows.filter(r => r.photo_filename && String(r.photo_filename).trim());
        this.importProgress.photosTotal = rowsWithPhoto.length;
        // batch settings
        const photoQueue = [...rowsWithPhoto]; // clone
        const batchSize = 500; // DB insert batch
        const uploadConcurrency = 4; // upload concurrency for photos
        const bucket = 'people_photos';
        // helper: check if file exists in storage by attempting download()
        const fileExistsInStorage = async (filename) => {
          try {
            const { data, error } = await this.supabase.storage.from(bucket).download(filename);
            if (error && error.status === 404) return false;
            if (error) {
              // some other error — treat as not existing but log
              console.warn('storage.download error (treated as not exists):', filename, error);
              return false;
            }
            // data is a Blob — file exists
            return true;
          } catch (err) {
            console.warn('fileExistsInStorage catch:', err);
            return false;
          }
        };
      
        // helper: upload file
        const uploadFile = async (file, filename) => {
          try {
            const { data, error } = await this.supabase.storage.from(bucket).upload(filename, file);
            if (error) throw error;
            // get public url
            const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(filename);
            return urlData.publicUrl || null;
          } catch (err) {
            console.error('uploadFile error', filename, err);
            return null;
          }
        };
      
        // upload worker with limited concurrency
        const uploadWorker = async () => {
          while (photoQueue.length && !this.importProgress.cancelRequested) {
            const row = photoQueue.shift();
            const filename = row.photo_filename?.trim();
            if (!filename) {
              this.importProgress.photosFailed++;
              continue;
            }
          
            // see if we actually have the file in selected folder
            const fileObj = this.findMatchingPhoto(photoMap, filename);
            if (!fileObj) {
              // file not provided by admin — skip
              this.importProgress.photosSkipped++;
              continue;
            }
          
            try {
              // check if exists in storage
              const exists = await fileExistsInStorage(filename);
              if (exists) {
                // reuse public url
                const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(filename);
                row.picture_url = urlData.publicUrl || "";
                this.importProgress.photosSkipped++;
              } else {
                // upload
                let publicUrl = null
                let attempts = 0
                while (!publicUrl && attempts < 3) {
                  attempts++
                  publicUrl = await uploadFile(fileObj, filename)
                }
                if (publicUrl) {
                  row.picture_url = publicUrl;
                  this.importProgress.photosUploaded++;
                } else {
                  this.importProgress.photosFailed++;
                  row.picture_url = "";
                }
              }
            } catch (err) {
              console.error('photo upload/exists check error', filename, err);
              this.importProgress.photosFailed++;
              row.picture_url = "";
            } finally {
              // update percent (rough)
              const donePhotos = this.importProgress.photosUploaded + this.importProgress.photosSkipped + this.importProgress.photosFailed;
              this.importProgress.percent = Math.round((donePhotos / Math.max(1, this.importProgress.photosTotal)) * 100 * 0.6); // photos weigh 60% of progress
            }
          }
        };
      
        try {
          // spawn concurrent upload workers
          const workers = [];
          for (let i = 0; i < uploadConcurrency; i++) workers.push(uploadWorker());
          await Promise.all(workers);
        
          // now, insert in DB in chunks
          this.importProgress.message = 'Inserting rows into DB...';
          const totalRows = rows.length;
          for (let i = 0; i < totalRows; i += batchSize) {
            const chunk = rows.slice(i, i + batchSize);
            // safety: remove any unknown keys that Supabase might not accept or convert Date strings
            // you can adapt to your table shape. Here we assume keys match column names.
            const { error } = await this.supabase.from('people').insert(chunk);
            if (error) {
              // fallback: try individual inserts (slow) or abort. We'll log and throw to stop.
              await this.logError('bulkImport', error.message, { chunk });
              throw error;
            } else {
              this.importProgress.rowsInserted += chunk.length;
            }
          
            // update percent: photos portion was up to 60%, DB insertion 40%
            const afterRows = i + chunk.length;
            const rowsProgress = Math.round((afterRows / totalRows) * 100 * 0.4);
            this.importProgress.percent = Math.min(100, 60 + rowsProgress);
          }
        
          // done
          this.importProgress.percent = 100;
          this.importProgress.message = `Imported ${this.importProgress.rowsInserted} rows.`;
          this.showNotification('Import complete', `Imported ${this.importProgress.rowsInserted} rows.`, 'success');
        
          // log activity
          await this.logActivity('bulkImport', `Imported ${this.importProgress.rowsInserted} rows`, null, {
            rows: this.importProgress.rowsInserted,
            photosUploaded: this.importProgress.photosUploaded,
            photosSkipped: this.importProgress.photosSkipped,
            photosFailed: this.importProgress.photosFailed
          });
        
          // refresh list
          await this.loadPeople();
        
        } catch (err) {
          console.error('processBulkImport error', err);
          await this.logError('processBulkImport', err.message || String(err), { rowsCount: rows.length });
          this.showNotification('Import failed', err.message || 'Unknown error', 'error');
        } finally {
          this.importProgress.running = false;
          // clear if you want
        }
      },

      findMatchingPhoto(photoMap, rawName) {
        if (!rawName) return null;

        let name = rawName.trim();
        name = name.replace(/^.*[\\/]/, ""); // remove paths
        const lower = name.toLowerCase();

        const noExt = lower.replace(/\.(jpg|jpeg|png|webp)$/i, "");

        // Try exact match first
        for (const key of photoMap.keys()) {
          if (key.toLowerCase() === lower) return photoMap.get(key);
        }
      
        // Try match without extension
        for (const key of photoMap.keys()) {
          const keyLower = key.toLowerCase();
          const keyNoExt = keyLower.replace(/\.(jpg|jpeg|png|webp)$/i, "");
          if (keyNoExt === noExt) return photoMap.get(key);
        }
      
        // Try starts-with matching (user might upload 001_profile.png)
        for (const key of photoMap.keys()) {
          if (key.toLowerCase().startsWith(noExt)) return photoMap.get(key);
        }
      
        return null; // not found
      },

      async checkExpirations(allPeople) {
        for (const p of allPeople) {
          if (!p.valid_until) continue;
        
          const expiry = new Date(p.valid_until);
          const expText = expiry.toLocaleString("en-US", { month: "long", year: "numeric" });
        
          // Permanent message
          const message = `Membership valid until ${expText}.`;
        
          // Check if notification already exists for this person
          const { data: existing } = await this.supabase
            .from("notification_logs")
            .select("id")
            .eq("person_id", p.id)
            .maybeSingle();
        
          // If exists → do NOT delete, do NOT create again
          if (existing) continue;
        
          // Create only once (permanent)
          await this.supabase.from("notification_logs").insert([
            {
              person_id: p.id,
              message,
              created_at: new Date()
            }
          ]);
        }
      },

      async updateNotificationForPerson(personId) {
        // Load fresh data
        const { data: p } = await this.supabase
          .from("people")
          .select("*")
          .eq("id", personId)
          .single();
      
        if (!p || !p.valid_until) return;
      
        const expiry = new Date(p.valid_until);
        const expText = expiry.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        });
      
        const message = `Membership valid until ${expText}.`;
      
        // Check if notification already exists
        const { data: existing } = await this.supabase
          .from("notification_logs")
          .select("*")
          .eq("person_id", personId)
          .maybeSingle();
      
        if (!existing) {
          // Create permanent notification if missing
          await this.supabase.from("notification_logs").insert([
            {
              person_id: personId,
              message,
              created_at: new Date(),
            },
          ]);
        } else {
          // Only update message (KEEP notification forever)
          await this.supabase
            .from("notification_logs")
            .update({ message })
            .eq("id", existing.id);
        }
      },

      async refreshNotifications() {
        const { data } = await this.supabase
          .from("notification_logs")
          .select("*")
          .order("created_at", { ascending: false });
      
        this.newNotifications = data || [];
      },

      normalizeValidUntil(value) {
        if (!value) return null;
      
        // Try direct parsing first
        let date = new Date(value);
      
        // If invalid date, assume value is "Month YYYY"
        if (isNaN(date.getTime())) {
          try {
            const parts = value.split(" ");
            const monthName = parts[0];
            const year = parts[1];
          
            const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
            date = new Date(year, monthIndex, 1); 
          } catch (e) {
            return null;
          }
        }
      
        return date.toISOString().split("T")[0]; // Return YYYY-MM-DD
      },

      openNotifications() {
        this.refreshNotifications();
        this.showNotificationModal = true;
      },

      getPersonName(id) {
        const p = this.people.find(x => x.id === id);
        if (!p) return "Unknown";
      
        const mi = p.middle_initial ? p.middle_initial + ". " : "";
        const suffix = p.suffix ? " " + p.suffix : "";
      
        return `${p.first_name} ${mi}${p.last_name}${suffix}`;
      },

      getPersonWorkID(id) {
        const p = this.people.find(x => x.id === id);
        return p ? p.work_id : "—";
      },

      getRowColor(personId) {
        const p = this.people.find(x => x.id === personId);
        if (!p || !p.valid_until) return "";
      
        const now = new Date();
        const expiry = new Date(p.valid_until);
      
        // Month difference
        const diffMonths =
          (expiry.getFullYear() - now.getFullYear()) * 12 +
          (expiry.getMonth() - now.getMonth());
      
        if (diffMonths < 0) return "bg-red-600";     // expired
        if (diffMonths === 0) return "bg-red-600";     // expired
        if (diffMonths <= 2) return "bg-yellow-500"; // expiring soon
        return "bg-green-600";                       // valid
      },

      async hasSeenNotificationThisMonth(personId) {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      
        const { data } = await this.supabase
          .from("notification_tracker")
          .select("id")
          .eq("person_id", personId)
          .eq("month_key", monthKey)
          .maybeSingle();
      
        return !!data;
      },

      async markNotificationShown(personId) {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      
        await this.supabase.from("notification_tracker").insert([
          {
            person_id: personId,
            month_key: monthKey,
          }
        ]);
      },

      async checkMonthlyNotifications() {
        const critical = this.newNotifications.filter(log => {
          const color = this.getRowColor(log.person_id);
          return color.includes("red") || color.includes("yellow");
        });
      
        const showList = [];
      
        for (const log of critical) {
          const alreadySeen = await this.hasSeenNotificationThisMonth(log.person_id);
        
          if (!alreadySeen) {
            showList.push(log);
            await this.markNotificationShown(log.person_id);
          }
        }
      
        // Only show modal if there are notifications for this month
        if (showList.length > 0) {
          this.newNotifications = showList;
          this.showNotificationModal = true;
        }
      },

      openPersonCard(person) {
        this.cardPerson = person;
        this.showCardModal = true;
      },

      toggleSelect(person) {
        const index = this.selectedRows.indexOf(person)
          if (index === -1) {
          this.selectedRows.push(person)
        } else {
          this.selectedRows.splice(index, 1)
        }
      },

      formatTableName(p) {
        if (!p) return "";

        const mi = p.middle_initial ? p.middle_initial + ". " : "";
        const suffix = p.suffix ? " " + p.suffix : "";

        return `${p.last_name}, ${p.first_name} ${mi}${suffix}`.trim();
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
      asyncCriticalNotifications() {
        return this.newNotifications.filter(log => {
          const color = this.getRowColor(log.person_id);
          return color.includes("red") || color.includes("yellow");
        });
      }
}

  
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm
        hover:bg-blue-700 transition active:scale-[.97];
}

.btn-green {
  @apply px-4 py-2 rounded-lg bg-green-600 text-white font-medium shadow-sm
        hover:bg-green-700 transition active:scale-[.97];
}

.btn-yellow {
  @apply px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium shadow-sm
        hover:bg-yellow-600 transition active:scale-[.97];
}

.btn-purple {
  @apply px-4 py-2 rounded-lg bg-purple-600 text-white font-medium shadow-sm
        hover:bg-purple-700 transition active:scale-[.97];
}

.btn-red {
  @apply px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-sm
        hover:bg-red-700 transition active:scale-[.97];
}

.btn-disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-inherit active:scale-100;
}

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
