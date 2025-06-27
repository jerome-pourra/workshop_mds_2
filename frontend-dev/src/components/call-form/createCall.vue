<script>
import { API_SERVER_URL } from '@/main.js'
import { useCallStore } from "@/stores/callStore";
import { useNameStore } from "@/stores/callStore";
import { useRouter } from 'vue-router'

export default {
  name: 'CreerAppel',
  data() {
    return {
      prenom: '',
      nom: '',
      uuid: '',
      nomAppel: '',
      error: null,
    }
  },
  methods: {
    rejoindreAppel() {
      this.createUser()
    },
    createUser() {
      fetch(`${API_SERVER_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstname: this.prenom,
          lastname: this.nom
        })
      })
        .then(res => res.json())
        .then(data => {
          this.uuid = data.uuid
          console.log('User créé :', data)
          this.createCall()
        })
        .catch(err => {
          this.error = 'Erreur user : ' + err.message
          console.error(this.error)
        })
    },
    createCall() {
      const callStore = useCallStore();
      const nameStore = useNameStore();
      const router = useRouter()
      fetch(`${API_SERVER_URL}/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: this.uuid,
        })
      })
        .then(res => res.json())
        .then(data => {
          callStore.setUserId(this.uuid);
          callStore.setCallId(data.uuid);
          nameStore.setFirstnameOwner(this.prenom);
          nameStore.setLastnameOwner(this.nom);
          console.log('Appel créé :', data)
          this.$router.push({ name: 'call' })
        })
        .catch(err => {
          this.error = 'Erreur appel : ' + err.message
          console.error(this.error)
        })
    }
  }
}
</script>

<template>
  <div class="min-h-screen w-screen bg-gray-900 text-white flex items-center justify-center">
    <div class="w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6">Créer un appel</h2>
      
      <div class="my-4">
        <label class="block text-sm mb-1">Prenom</label>
        <input v-model="prenom" type="text" placeholder="Entrer votre prénom"
               class="w-full px-4 py-2 rounded-md bg-white text-black" />
      </div>

      <div class="my-4">
        <label class="block text-sm mb-1">Nom</label>
        <input v-model="nom" type="text" placeholder="Entrer votre nom"
               class="w-full px-4 py-2 rounded-md bg-white text-black" />
      </div>

      <h2 class="text-2xl font-bold mt-8 mb-6">Paramètre de l’appel</h2>

      <div class="my-4">
        <label class="block text-sm mb-1">Nom de l'appel</label>
        <input v-model="nomAppel" type="text" placeholder="Entrer le nom de l’appel"
               class="w-full px-4 py-2 rounded-md bg-white text-black" />
      </div>

      <div class="flex justify-end mt-6">
        <button @click="rejoindreAppel"
                class="bg-yellow-600 text-sm text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition">
          Rejoindre l'appel
        </button>
      </div>
    </div>
  </div>
</template>
