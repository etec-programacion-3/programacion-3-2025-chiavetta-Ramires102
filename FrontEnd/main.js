// API Configuration
const API_URL = 'http://localhost:5000';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Mostrar formulario de registro
function showRegister() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    clearMessages();
}

// Mostrar formulario de login
function showLogin() {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    clearMessages();
}

// Limpiar mensajes
function clearMessages() {
    document.getElementById('loginMessage').innerHTML = '';
    document.getElementById('registerMessage').innerHTML = '';
}

// Mostrar mensaje
function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.innerHTML = `<div class="message ${type}">${message}</div>`;
}

// Mostrar pantalla azul completa después del login exitoso
function showBlueScreen(username) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'blueScreenOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = '#0b57d0';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.color = 'white';
    overlay.style.flexDirection = 'column';

    const title = document.createElement('h1');
    title.textContent = `Bienvenido, ${username}`;
    title.style.fontSize = '36px';
    title.style.marginBottom = '12px';

    const text = document.createElement('p');
    text.textContent = 'Has iniciado sesión correctamente.';
    text.style.fontSize = '18px';
    text.style.marginBottom = '24px';

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.style.padding = '10px 18px';
    logoutBtn.style.border = 'none';
    logoutBtn.style.borderRadius = '8px';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.style.background = '#ff4757';
    logoutBtn.style.color = 'white';
    logoutBtn.style.fontWeight = '600';

    logoutBtn.addEventListener('click', () => {
        // Limpiar token y volver al login
        localStorage.removeItem('token');
        document.body.removeChild(overlay);
        showLogin();
    });

    overlay.appendChild(title);
    overlay.appendChild(text);
    overlay.appendChild(logoutBtn);

    // Eliminar cualquier formulario visible y añadir overlay
    document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
    document.body.appendChild(overlay);
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showMessage('loginMessage', 'Iniciando sesión...', 'info');
        
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email, 
                contrasena: password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar el token y el email en cuentas previas
            localStorage.setItem('token', data.token);
            let prev = JSON.parse(localStorage.getItem('prevAccounts') || '[]');
            if (!prev.includes(email)) prev.push(email);
            localStorage.setItem('prevAccounts', JSON.stringify(prev));
            localStorage.setItem('lastEmail', email);
            showMessage('loginMessage', '¡Login exitoso! Redirigiendo al dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        } else {
            showMessage('loginMessage', data.detail || 'Error al iniciar sesión', 'error');
        }
    } catch (error) {
        showMessage('loginMessage', 'Error de conexión con el servidor', 'error');
        console.error('Error:', error);
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    
    const userData = {
        nombre: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        edad: parseInt(document.getElementById('registerAge').value),
        contrasena: document.getElementById('registerPassword').value,
        rol: 'usuario' // Asignado automáticamente
    };
    
    try {
        showMessage('registerMessage', 'Procesando registro...', 'info');
        
        const response = await fetch(`${API_URL}/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('registerMessage', '¡Registro exitoso! Ya puedes iniciar sesión', 'success');
            
            // Limpiar formulario
            document.getElementById('registerName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerAge').value = '';
            document.getElementById('registerPassword').value = '';
            
            // Volver al login después de 2 segundos
            setTimeout(() => {
                showLogin();
                // Pre-llenar el email en el formulario de login
                document.getElementById('loginEmail').value = userData.email;
            }, 2000);
        } else {
            showMessage('registerMessage', data.detail || 'Error al registrarse', 'error');
        }
    } catch (error) {
        showMessage('registerMessage', 'Error de conexión con el servidor', 'error');
        console.error('Error:', error);
    }
}

// Comprobar si hay un token al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar cuentas previas debajo del login
    const prev = JSON.parse(localStorage.getItem('prevAccounts') || '[]');
    const container = document.getElementById('previousAccounts');
    if (container && prev.length) {
        container.innerHTML = '<div style="font-size:15px;color:#555;margin-bottom:8px;">Cuentas previas:</div>' +
            prev.map(email => `<div style="background:#f5f5f5;padding:8px 12px;border-radius:6px;margin-bottom:6px;">${email}</div>`).join('');
    }
});
