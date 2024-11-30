import { defineStore } from 'pinia'
import axios from '@/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userName: (state) => state.user?.name,
    userEmail: (state) => state.user?.email,
    userEmailVerified: (state) => state.user?.email_verified_at,
    userCreatedAt: (state) => state.user?.created_at,
    userUpdatedAt: (state) => state.user?.updated_at
  },

  actions: {
    async fetchUserData() {
      this.isLoading = true
      try {
        const response = await axios.post('/me')
        this.user = response.data
        console.log(this.user)
        this.error = null
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching user data'
        console.error('Error fetching user data:', error)
      } finally {
        this.isLoading = false
      }
    },

    clearUser() {
      this.user = null
      this.error = null
    }
  }
})