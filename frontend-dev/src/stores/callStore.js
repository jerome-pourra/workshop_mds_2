import { defineStore } from 'pinia'

export const useCallStore = defineStore('call', {
  state: () => ({
    userId: '',
  }),
  actions: {
    setUserId(userId) {
      this.userId = userId
    }
  }
})