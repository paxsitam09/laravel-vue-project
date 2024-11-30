import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: !!sessionStorage.getItem('jwtToken'), // Check if a token exists at startup
  }),
  getters: {
    jwtToken: (state) => sessionStorage.getItem('jwtToken')
  },
  actions: {
    login() {
      sessionStorage.setItem('jwtToken', this.jwtToken)
      this.isLoggedIn = true
    },
    logout() {
      // Remove token from localStorage and set the logged-in state to false
      sessionStorage.removeItem('jwtToken')
      this.isLoggedIn = false
    },
    checkAuthStatus() {
      // Check if token is present to determine logged-in state
      this.isLoggedIn = !!sessionStorage.getItem('jwtToken')
    }
  }
})
