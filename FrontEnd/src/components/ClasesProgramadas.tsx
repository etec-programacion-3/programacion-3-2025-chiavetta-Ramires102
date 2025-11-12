import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.ts';

interface Clase {
  id: number;
  entrenador: string;
  email_entrenador: string;
  nombre_clase: string;
  duracion: string;
  horario: string;
  fecha: string;
}

const ClasesProgramadas: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);
  const [clases, setClases] = useState<Clase[]>([]);
  
  // Form fields
  const [entrenador, setEntrenador] = useState('');
  const [emailEntrenador, setEmailEntrenador] = useState('');
  const [nombreClase, setNombreClase] = useState('');
  const [duracion, setDuracion] = useState('');
  const [horario, setHorario] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    loadUserRole();
    loadClases();
  }, []);

  const loadUserRole = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      window.location.href = '/';
      return;
    }

    api.get(`/usuarios/${userId}`)
      .then(response => {
        setUserRole(response.data.usuario.Rol);
      })
      .catch(error => {
        console.error('Error loading user role:', error);
      });
  };

  const loadClases = async () => {
    try {
      // Aquí usarías tu ruta de API para obtener las clases
      // const response = await api.get('/clases');
      // setClases(response.data.clases);
      
      // Por ahora, como ejemplo:
      setClases([]);
    } catch (error) {
      console.error('Error loading clases:', error);
    }
  };

  const handleAddClass = async () => {
    if (!entrenador || !emailEntrenador || !nombreClase || !duracion || !horario || !fecha) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      // Aquí usarías tu ruta de API para crear la clase
      // await api.post('/clases', {
      //   entrenador,
      //   email_entrenador: emailEntrenador,
      //   nombre_clase: nombreClase,
      //   duracion,
      //   horario,
      //   fecha
      // });

      alert('Clase agregada correctamente');
      setAddClassModalOpen(false);
      resetForm();
      loadClases();
    } catch (error) {
      console.error('Error adding class:', error);
      alert('Error al agregar la clase');
    }
  };

  const resetForm = () => {
    setEntrenador('');
    setEmailEntrenador('');
    setNombreClase('');
    setDuracion('');
    setHorario('');
    setFecha('');
  };

  const filteredClases = clases.filter(clase =>
    clase.nombre_clase.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clase.entrenador.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            📅 Clases Programadas
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Search Bar and Add Button */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Buscar clases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '15px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              outline: 'none'
            }}
          />
          
          {userRole === 'Admin' && (
            <button
              onClick={() => setAddClassModalOpen(true)}
              style={{
                background: '#4ade80',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '20px' }}>➕</span>
              Agregar Nueva Clase
            </button>
          )}
        </div>

        {/* Classes List */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', minHeight: '400px' }}>
          {filteredClases.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}>📚</div>
              <p style={{ color: '#999', fontSize: '18px', textAlign: 'center' }}>
                {searchQuery ? 'No se encontraron clases' : 'No hay clases programadas en este momento'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {filteredClases.map((clase) => (
                <div
                  key={clase.id}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', color: '#667eea', marginBottom: '10px', fontWeight: 600 }}>
                        {clase.nombre_clase}
                      </h3>
                      <p style={{ color: '#666', marginBottom: '5px' }}>
                        👤 Entrenador: {clase.entrenador}
                      </p>
                      <p style={{ color: '#666', marginBottom: '5px' }}>
                        📧 {clase.email_entrenador}
                      </p>
                      <p style={{ color: '#666', marginBottom: '5px' }}>
                        ⏱️ Duración: {clase.duracion}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#667eea', fontWeight: 600, marginBottom: '5px' }}>
                        📅 {clase.fecha}
                      </p>
                      <p style={{ color: '#667eea', fontWeight: 600 }}>
                        🕐 {clase.horario}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Class Modal */}
      {addClassModalOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999
            }}
            onClick={() => setAddClassModalOpen(false)}
          />
          
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '500px'
          }}>
            <button
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                color: '#ccc',
                cursor: 'pointer'
              }}
              onClick={() => setAddClassModalOpen(false)}
            >
              ×
            </button>

            <h2 style={{ fontSize: '28px', color: '#667eea', marginBottom: '25px', fontWeight: 600 }}>
              ➕ Agregar Nueva Clase
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 600 }}>
                  Nombre del Entrenador
                </label>
                <input
                  type="text"
                  value={entrenador}
                  onChange={(e) => setEntrenador(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 600 }}>
                  Email del Entrenador
                </label>
                <input
                  type="email"
                  value={emailEntrenador}
                  onChange={(e) => setEmailEntrenador(e.target.value)}
                  placeholder="Ej: juan@example.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 600 }}>
                  Nombre de la Clase
                </label>
                <input
                  type="text"
                  value={nombreClase}
                  onChange={(e) => setNombreClase(e.target.value)}
                  placeholder="Ej: Yoga Avanzado"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 600 }}>
                  Duración
                </label>
                <input
                  type="text"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  placeholder="Ej: 60 minutos"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 600 }}>
                  Horario
                </label>
                <input
                  type="time"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 600 }}>
                  Fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              <button
                onClick={() => {
                  setAddClassModalOpen(false);
                  resetForm();
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e0e0e0',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddClass}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Agregar Clase
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClasesProgramadas;