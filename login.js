document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Obtener valores
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');

    // 2. Base de datos manual (puedes agregar más aquí)
    const validUsers = [
        { usuario: "eguez", clave: "1010" }
    ];

    // 3. Validación
    const found = validUsers.find(u => u.usuario === user && u.clave === pass);

    if (found) {
        // Efecto visual de éxito
        errorMsg.style.color = "#00ffcc";
        errorMsg.innerText = "Acceso concedido...";
        
        setTimeout(() => {
            window.location.href = "intro.html"; // Entra a la intro
        }, 800);
    } else {
        // Efecto de error
        errorMsg.innerText = "Credenciales incorrectas";
        
        // Animación de sacudida
        const card = document.querySelector('.login-card');
        card.style.animation = 'none';
        card.offsetHeight; /* trigger reflow */
        card.style.animation = 'shake 0.4s';
    }
});

// CSS extra para la sacudida de error (añadir al login.css si quieres)
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}`;
document.head.appendChild(style);