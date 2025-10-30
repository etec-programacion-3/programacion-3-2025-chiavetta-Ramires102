// API Configuration
const API_URL = 'http://localhost:5000/api';

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
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar el token
            localStorage.setItem('token', data.token);
            showMessage('loginMessage', '¡Login exitoso! Redirigiendo...', 'success');
            
            // Redirigir al usuario a la página principal después de 1.5 segundos
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
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
        usuario: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        edad: parseInt(document.getElementById('registerAge').value),
        password: document.getElementById('registerPassword').value,
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
    const token = localStorage.getItem('token');
    if (token) {
        // Si hay un token, redirigir al dashboard
        window.location.href = '/dashboard.html';
    }
});
