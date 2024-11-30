<template>
    <div class="space-y-8">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 class="text-2xl font-bold">Welcome back, {{ userStore.userName }}</h1>
        <p class="text-indigo-100 mt-2">Here's your account overview</p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Items -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between">
            <div>
                <p class="text-gray-500 text-sm">Total Items</p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">
                    {{ isLoading ? '...' : stats.totalItems }}
                </h3>
            </div>
            <div class="bg-indigo-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            </div>
        </div>

        <!-- Total Users -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between">
            <div>
                <p class="text-gray-500 text-sm">Total Users</p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">
                    {{ isLoading ? '...' : stats.totalUsers }}
                </h3>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </div>
            </div>
        </div>

        <!-- Total Orders (or another metric) -->
        <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="flex items-center justify-between">
            <div>
                <p class="text-gray-500 text-sm">Total Categories</p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">
                    {{ isLoading ? '...' : stats.totalCategories }}
                </h3>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import axios from '@/axios'

const userStore = useUserStore()
const stats = ref({
    totalItems: 0,
    totalUsers: 0,
    totalCategories: 0
})
const isLoading = ref(true)

const fetchDashboardStats = async () => {
    try {
        const response = await axios.get('/dashboard/stats')
        stats.value = response.data
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchDashboardStats()
})
</script>