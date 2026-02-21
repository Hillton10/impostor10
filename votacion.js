// 📦 DATOS BASE
let allPlayers = JSON.parse(localStorage.getItem("players"));
const impostors = JSON.parse(localStorage.getItem("impostorIndexes"));
const limit = impostors.length;

// 🔀 FILTRAR SOLO JUGADORES SELECCIONADOS
const players = allPlayers.filter(p => p.selected);

let selected = [];

const list = document.getElementById("votes");
const voteBtn = document.getElementById("voteBtn");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("resultText");
const impostorList = document.getElementById("impostorList");

// ============================
// 👥 MOSTRAR JUGADORES
// ============================
players.forEach((p, i) => {
  const div = document.createElement("div");
  div.className = "vote-player";
  div.innerHTML = `<img src="${p.img}"><span>${p.name}</span>`;
  div.onclick = () => toggle(i, div);
  list.appendChild(div);
});

// ============================
// ✅ SELECCIONAR VOTOS
// ============================
function toggle(i, el) {
  if (selected.includes(i)) {
    selected = selected.filter(x => x !== i);
    el.classList.remove("selected");
  } else if (selected.length < limit) {
    selected.push(i);
    el.classList.add("selected");
  }
}

// ============================
// 🗳️ VOTAR
// ============================
voteBtn.onclick = () => {
  const victoria = impostors.every(i => selected.includes(i));

  // ocultar votación
  list.style.display = "none";
  voteBtn.style.display = "none";

  // mostrar resultado
  resultBox.style.display = "block";

  // Limpiar clases antes de asignar
  resultText.classList.remove("victoria", "derrota");

  // Agregar clase CSS según resultado
  if (victoria) {
    resultText.classList.add("victoria");
    resultText.innerHTML = 'VICTORIA ✅';
  } else {
    resultText.classList.add("derrota");
    resultText.innerHTML = 'DERROTA 😈';
  }

  // mostrar SOLO impostores
  impostorList.innerHTML = "";
  impostors.forEach(i => {
    if (players[i]) { 
      const p = players[i];
      const div = document.createElement("div");
      div.className = "vote-player selected";
      div.innerHTML = `<img src="${p.img}"><span>${p.name}</span>`;
      impostorList.appendChild(div);
    }
  });
};

// ============================
// 🏠 VOLVER AL LOBBY
// ============================
document.getElementById("lobbyBtn").onclick = () => {
  const mode = localStorage.getItem("gameMode");

  if (mode === "custom") {
    location.href = "nueva.html";
  } else {
    location.href = "lobi.html";
  }
};

// ============================
// 🔄 REINICIAR PARTIDA
// ============================
document.getElementById("restartBtn").onclick = () => {
  // elegir palabra NUEVA
  const base = SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];
  const hint = base.hints[Math.floor(Math.random() * base.hints.length)];

  localStorage.setItem("word", JSON.stringify({
    word: base.word,
    hint
  }));

  location.href = "palabra.html";
};
