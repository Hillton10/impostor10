// ============================
// 📦 DATOS BASE
// ============================
let allPlayers = JSON.parse(localStorage.getItem("players"));
const impostorsCount = +localStorage.getItem("impostors");
const word = JSON.parse(localStorage.getItem("word"));

// ============================
// 🔀 FILTRAR SOLO LOS JUGADORES SELECCIONADOS
// ============================
let players = allPlayers.filter(p => p.selected);

// ============================
// 🔀 MEZCLAR JUGADORES (azar quién ve primero)
// ============================
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(players);

// ============================
// 🧠 HISTORIAL (SE BORRA AL CERRAR PESTAÑA)
// ============================
let roleHistory = JSON.parse(sessionStorage.getItem("roleHistory")) || {};

players.forEach(p => {
  if (roleHistory[p.name] === undefined) roleHistory[p.name] = 0;
});

// ============================
// 🎭 AZAR JUSTO DE IMPOSTORES
// ============================
let impostors = [];

while (impostors.length < impostorsCount) {

  const minCount = Math.min(...players.map(p => roleHistory[p.name]));

  const candidates = players
    .map((p, i) => ({ p, i }))
    .filter(obj => roleHistory[obj.p.name] === minCount)
    .filter(obj => !impostors.includes(obj.i));

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  impostors.push(chosen.i);
  roleHistory[chosen.p.name]++;
}

// Guardar
sessionStorage.setItem("roleHistory", JSON.stringify(roleHistory));
localStorage.setItem("impostorIndexes", JSON.stringify(impostors));

// ============================
// 🎮 ELEMENTOS HTML
// ============================
const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const secret = document.getElementById("secret");
const swipe = document.getElementById("swipeBox");
const btn = document.getElementById("nextBtn");

let index = 0;
let startY = 0;
let dragging = false;

// ============================
// 👤 MOSTRAR JUGADOR
// ============================
function showPlayer() {
  const p = players[index];
  avatar.src = p.img;
  nameEl.textContent = p.name;
  secret.style.display = "none";
  swipe.style.transform = "translateY(0)";
  swipe.style.display = "block";

  btn.textContent = (index === players.length - 1) ? "Iniciar" : "Siguiente";
}

// ============================
// 📱 TOUCH / 🖱️ MOUSE
// ============================
swipe.addEventListener("touchstart", e => { startY = e.touches[0].clientY; dragging = true; });
swipe.addEventListener("touchmove", e => { if (!dragging) return; if (startY - e.touches[0].clientY > 50) showSecret(); });
swipe.addEventListener("touchend", resetSwipe);

swipe.addEventListener("mousedown", e => { startY = e.clientY; dragging = true; });
document.addEventListener("mousemove", e => { if (!dragging) return; if (startY - e.clientY > 50) showSecret(); });
document.addEventListener("mouseup", resetSwipe);

// ============================
// 🔐 MOSTRAR PALABRA / PISTA
// ============================
function showSecret() {
  secret.style.display = "block";

  if (impostors.includes(index)) {
    secret.innerHTML = `
      <span style="color: red; font-weight: bold;">IMPOSTOR</span><br>
      <span>${word.hint}</span>
    `;
  } else {
    secret.textContent = word.word;
  }
}

// ============================
// 🙈 OCULTAR DE NUEVO
// ============================
function resetSwipe() {
  dragging = false;
  secret.style.display = "none";
  swipe.style.transform = "translateY(0)";
}

// ============================
// ▶️ BOTÓN PRINCIPAL
// ============================
btn.onclick = () => {

  if (btn.textContent === "Siguiente") {
    index++;
    showPlayer();
    return;
  }

if (btn.textContent === "Iniciar") {
  const starter = players[Math.floor(Math.random() * players.length)];
  const side = Math.random() < 0.5 ? "DERECHA" : "IZQUIERDA";

  avatar.src = starter.img;
  nameEl.textContent = starter.name;
  swipe.style.display = "none";
  secret.style.display = "block";
  secret.textContent = ` ${side}`;

  // Ocultamos botón principal y mostramos contador
  btn.style.display = "none";
  const countdownEl = document.getElementById("countdown");
  countdownEl.style.display = "block";

  let time = 30;
  countdownEl.textContent = time;

  const interval = setInterval(() => {
    time--;
    countdownEl.textContent = time;
    if (time <= 0) {
      clearInterval(interval);
      countdownEl.style.display = "none";
      btn.style.display = "block"; // mostrar botón Votar
      btn.textContent = "Votar";
    }
  }, 1000);

  return;
}


  location.href = "votacion.html";
};

// ============================
// 🚀 INICIO
// ============================
showPlayer();
