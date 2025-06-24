import './createCall.css'
import './style.css'

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("app").style.display = "block";
  }, 1000);
});

const muteButton = document.getElementById('mute-button');
const micOn = muteButton.querySelector('.mic-on');
const micOff = muteButton.querySelector('.mic-off');

let isMuted = true;

// Afficher mic-off par défaut
micOff.classList.add('visible');

muteButton.addEventListener('click', () => {
  isMuted = !isMuted;

  if (isMuted) {
    micOn.classList.remove('visible');
    micOff.classList.add('visible');
  } else {
    micOff.classList.remove('visible');
    micOn.classList.add('visible');
  }
});
