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

export const useNameStore = defineStore('name', {
  state: () => ({
    guest: {
      firstname: '',
      lastname: '',
    },
    owner: {
      firstname: '',
      lastname: '',
    },
  }),
  actions: {
    setFirstnameGuest(firstname) {
      this.guest.firstname = firstname;
    },
    setLastnameGuest(lastname) {
      this.guest.lastname = lastname;
    },
    setFirstnameOwner(firstname) {
      this.owner.firstname = firstname;
    },
    setLastnameOwner(lastname) {
      this.owner.lastname = lastname;
    },
  },
});