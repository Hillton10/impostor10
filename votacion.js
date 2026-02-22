// 📦 DATOS BASE
let allPlayers = JSON.parse(localStorage.getItem("players")) || [];
const impostorNames = JSON.parse(localStorage.getItem("impostorNames")) || [];

const limit = impostorNames.length;

// 🔀 FILTRAR SOLO SELECCIONADOS
const players = allPlayers.filter(p => p.selected);

let selected = [];

const list = document.getElementById("votes");
const voteBtn = document.getElementById("voteBtn");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("resultText");
const impostorList = document.getElementById("impostorList");


// ============================
// MOSTRAR JUGADORES
// ============================
players.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "vote-player";
    div.innerHTML = `<img src="${p.img}"><span>${p.name}</span>`;
    div.onclick = () => toggle(i, div);
    list.appendChild(div);
});


// ============================
// SELECCIONAR
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
// VOTAR
// ============================
voteBtn.onclick = () => {

    const selectedNames = selected.map(i => players[i].name);

    const victoria = impostorNames.every(name =>
        selectedNames.includes(name)
    );

    list.style.display = "none";
    voteBtn.style.display = "none";
    resultBox.style.display = "block";

    resultText.classList.remove("victoria", "derrota");

    if (victoria) {
        resultText.classList.add("victoria");
        resultText.innerHTML = "VICTORIA ✅";
    } else {
        resultText.classList.add("derrota");
        resultText.innerHTML = "DERROTA 😈";
    }

    // Mostrar impostores reales
    impostorList.innerHTML = "";

    impostorNames.forEach(name => {
        const p = players.find(pl => pl.name === name);
        if (p) {
            const div = document.createElement("div");
            div.className = "vote-player selected";
            div.innerHTML = `<img src="${p.img}"><span>${p.name}</span>`;
            impostorList.appendChild(div);
        }
    });
};


// ============================
// VOLVER AL LOBBY
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
// REINICIAR PARTIDA
// ============================
document.getElementById("restartBtn").onclick = () => {

    const base = SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)];
    const hint = base.hints[Math.floor(Math.random() * base.hints.length)];

    localStorage.setItem("word", JSON.stringify({
        word: base.word,
        hint
    }));

    location.href = "palabra.html";
};
