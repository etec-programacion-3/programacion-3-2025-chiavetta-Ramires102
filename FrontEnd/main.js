// Configuración de la API
const API_URL = 'http://localhost:5000/api';

// Elementos del DOM
const clasesList = document.getElementById('clasesList');
const clasesProgramadasList = document.getElementById('clasesProgramadasList');
const nuevaClaseForm = document.getElementById('nuevaClaseForm');

// Funciones de utilidad
function showError(message, container) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    container.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showLoading(container) {
    container.innerHTML = '<div class="loading">Cargando...</div>';
}

// Funciones para cargar datos
async function cargarClases() {
    try {
        showLoading(clasesList);
        const response = await fetch(`${API_URL}/clase`);
        if (!response.ok) throw new Error('Error al cargar las clases');
        
        const clases = await response.json();
        clasesList.innerHTML = '';
        
        clases.forEach(clase => {
            const claseElement = document.createElement('div');
            claseElement.className = 'clase-item';
            claseElement.innerHTML = `
                <h3>${clase.nombre}</h3>
                <p>${clase.descripcion}</p>
            `;
            clasesList.appendChild(claseElement);
        });
    } catch (error) {
        showError('No se pudieron cargar las clases', clasesList);
    }
}

async function cargarClasesProgramadas() {
    try {
        showLoading(clasesProgramadasList);
        const response = await fetch(`${API_URL}/clasesProgramadas`);
        if (!response.ok) throw new Error('Error al cargar las clases programadas');
        
        const clasesProgramadas = await response.json();
        clasesProgramadasList.innerHTML = '';
        
        clasesProgramadas.forEach(clase => {
            const claseElement = document.createElement('div');
            claseElement.className = 'clase-item';
            claseElement.innerHTML = `
                <h3>${clase.nombre}</h3>
                <p>Fecha: ${new Date(clase.fecha).toLocaleDateString()}</p>
                <p>Hora: ${clase.hora}</p>
            `;
            clasesProgramadasList.appendChild(claseElement);
        });
    } catch (error) {
        showError('No se pudieron cargar las clases programadas', clasesProgramadasList);
    }
}

// Manejador del formulario para agregar nuevas clases
nuevaClaseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombreClase = document.getElementById('nombreClase').value;
    const descripcion = document.getElementById('descripcion').value;
    
    try {
        const response = await fetch(`${API_URL}/clase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombreClase,
                descripcion: descripcion
            })
        });
        
        if (!response.ok) throw new Error('Error al crear la clase');
        
        await cargarClases(); // Recargar la lista de clases
        nuevaClaseForm.reset(); // Limpiar el formulario
    } catch (error) {
        showError('No se pudo crear la clase', nuevaClaseForm);
    }
});

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarClases();
    cargarClasesProgramadas();
});
