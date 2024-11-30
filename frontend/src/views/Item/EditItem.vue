<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <!-- Header with blue gradient -->
    <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
      <h1 class="text-2xl font-bold">Edit Item</h1>
      <p class="text-blue-100 mt-1">Update the information below to modify this item</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <form v-if="item" @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title Input -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">
            Title
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input 
              v-model="item.title"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-300 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     transition-colors bg-white/50"
              placeholder="Enter item title"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span v-if="item.title" class="text-green-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <!-- Description Input -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">
            Description
            <span class="text-red-500">*</span>
          </label>
          <textarea 
            v-model="item.description"
            rows="4"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 
                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition-colors bg-white/50"
            placeholder="Enter item description"
          ></textarea>
        </div>

        <!-- Category Select -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">
            Category
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select 
              v-model="item.category"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-300 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     transition-colors bg-white/50 appearance-none"
            >
              <option value="" disabled>Select a category</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.name"
              >
                {{ category.name }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Current Image Preview (if exists) -->
        <div v-if="item.image" class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">Current Image</label>
          <div class="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
            <img 
              :src="item.image" 
              :alt="item.title"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 px-6 py-3 rounded-xl text-white font-medium
                   bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500
                   hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>

          <button
            type="button"
            @click="$router.push('/items')"
            class="px-6 py-3 rounded-xl text-gray-700 font-medium bg-gray-100 
                   hover:bg-gray-200 hover:shadow-lg transform hover:-translate-y-0.5 
                   transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>

      <!-- Loading State -->
      <div v-else class="flex items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from '@/axios'
import { useNotificationStore } from '@/stores/notificationStore'
export default {
  data() {
    return {
      item: null,
      categories: [],
      isLoading: false
    }
  },
  methods: {
    async fetchItem() {
      try {
        const response = await axios.get(`/items/${this.$route.params.id}`)
        this.item = response.data
        const categoriesResponse = await axios.get('/categories')
        this.categories = categoriesResponse.data
      } catch (error) {
        useNotificationStore().error('Error fetching item')
      }
    },
    async handleSubmit() {
      this.isLoading = true
      try {
        await axios.put(`/items/${this.item.id}`, this.item)
        useNotificationStore().success('Item updated successfully')
        this.$router.push('/items')
      } catch (error) {
        useNotificationStore().error('Error updating item')
      } finally {
        this.isLoading = false
      }
    }
  },
  created() {
    this.fetchItem()
  }
}
</script>