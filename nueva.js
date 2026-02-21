console.log("nueva.js cargado");

// ============================
// 👥 SOLO JUGADORES AGREGADOS
// ============================

let players = [];

let impostors = 1;
const impCount = document.getElementById("impCount");
const list = document.getElementById("playerList");

impCount.textContent = impostors;

// ============================
// 🎨 RENDER
// ============================
function render() {
  list.innerHTML = "";

  players.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "player selected";
    div.innerHTML = `
      <img src="img/def.jpg">
      <span>${p.name}</span>
    `;
    list.appendChild(div);
  });
}

// ============================
// ➕ AGREGAR JUGADOR
// ============================
function addPlayer() {
  const name = prompt("Nombre del jugador");
  if (!name) return;

  players.push({
    name,
    img: "img/def.jpg",
    selected: true
  });

  render();
}

// ============================
// 🎭 CONTROL IMPOSTORES
// ============================
function addImpostor() {
  if (impostors < players.length - 1) {
    impostors++;
    impCount.textContent = impostors;
  }
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
    localStorage.setItem("gameMode", "custom");

  if (players.length <= impostors) {
    alert("Jugadores insuficientes");
    return;
  }

  // Guardar jugadores
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("impostors", impostors);

  // Elegir palabra
  const base = SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];
  const hint = base.hints[Math.floor(Math.random() * base.hints.length)];

  localStorage.setItem("word", JSON.stringify({
    word: base.word,
    hint
  }));

  location.href = "palabra.html";
}