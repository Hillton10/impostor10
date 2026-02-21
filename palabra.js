// 📦 DATOS BASE
let allPlayers = JSON.parse(localStorage.getItem("players")) || [];
const impostorsCount = +localStorage.getItem("impostors") || 1;
const word = JSON.parse(localStorage.getItem("word")) || {word: "Error", hint: "No hay palabra"};

let players = allPlayers.filter(p => p.selected);

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle(players);

// 🎭 ASIGNACIÓN DE ROLES
let roleHistory = JSON.parse(sessionStorage.getItem("roleHistory")) || {};
players.forEach(p => { if (roleHistory[p.name] === undefined) roleHistory[p.name] = 0; });

let impostors = [];
while (impostors.length < impostorsCount) {
    const minCount = Math.min(...players.map(p => roleHistory[p.name]));
    const candidates = players.map((p, i) => ({ p, i })).filter(obj => roleHistory[obj.p.name] === minCount && !impostors.includes(obj.i));
    if (candidates.length === 0) break;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    impostors.push(chosen.i);
    roleHistory[chosen.p.name]++;
}
sessionStorage.setItem("roleHistory", JSON.stringify(roleHistory));

// ELEMENTOS
const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const secret = document.getElementById("secret");
const swipe = document.getElementById("swipeBox");
const btn = document.getElementById("nextBtn");

let index = 0;
let startY = 0;
let dragging = false;

function showPlayer() {
    const p = players[index];
    avatar.src = p.img;
    nameEl.textContent = p.name;
    secret.style.display = "none";
    swipe.style.transition = "none";
    swipe.style.transform = "translateY(0)";
    swipe.style.opacity = "1";
    swipe.style.display = "flex";
    btn.innerHTML = (index === players.length - 1) ? 'Iniciar <i class="fas fa-play"></i>' : 'Siguiente <i class="fas fa-chevron-right"></i>';
}

// 📱 LÓGICA ANTI-TEMBLOR (MOVIMIENTO SUAVE)
function handleStart(y) {
    startY = y;
    dragging = true;
    swipe.style.transition = "none";
}

function handleMove(currentY) {
    if (!dragging) return;
    let diff = startY - currentY;
    
    if (diff > 0) { // Deslizar arriba
        let move = Math.min(diff, 130);
        
        // Usar requestAnimationFrame para eliminar el pestañeo
        requestAnimationFrame(() => {
            swipe.style.transform = `translateY(-${move}px)`;
            swipe.style.opacity = (1 - move / 130);
            
            if (move > 60) {
                if (secret.style.display !== "block") {
                    secret.style.display = "block";
                    if (impostors.includes(index)) {
                        secret.innerHTML = `<span style="color:#ff4757">IMPOSTOR</span><br><small style="font-size:1rem; color:#fff">${word.hint}</small>`;
                    } else {
                        secret.textContent = word.word;
                    }
                }
            }
        });
    }
}

function handleEnd() {
    if (!dragging) return;
    dragging = false;
    // Transición elástica al volver
    swipe.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s";
    swipe.style.transform = "translateY(0)";
    swipe.style.opacity = "1";
    setTimeout(() => { if (!dragging) secret.style.display = "none"; }, 300);
}

// Registro de Eventos
swipe.addEventListener("mousedown", e => handleStart(e.clientY));
document.addEventListener("mousemove", e => handleMove(e.clientY));
document.addEventListener("mouseup", handleEnd);

swipe.addEventListener("touchstart", e => handleStart(e.touches[0].clientY));
document.addEventListener("touchmove", e => handleMove(e.touches[0].clientY), {passive: true});
swipe.addEventListener("touchend", handleEnd);

// BOTÓN ACCIÓN
btn.onclick = () => {
    if (btn.innerText.includes("Siguiente")) {
        index++;
        showPlayer();
    } else if (btn.innerText.includes("Iniciar")) {
        startFinalCountdown();
    } else {
        location.href = "votacion.html";
    }
};

function startFinalCountdown() {
    const starter = players[Math.floor(Math.random() * players.length)];
    const side = Math.random() < 0.5 ? "DERECHA" : "IZQUIERDA";
    
    avatar.src = starter.img;
    nameEl.textContent = starter.name;
    swipe.style.display = "none";
    secret.style.display = "block";
    secret.innerHTML = `<small style="color:#fff; font-size:1rem">EMPIEZA POR LA</small><br>${side}`;
    btn.style.display = "none";

    const countdownEl = document.getElementById("countdown");
    countdownEl.style.display = "block";
    let time = 30;
    const interval = setInterval(() => {
        time--;
        countdownEl.textContent = time;
        if (time <= 0) {
            clearInterval(interval);
            btn.style.display = "block";
            btn.textContent = "Ir a Votar";
        }
    }, 1000);
}

showPlayer();
