<template>
  <div class="min-h-screen w-screen bg-[#2b2b2b] flex items-center justify-center relative">
    <!-- Logo -->
    <div class="absolute top-6 left-6">
      <img src="../../assets/logo_dore.png" alt="Logo" class="h-10 w-10" />
    </div>

    <!-- Formulaire -->
    <div class="w-full max-w-md px-4 text-white">
      <h1 class="text-2xl font-semibold mb-6">Rejoindre un appel</h1>

      <form @submit.prevent="createUser" class="space-y-6">
        <!-- Prénom -->
        <div class="mb-4">
          <label for="firstname" class="block text-sm text-gray-300 mb-1">Prénom</label>
          <input
            id="firstname"
            v-model="firstname"
            type="text"
            placeholder="Entrer votre prénom"
            class="w-full rounded-md px-4 py-2 text-black placeholder-gray-400 bg-white focus:outline-none"
          />
        </div>

        <!-- Nom -->
        <div class="mb-4">
          <label for="lastname" class="block text-sm text-gray-300 mb-1">Nom</label>
          <input
            id="lastname"
            v-model="lastname"
            type="text"
            placeholder="Entrer votre nom"
            class="w-full rounded-md px-4 py-2 text-black placeholder-gray-400 bg-white focus:outline-none"
          />
        </div>

        <!-- Bouton -->
        <div class="flex justify-end mt-6">
          <button
            type="submit"
            class="bg-[#c5a25b] text-black text-sm font-medium px-4 py-1.5 rounded hover:bg-[#b8914c] transition"
          >
            Suivant
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useCallStore } from "@/stores/callStore";
export default {
  name: 'JoinCall',
  data() {
    return {
      firstname: '',
      lastname: '',
    }
  },
  methods: {
    createUser() {
      const callStore = useCallStore();
      fetch('http://10.102.134.228:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: this.firstname,
          lastname: this.lastname,
        }),
      })
        .then(response => response.json())
        .then(data => {
          callStore.setUser(data.userId);
          console.log('User created:', data);
        })
        .catch(error => {
          console.error('Error creating user:', error);
        });
    },
  },
}
</script>

<style scoped>
/* Aucun style custom supplémentaire */
</style>
