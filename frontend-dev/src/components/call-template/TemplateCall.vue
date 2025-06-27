<script setup>
import { API_SERVER_URL } from '@/main.js'
</script>

<template>
  <!-- Formulaire de connexion -->
  <div v-if="currentView === 'form'" class="min-h-screen bg-[#2b2b2b] flex items-center justify-center px-4 text-white">
    <div class="flex items-center space-x-10">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-white" fill="currentColor">
            <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </div>
        <span class="text-lg font-medium">{{this.firstname}} {{this.name}}</span>
      </div>

      <div class="h-10 w-px bg-gray-500"></div>

      <form @submit.prevent="joinCall" class="flex items-end space-x-4">
        <div class="flex flex-col">
          <label for="callId" class="text-xs text-gray-300 mb-1">
            ID de l'appel (fourni dans le mail d'invitation)
          </label>
          <input
            id="callId"
            v-model="callId"
            type="text"
            placeholder="Entrer l'id de l'appel"
            class="w-72 rounded-md bg-white text-black placeholder-gray-400 text-sm px-4 py-2 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          class="bg-[#c5a25b] hover:bg-[#b8914c] transition text-sm font-medium text-black cursor-pointer px-4 py-2 rounded"
        >
          Rejoindre l'appel
        </button>
      </form>
    </div>
  </div>

  <!-- Écran d'attente -->
  <div v-if="currentView === 'waiting'" class="min-h-screen bg-[#2b2b2b] flex items-center justify-center text-white relative">
    <div class="absolute top-6 left-6">
      <img src="../../assets/logo_dore.png" alt="Logo" class="h-10 w-10" />
    </div>
    <button v-if="ownerUuid == userId" @click="copyUuidCall"
      class="absolute top-6 right-6 bg-[#c5a25b] text-black text-xs px-4 py-1.5 rounded hover:bg-[#b8914c] transition">
      Copier le lien d’invitation
    </button>

    <div
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full py-4 px-2 flex flex-col items-center space-y-4 shadow-lg"
    >
      <button class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
        @click="toggleMute">
        <svg v-if="mute" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-mic-off-icon lucide-mic-off">
          <path d="M9 9v6a3 3 0 0 0 6 0V9" />
          <path d="M12 19v3" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <rect x="9" y="2" width="6" height="13" rx="3" />
          <path d="M22 2L2 22" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-mic-icon lucide-mic">
          <path d="M12 19v3" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <rect x="9" y="2" width="6" height="13" rx="3" />
        </svg>
      </button>

      <button class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center cursor-pointer" @click="leave">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-off-icon lucide-phone-off"><path d="M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272"/><path d="M22 2 2 22"/><path d="M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473"/></svg>
      </button>
    </div>

    <div class="text-center text-lg text-gray-200">
      En attente d’un<br />nouveau participant ... conversation ID {{ callId }}
    </div>
  </div>

  <!-- Écran d'appel actif -->
  <div v-if="currentView === 'call'" class="min-h-screen w-screen bg-[#2b2b2b] text-white relative flex items-center justify-center">
    <div class="absolute top-6 left-6">
      <img src="../../assets/logo_dore.png" alt="Logo" class="h-10 w-10" />
    </div>

    <div
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full py-4 px-2 flex flex-col items-center space-y-4 shadow-lg"
    >
     <button class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
        @click="toggleMute">
        <svg v-if="mute" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-mic-off-icon lucide-mic-off">
          <path d="M9 9v6a3 3 0 0 0 6 0V9" />
          <path d="M12 19v3" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <rect x="9" y="2" width="6" height="13" rx="3" />
          <path d="M22 2L2 22" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-mic-icon lucide-mic">
          <path d="M12 19v3" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <rect x="9" y="2" width="6" height="13" rx="3" />
        </svg>
      </button>

      <button class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer" @click="leave">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-off-icon lucide-phone-off"><path d="M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272"/><path d="M22 2 2 22"/><path d="M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473"/></svg>
      </button>
    </div>

    <!-- Affichage de l’utilisateur distant -->
    <div class="flex flex-col items-center">
      <div class="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
        <img
          v-if="remoteUser?.avatarUrl"
          :src="remoteUser.avatarUrl"
          alt="Avatar"
          class="w-full h-full object-cover"
        />
        <svg v-else class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 5.5 1.34 5.5 4v2H6.5v-2c0-2.66 2.8-4 5.5-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      </div>
      <span class="mt-2 text-sm">
        {{ remoteUser?.name || 'Utilisateur connecté' }}
      </span>
    </div>
  </div>
  <!-- Écran de fin de l’utilisateur distant -->
  <div v-if="currentView === 'end'" class="min-h-screen bg-[#2b2b2b] flex items-center justify-center text-white relative">
    <div class="absolute top-6 left-6">
      <img src="../../assets/logo_dore.png" alt="Logo" class="h-10 w-10" />
    </div>

    <div class="text-center text-lg text-gray-200">
      Merci pour votre<br />participation !
    </div>
  </div>
  <div v-if="showToast"
    class="fixed top-6 right-6 bg-green-500 text-white text-sm px-4 py-2 rounded shadow transition-all duration-300">
    {{ toastMessage }}
  </div>
</template>


<script>
  import { useCallStore } from '../../stores/callStore'
  import { API_SERVER_URL } from '@/main.js'
export default {
  name: 'JoinCall',
  data() {
    return {
      socket: null,
      peer: null,
      localStream: null,
      audioContext: null,
      destination: null,
      mediaRecorder: null,
      recordedChunks: [],
      isRecording: false,
      mixedStream: null,
      isInRoom: false,
      userId: '',
      callId: '',
      ownerUuid: '',
      infosCall: {},
      events: [],
      currentView: 'form', // 'form' | 'waiting' | 'call' | 'end'
      remoteUser: null,
      mute: true,
      showToast: false,
      toastMessage: '',

      // Buffers
      pendingOffer: null,
      pendingCandidates: [],
    }
  },
  mounted() {
    const callStore = useCallStore();
    this.userId = callStore.userId;
    this.callId = callStore.callId;

    if (this.callId && this.userId) {
      this.joinCall();
    }
  },
  beforeUnmount() {
    if (this.socket) this.socket.disconnect();
    if (this.peer) this.peer.close();
  },
  methods: {
    showTemporaryToast(message, duration = 3000) {
      this.toastMessage = message
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, duration)
    },

    copyUuidCall() {
      const inviteLink = this.callId
      navigator.clipboard.writeText(inviteLink)
        .then(() => {
          this.showTemporaryToast("📋 Lien d'invitation copié dans le presse-papiers")
        })
        .catch(err => {
          console.error("Erreur lors de la copie du lien :", err)
          this.showTemporaryToast("❌ Erreur lors de la copie du lien", 4000)
        })
    },

    toggleMute() {
      this.mute = !this.mute;
      if (this.localStream) {
        this.localStream.getAudioTracks().forEach(track => {
          track.enabled = !this.mute;
        });
      }
    },
    async joinCall() {
      try {
        const response = await fetch(`${API_SERVER_URL}/conversation/${this.callId}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: this.userId }),
        });

        const data = await response.json();
        console.log('Call joined:', data);

        this.currentView = 'waiting';
        this.ownerUuid = data.owner.uuid
        this.infosCall = data
        this.connectToSocket();

      } catch (error) {
        console.error('Erreur joinCall :', error);
      }
    },

    connectToSocket() {
      this.socket = io(`${API_SERVER_URL}/webrtc`, { transports: ['websocket'] });

      this.socket.on('connect', async () => {
        this.addEvent(`✅ Socket connecté (${this.socket.id})`);
        
        await this.startWebrtc(); // ✅ initialise immédiatement WebRTC

        this.socket.emit("join", {
          userUuid: this.userId,
          conversationUuid: this.callId,
          data: null
        });
      });

      this.socket.on("join", async (user) => {
        this.addEvent("👤 Autre utilisateur a rejoint");

        this.remoteUser = user;
        this.currentView = 'call';

        if (this.isInRoom) {
          this.createOffer();
        }
      });

      this.socket.on("leave", () => {
        this.addEvent("👤 L'autre utilisateur a quitté");
        this.remoteUser = null;
        if(this.ownerUUid === this.userId) {
          // Owner : l’autre a quitté → tu peux afficher un message d’attente, ou finir la room, ou auto-envoi transcript, etc.
          this.currentView = 'end'; 
        } else {
          // Invité : le owner a quitté → redirige de force
          this.$router.push({ name: 'transcript' })
        }
      });

      this.socket.on("offer", async (offer) => {
        this.addEvent("📡 Offer reçu");
        if (this.currentView !== 'call') {
          this.currentView = 'call';
        }
        if (!this.peer) {
          console.warn("Offer reçu, mais peer non initialisé. Stocké en attente.");
          this.pendingOffer = offer;
          return;
        }
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        this.socket.emit("answer", {
          userUuid: this.userId,
          conversationUuid: this.callId,
          data: answer
        });
      });

      this.socket.on("answer", async (answer) => {
        this.addEvent("📡 Answer reçu");
        if (!this.peer) {
          console.warn("Answer reçu, mais peer non initialisé.");
          return;
        }
        await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
      });

      this.socket.on("ice-candidate", async (candidate) => {
        this.addEvent("❄️ ICE Candidate reçu");
        if (!this.peer) {
          console.warn("ICE candidate reçu, mais peer non initialisé. Stocké en attente.");
          this.pendingCandidates.push(candidate);
          return;
        }
        await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
      });

      this.socket.on("error", (err) => {
        this.addEvent(`❌ Erreur : ${err.message}`);
      });
    },

    async startWebrtc() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.destination = this.audioContext.createMediaStreamDestination();
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mixedStream = this.destination.stream;

      const localSource = this.audioContext.createMediaStreamSource(this.localStream);
      localSource.connect(this.destination);

      this.mediaRecorder = new MediaRecorder(this.mixedStream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 32000
      });
      this.recordedChunks = [];
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
        console.log(`📦 Enregistrement de ${e.data.size} octets`);
        
      };
      this.mediaRecorder.start();
      this.isRecording = true;

      this.peer = new RTCPeerConnection();

      this.peer.ontrack = (event) => {
        const remoteAudio = new Audio();
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.autoplay = true;
        remoteAudio.controls = true;
        document.body.appendChild(remoteAudio);

        if (this.audioContext && this.destination && this.isRecording) {
          const remoteSource = this.audioContext.createMediaStreamSource(event.streams[0]);
          remoteSource.connect(this.destination);
        }
      };

      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit("ice-candidate", {
            userUuid: this.userId,
            conversationUuid: this.callId,
            data: event.candidate
          });
        }
      };

      this.localStream.getTracks().forEach(track => this.peer.addTrack(track, this.localStream));

      this.isInRoom = true;

      // 🔁 Traitement des messages stockés
      if (this.pendingOffer) {
        this.addEvent("📡 Traitement de l'offre mise en attente");
        await this.peer.setRemoteDescription(new RTCSessionDescription(this.pendingOffer));
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        this.socket.emit("answer", {
          userUuid: this.userId,
          conversationUuid: this.callId,
          data: answer
        });
        this.pendingOffer = null;
      }

      for (const candidate of this.pendingCandidates) {
        this.addEvent("❄️ Traitement des ICE candidates en attente");
        await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
      this.pendingCandidates = [];
    },

    async createOffer() {
      const offer = await this.peer.createOffer();

      if (this.currentView !== 'call') {
        this.currentView = 'call';
      }

      await this.peer.setLocalDescription(offer);
      this.socket.emit("offer", {
        userUuid: this.userId,
        conversationUuid: this.callId,
        data: offer
      });
    },

    async leave() {
      // Stopper tout
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }
      if (this.peer) {
        this.peer.close();
      }

      // Notifier WebSocket + API
      this.socket.emit("leave", {
        userUuid: this.userId,
        conversationUuid: this.callId,
        data: null
      });

      // Owner : upload audio puis route transcript
      if (this.ownerUuid === this.userId) {
        await this.sendAudioCall();
        this.$router.push({ name: 'transcript', params: {conversationUuid: this.callId, userUuid: this.userId}});
      } else {
        // Invité : va sur page de fin
        this.currentView = 'end';
      }

      this.isInRoom = false;
    },

    async sendAudioCall() {
      try {

        setTimeout(async () => {          
          console.log(this.recordedChunks);
  
          const conversationBlob = new Blob(this.recordedChunks, {
            type: 'audio/webm;codecs=opus',
            audioBitsPerSecond: 32000
          });
          console.log(conversationBlob);
  
          // Test téléchargement avec nom unique
          // const url = URL.createObjectURL(conversationBlob);
          // const link = document.createElement('a');
          // link.href = url;
          // link.download = `conversation-${this.callId}-${Date.now()}.webm`;
          // link.style.display = 'none';
          
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
          // URL.revokeObjectURL(url);
  
          const formData = new FormData();
          formData.append('userId', this.userId);
          formData.append('file', conversationBlob, 'audio.webm');
  
          const response = await fetch(`${API_SERVER_URL}/conversation/${this.infosCall.uuid}/audio`, {
            method: 'POST',
            // headers: { 'Content-Type': 'application/json' },
            body: formData,
          });
  
          const data = await response.json();
          console.log('Audio:', data);
        }, 3000);

        
      } catch (error) {
        console.error('Erreur sendAudioCall :', error);
      }
    },


    addEvent(message) {
      this.events.push({ message, timestamp: Date.now() });
    },
  },
}
</script>

<style scoped></style>
