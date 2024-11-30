<template>
  <div>
    <div class="space-y-6 p-4 sm:p-6">
      <!-- Header Section with Search and Filters -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-xl w-full">
            <input 
              v-model="search" 
              placeholder="Search by Title" 
              @input="debouncedFetchItems"
              class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50"
            />
            <MagnifyingGlassIcon class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>

          <!-- Filters Group -->
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
            <!-- Category Filter -->
            <select 
              v-model="categoryFilter" 
              @change="fetchItems"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>

            <!-- Date Filters -->
            <div class="flex gap-2 w-full sm:w-auto">
              <input 
                type="date"
                v-model="startDate" 
                @change="fetchItems"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50"
              />
              <input 
                type="date" 
                v-model="endDate" 
                @change="fetchItems"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50"
              />
            </div>

            <!-- Create Button -->
            <button 
              @click="$router.push('/items/create')"
              class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-white font-medium
                     bg-gradient-to-r from-emerald-500 via-green-500 to-green-500
                     hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <PlusIcon class="w-5 h-5 mr-2" />
              Create Item
            </button>
          </div>
        </div>
      </div>

      <!-- Table/Card Section -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/50">
                <th 
                  v-for="column in columns" 
                  :key="column.key"
                  @click="sortBy(column.key)"
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100/50 whitespace-nowrap"
                >
                  <div class="flex items-center gap-2">
                    {{ column.label }}
                    <div class="flex flex-col">
                      <ChevronUpIcon
                        class="w-3 h-3"
                        :class="{ 'text-indigo-600': sortColumn === column.key && sortDirection === 'asc', 'text-gray-400': sortColumn !== column.key || sortDirection !== 'asc' }"
                      />
                      <ChevronDownIcon
                        class="w-3 h-3 -mt-1"
                        :class="{ 'text-indigo-600': sortColumn === column.key && sortDirection === 'desc', 'text-gray-400': sortColumn !== column.key || sortDirection !== 'desc' }"
                      />
                    </div>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500 line-clamp-2">{{ item.description }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {{ item.category }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ formatDate(item.created_at) }}</td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button 
                      @click="$router.push(`/items/${item.id}/edit`)"
                      class="inline-flex items-center px-3 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      <PencilSquareIcon class="w-4 h-4 mr-1.5" />
                      Edit
                    </button>
                    <button 
                      @click="confirmDelete(item)"
                      class="inline-flex items-center px-3 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon class="w-4 h-4 mr-1.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden divide-y divide-gray-200">
          <div 
            v-for="item in items" 
            :key="item.id"
            class="p-4 space-y-3"
          >
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-start gap-2">
                <h3 class="text-lg font-medium text-gray-900 flex-1">{{ item.title }}</h3>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap">
                  {{ item.category }}
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ item.description }}</p>
              <div class="text-sm text-gray-500">
                Created: {{ formatDate(item.created_at) }}
              </div>
            </div>
            
            <div class="flex gap-2 pt-2">
              <button 
                @click="$router.push(`/items/${item.id}/edit`)"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <PencilSquareIcon class="w-4 h-4 mr-1.5" />
                Edit
              </button>
              <button 
                @click="confirmDelete(item)"
                class="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <TrashIcon class="w-4 h-4 mr-1.5" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!items.length" class="text-center py-12">
          <div class="flex flex-col items-center">
            <InboxIcon class="w-12 h-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No items found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new item.</p>
            <div class="mt-6">
              <button
                @click="$router.push('/items/create')"
                class="inline-flex items-center px-4 py-2 rounded-lg text-white
                       bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
                       hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <PlusIcon class="w-5 h-5 mr-2" />
                Create Item
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="bg-gray-50/50 px-4 sm:px-6 py-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700 text-center sm:text-left">
              Showing <span class="font-medium">{{ from }}</span> to <span class="font-medium">{{ to }}</span> of <span class="font-medium">{{ total }}</span> results
            </div>
            <nav class="flex flex-wrap justify-center gap-1">
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="changePage(page)"
                :class="[
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50',
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors'
                ]"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <DeleteConfirmModal
      :show="showDeleteConfirm"
      :item-title="itemToDelete?.title"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { 
  MagnifyingGlassIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  InboxIcon
} from '@heroicons/vue/24/solid'
import axios from '@/axios'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'

export default {
  components: {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    PlusIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    InboxIcon,
    DeleteConfirmModal
  },
  data() {
    return {
      items: [],
      search: '',
      categoryFilter: '',
      startDate: '',
      endDate: '',
      categories: [],
      debounceTimeout: null,
      currentPage: 1,
      lastPage: 1,
      total: 0,
      from: 0,
      to: 0,
      perPage: 10,
      sortColumn: 'created_at', // default sort column
      sortDirection: 'desc',    // default sort direction
      columns: [
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'category', label: 'Category' },
        { key: 'created_at', label: 'Created Date' }
      ],
      itemToDelete: null,
      showDeleteConfirm: false,
    }
  },
  computed: {
    displayedPages() {
      const delta = 2;
      const range = [];
      for (
        let i = Math.max(2, this.currentPage - delta);
        i <= Math.min(this.lastPage - 1, this.currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (this.currentPage - delta > 2) {
        range.unshift('...');
      }
      if (this.currentPage + delta < this.lastPage - 1) {
        range.push('...');
      }

      range.unshift(1);
      if (this.lastPage !== 1) {
        range.push(this.lastPage);
      }

      return range;
    }
  },
  methods: {
    debouncedFetchItems() {
      // Clear any existing timeout
      clearTimeout(this.debounceTimeout)
      
      // Set a new timeout
      this.debounceTimeout = setTimeout(() => {
        this.fetchItems()
      }, 300) // Wait 300ms after last keystroke before fetching
    },
    
    async fetchItems() {
      const notificationStore = useNotificationStore()
      try {
        const params = new URLSearchParams()
        
        if (this.search) params.append('search', this.search)
        if (this.categoryFilter) params.append('category', this.categoryFilter)
        if (this.startDate) params.append('start_date', this.startDate)
        if (this.endDate) params.append('end_date', this.endDate)
        params.append('page', this.currentPage)
        params.append('per_page', this.perPage)
        params.append('sort_by', this.sortColumn)
        params.append('sort_direction', this.sortDirection)
        
        const response = await axios.get('/items', { params })
        
        const data = response.data
        this.items = data.data
        this.currentPage = data.current_page
        this.lastPage = data.last_page
        this.total = data.total
        this.from = data.from
        this.to = data.to

        const categoriesResponse = await axios.get('/categories')
        this.categories = categoriesResponse.data
        
      } catch (error) {
        notificationStore.error('Failed to load items')
      }
    },
    editItem(item) {
      // Implement edit functionality
    },
    confirmDelete(item) {
      this.itemToDelete = item
      this.showDeleteConfirm = true
    },
    
    async handleDelete() {
      const notificationStore = useNotificationStore()
      try {
        await axios.delete(`/items/${this.itemToDelete.id}`)
        this.showDeleteConfirm = false
        this.itemToDelete = null
        await this.fetchItems()
        notificationStore.success('Item deleted successfully')
      } catch (error) {
        notificationStore.error(error.response?.data?.message || 'Error deleting item')
      }
    },
    
    cancelDelete() {
      this.showDeleteConfirm = false
      this.itemToDelete = null
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    async changePage(page) {
      if (page >= 1 && page <= this.lastPage && page !== this.currentPage) {
        this.currentPage = page
        await this.fetchItems()
      }
    },
    sortBy(column) {
      // If clicking the same column, toggle direction
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        // New column, set as ascending
        this.sortColumn = column
        this.sortDirection = 'asc'
      }
      this.fetchItems()
    }
  },
  async created() {
    await this.fetchItems()
  },
  // Clean up the debounce timeout when component is destroyed
  beforeUnmount() {
    clearTimeout(this.debounceTimeout)
  }
}



</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>