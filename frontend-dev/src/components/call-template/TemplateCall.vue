<template>
  <div v-if="currentView === 'form'" class="min-h-screen bg-[#2b2b2b] flex items-center justify-center px-4 text-white">

    <div class="flex items-center space-x-10">

      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-white" fill="currentColor">
            <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </div>
        <span class="text-lg font-medium">Sarah Billot</span>
      </div>

      <div class="h-10 w-px bg-gray-500"></div>

      <form @submit.prevent="joinCall" class="flex items-end space-x-4">
        <div class="flex flex-col">
          <label for="callId" class="text-xs text-gray-300 mb-1">
            ID de l'appel (fourni dans le mail d'invitation)
          </label>

          <input id="callId" v-model="callId" type="text" placeholder="Entrer l'id de l'appel"
            class="w-72 rounded-md bg-white text-black placeholder-gray-400 text-sm px-4 py-2 focus:outline-none" />
        </div>

        <button type="submit" class="bg-[#c5a25b] hover:bg-[#b8914c] transition
                 text-sm font-medium text-black px-4 py-2 rounded">
          Rejoindre l'appel
        </button>
      </form>
    </div>
  </div>

  <!-- Waiting Screen -->
  <div class="min-h-screen bg-[#2b2b2b] flex items-center justify-center text-white relative">
    <div class="absolute top-6 left-6">
      <img src="../../assets/logo_dore.png" alt="Logo" class="h-10 w-10" />
    </div>
    <div
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full py-4 px-2 flex flex-col items-center space-y-4 shadow-lg">
      <button class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-mic-icon lucide-mic">
          <path d="M12 19v3" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <rect x="9" y="2" width="6" height="13" rx="3" />
        </svg>

      </button>

      <button class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-phone-off-icon lucide-phone-off">
          <path
            d="M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272" />
          <path d="M22 2 2 22" />
          <path
            d="M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473" />
        </svg>
      </button>
    </div>

    <div class="text-center text-lg text-gray-200">
      En attente d’un<br />
      nouveau participant ...
    </div>
  </div>

  <!-- Call Screen -->
  <div class="min-h-screen w-screen bg-[#2b2b2b] text-white relative flex items-center justify-center">
    <div class="absolute top-6 left-6">
      <img src="../../assets/logo_dore.png" alt="Logo" class="h-10 w-10" />
    </div>

    <div
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full py-4 px-2 flex flex-col items-center space-y-4 shadow-lg">
      <button class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-mic-icon lucide-mic">
          <path d="M12 19v3" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <rect x="9" y="2" width="6" height="13" rx="3" />
        </svg>
      </button>

      <button class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-phone-off-icon lucide-phone-off">
          <path
            d="M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272" />
          <path d="M22 2 2 22" />
          <path
            d="M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473" />
        </svg>
      </button>
    </div>

    <div class="flex flex-col items-center">
      <div class="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
        <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 5.5 1.34 5.5 4v2H6.5v-2c0-2.66 2.8-4 5.5-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      </div>
      <span class="mt-2 text-sm">Sarah Billot</span>
    </div>
  </div>
</template>

<script>
</script>

<style scoped></style>
