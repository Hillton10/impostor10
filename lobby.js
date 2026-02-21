console.log("lobby.js cargado");

// ============================
// 👥 CARGAR JUGADORES
// ============================

// Jugadores base
const basePlayers = BASE_PLAYERS.map(p => ({ ...p }));

// Jugadores agregados por el usuario
let userAdded = JSON.parse(localStorage.getItem("userAddedPlayers")) || [];

// Combinar base + agregados
let players = [...basePlayers, ...userAdded];

// ============================
// 🎭 IMPOSTORES
// ============================
let impostors = Number(localStorage.getItem("impostors")) || 1;
const impCount = document.getElementById("impCount");
impCount.textContent = impostors;

// ============================
// 🎨 RENDER
// ============================
const list = document.getElementById("playerList");

function render() {
  list.innerHTML = "";
  players.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "player" + (p.selected ? " selected" : "");
    div.onclick = () => toggle(i);
    div.innerHTML = `
      <img src="${p.img}">
      <span>${p.name}</span>
    `;
    list.appendChild(div);
  });
}

// ============================
// ✅ TOGGLE SELECCIÓN
// ============================
function toggle(i) {
  players[i].selected = !players[i].selected;
  render();
}

// ============================
// ➕ AGREGAR JUGADOR
// ============================
function addPlayer() {
  const name = prompt("Nombre del jugador");
  if (!name) return;

  const newPlayer = {
    name,
    img: "def.jpg",
    selected: true
  };

  players.push(newPlayer);
  userAdded.push(newPlayer);

  // Guardar solo los agregados
  localStorage.setItem("userAddedPlayers", JSON.stringify(userAdded));

  render();
}

// ============================
// 🎭 AUMENTAR / DISMINUIR IMPOSTOR
// ============================
function addImpostor() {
  impostors++;
  impCount.textContent = impostors;
}

function decreaseImpostor() {
  if (impostors > 1) {
    impostors--;
    impCount.textContent = impostors;
  }
}

// ============================
// ▶️ CONTINUAR
// ============================
function continueGame() {
  localStorage.setItem("gameMode", "base");
  const selectedPlayers = players.filter(p => p.selected);

  if (selectedPlayers.length <= impostors) {
    alert("Jugadores insuficientes");
    return;
  }

  // Guardar todos los jugadores con su estado selected
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("impostors", impostors);

  // 🎲 NUEVA PALABRA
  const base = SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];
  const hint = base.hints[Math.floor(Math.random() * base.hints.length)];

  localStorage.setItem("word", JSON.stringify({
    word: base.word,
    hint
  }));

  location.href = "palabra.html";
}

// ============================
// ▶️ ELIMINAR JUGADORES AGREGADOS
// Solo desde menú
// ============================
function resetUserPlayers() {
  userAdded = [];
  players = [...basePlayers];
  localStorage.removeItem("userAddedPlayers");
  render();
}

// ============================
render();
