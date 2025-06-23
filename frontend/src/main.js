import './style.css'

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("app").style.display = "block";
  }, 3000);
});
