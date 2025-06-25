import { defineStore } from 'pinia'

export const useCallStore = defineStore('call', {
  state: () => ({
    userId: '',
    callId: '',
  }),
  actions: {
    setUserId(userId) {
      this.userId = userId
    },
    setCallId(callId) {
      this.callId = callId
    }
  }
})