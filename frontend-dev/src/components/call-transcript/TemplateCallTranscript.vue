<script setup>
import { ref, onMounted } from 'vue'
import { API_SERVER_URL } from '@/main.js'
import { useRoute } from 'vue-router';

const route = useRoute();
const conversationUuid = route.params.conversationUuid;
const userUuid = route.params.userUuid;

console.log(conversationUuid);
console.log(userUuid);

const conversation = ref(null)
const person_1 = ref(null)
const person_2 = ref(null)
const isOwner = ref(false)
const date = ref(null)
const loading = ref(true)
const error = ref(null)
const transcript = ref(null)
const formatTranscript = ref(null)
const transcriptLoading = ref(false)
const formatLoading = ref(false)

const fetchConversation = async () => {
  try {
    loading.value = true
    const response = await fetch(`${API_SERVER_URL}/conversation/${conversationUuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jsonResponse = await response.json()
    console.log(jsonResponse);
    
    conversation.value = jsonResponse;
    person_1.value = jsonResponse.members[0];
    person_2.value = jsonResponse.members[1];

    conversation.value.members.forEach(member => {
      if (member.uuid === userUuid) {
        isOwner.value = true
      }
    });

  } catch (err) {
    error.value = err.message
    console.error('Error fetching conversation:', err)
  } finally {
    loading.value = false
    console.log('finnaly');
    
  }
}

const handleTranscript = async () => {
  try {
    transcriptLoading.value = true
    const response = await fetch(`${API_SERVER_URL}/conversation/${conversationUuid}/transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userUuid,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jsonResponse = await response.json()
    transcript.value = jsonResponse.transcript.text
  } catch (err) {
    console.error('Error fetching transcript:', err.message)
    return null
  } finally {
    transcriptLoading.value = false
  }
}

const handleFormatTranscript = async () => {
  try {
    formatLoading.value = true
    const response = await fetch(`${API_SERVER_URL}/conversation/${conversationUuid}/format-transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userUuid,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jsonResponse = await response.json()
    formatTranscript.value = jsonResponse.formattedTranscript
  } catch (err) {
    console.error('Error fetching transcript:', err.message)
    return null
  } finally {
    formatLoading.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  if (conversationUuid) {
    fetchConversation()
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#2b2b2b] text-white px-4 py-8">
    <!-- Logo -->
    <div class="absolute top-6 left-6">
      <img src="../../assets/logo_dore.png" alt="Logo" class="h-10 w-10" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-lg text-gray-200">Chargement...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-red-400 text-lg">Erreur: {{ error }}</div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-4xl mx-auto pt-20">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold mb-4">
          Transcription de l'interview entre
          <span class="text-[#c5a25b]">{{ person_1.firstname }} {{ person_1.lastname }}</span> &
          <span class="text-[#c5a25b]">{{ person_2.firstname }} {{ person_2.lastname }}</span>
        </h1>
        <p class="text-sm text-gray-300">
          Date: {{ formatDate(conversation?.createdAt) }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-4 mb-8" v-if="isOwner">
        <button 
          @click="handleTranscript"
          :disabled="transcriptLoading"
          :class="[
            'text-black text-sm font-medium px-6 py-2 rounded transition flex items-center gap-2',
            transcriptLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#c5a25b] hover:bg-[#b8914c]'
          ]">
          <svg v-if="transcriptLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ transcriptLoading ? 'Génération...' : 'Générer la transcription' }}
        </button>
        
        <button 
          @click="handleFormatTranscript" 
          :disabled="!transcript || formatLoading"
          :class="[
            'text-sm font-medium px-6 py-2 rounded transition flex items-center gap-2',
            transcript && !formatLoading
              ? 'bg-[#c5a25b] hover:bg-[#b8914c] text-black cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]">
          <svg v-if="formatLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ formatLoading ? 'Formatage...' : 'Formater la transcription' }}
        </button>
      </div>

      <!-- Transcript Result -->
      <div v-if="transcript" class="bg-white rounded-md p-6 text-black mb-8">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Transcription brut:</h2>
        <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {{ transcript }}
        </div>
      </div>

      <!-- Transcript Format Result -->
      <div v-if="formatTranscript" class="bg-white rounded-md p-6 text-black">
        <h2 class="text-lg font-semibold mb-6 text-gray-800">Transcription formatée:</h2>
        
        <form class="space-y-6">
          <!-- Identité -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-md font-medium text-gray-900 mb-3">Identité</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input 
                  v-model="formatTranscript.Identité.Nom"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Nom"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input 
                  v-model="formatTranscript.Identité.Prénom"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                <input 
                  v-model="formatTranscript.Identité.Âge"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Âge"
                />
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-md font-medium text-gray-900 mb-3">Contact</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input 
                  v-model="formatTranscript.Contact.Téléphone"
                  type="tel" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Téléphone"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model="formatTranscript.Contact.Email"
                  type="email" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Email"
                />
              </div>
            </div>
          </div>

          <!-- Expérience -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-md font-medium text-gray-900 mb-3">Expérience</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Postes occupés</label>
                <textarea 
                  v-model="formatTranscript.Expérience.Postes_occupés"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  rows="3"
                  placeholder="Postes occupés (un par ligne)"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Durées</label>
                <textarea 
                  v-model="formatTranscript.Expérience.Durées"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  rows="3"
                  placeholder="Durées (une par ligne)"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Compétences -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-md font-medium text-gray-900 mb-3">Compétences</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Compétences techniques</label>
                <textarea 
                  v-model="formatTranscript.Compétences.Techniques"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  rows="3"
                  placeholder="Compétences techniques (une par ligne)"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Soft skills</label>
                <textarea 
                  v-model="formatTranscript.Compétences.Soft_skills"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  rows="3"
                  placeholder="Soft skills (une par ligne)"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Disponibilité -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-md font-medium text-gray-900 mb-3">Disponibilité</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                <input 
                  v-model="formatTranscript.Disponibilité.Dates"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Dates de disponibilité"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraintes</label>
                <input 
                  v-model="formatTranscript.Disponibilité.Contraintes"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Contraintes"
                />
              </div>
            </div>
          </div>

          <!-- Prétentions -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-md font-medium text-gray-900 mb-3">Prétentions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Salaire</label>
                <input 
                  v-model="formatTranscript.Prétentions.Salaire"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Prétentions salariales"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
                <input 
                  v-model="formatTranscript.Prétentions.Conditions"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                  placeholder="Conditions particulières"
                />
              </div>
            </div>
          </div>

          <!-- Motivation -->
          <div class="pb-4">
            <h3 class="text-md font-medium text-gray-900 mb-3">Motivation</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Éléments clés</label>
              <textarea 
                v-model="formatTranscript.Motivation.Éléments_clés"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c5a25b] focus:border-transparent"
                rows="4"
                placeholder="Éléments clés de motivation"
              ></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 pt-4">
            <button 
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-[#c5a25b] hover:bg-[#b8914c] text-white rounded-md transition"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>