import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeRole, isTrainer } from '../utils/auth.ts';
import api from '../services/api.ts';

interface Clase {
  id?: number;
  ID?: number;
  nombre_entrenador: string;
  email_entrenador: string;
  nombre_clase: string;
  duracion: number | string;
  fecha_horario_al_que_va: string;
}

const ClasesProgramadas: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);
  const [clases, setClases] = useState<Clase[]>([]);
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);
  
  // Form fields
  const [entrenador, setEntrenador] = useState('');
  const [emailEntrenador, setEmailEntrenador] = useState('');
  const [nombreClase, setNombreClase] = useState('');
  const [duracion, setDuracion] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    loadClases();
  }, [navigate]);

  const loadClases = async () => {
    try {
      // Intentar obtener las clases desde la API
      const response = await api.get('/clasesProgramadas');
      console.debug('loadClases response:', response.status, response.data);

      // Aceptar varias formas de respuesta: { clases_programadas: [...] } o directamente array
      const data = response.data;
      if (Array.isArray(data)) {
        setClases(data as Clase[]);
      } else if (data && Array.isArray(data.clases_programadas)) {
        setClases(data.clases_programadas as Clase[]);
      } else if (data && Array.isArray(data.results)) {
        setClases(data.results as Clase[]);
      } else {
        // Si la respuesta no contiene clases, dejar vacío e informar
        console.warn('loadClases: estructura de respuesta inesperada', data);
        setClases([]);
      }
    } catch (error) {
      console.error('Error loading clases:', error);
      setClases([]);
    }
  };

  const handleAddClass = async () => {
    if (!entrenador || !emailEntrenador || !nombreClase || !duracion || !fecha) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Validar que el entrenador existe y tiene rol de entrenador
    try {
      const usuariosResponse = await api.get('/usuarios/registrados');
      const usuarios = usuariosResponse.data.usuarios || usuariosResponse.data;
      
      const trainerExists = usuarios.find((u: any) => 
        (u.Email === emailEntrenador) && 
        (normalizeRole(u.Rol) === 'entrenador' || normalizeRole(u.Rol) === 'admin')
      );

      if (!trainerExists) {
        alert('El email ingresado no corresponde a un entrenador registrado');
        return;
      }

      // Enviar datos a la API
      await api.post('/clasesProgramadas', {
        nombre_entrenador: entrenador,
        email_entrenador: emailEntrenador,
        nombre_clase: nombreClase,
        duracion: parseFloat(duracion),
        fecha_horario_al_que_va: `${fecha}`
      });

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
    setFecha('');
  };

  const filteredClases = clases.filter(clase =>
    clase.nombre_clase.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clase.nombre_entrenador.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "var(--bg-gradient)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: 'var(--overlay)',
        backdropFilter: 'blur(10px)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/dashboard')}
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
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text)', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
        📅 Clases Programadas
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px', maxWidth: '18000px', margin: '0 auto' }}>
        {/* Search Bar and Add Button */}
  <div style={{ display: 'flex', gap: '25px', marginBottom: '40px' }}>
          <input
            type="text"
            placeholder="Buscar clases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '20px 25px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
              outline: 'none'
            }}
          />
          
          {isTrainer() && (
            <button
              onClick={() => setAddClassModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '24px' }}>➕</span>
              Agregar Nueva Clase
            </button>
          )}
        </div>

        {/* Classes List */}
  <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '40px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', minHeight: '600px' }}>
          {filteredClases.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
              <div style={{ fontSize: '96px', marginBottom: '30px', opacity: 0.3 }}>📚</div>
              <p style={{ color: '#999', fontSize: '22px', textAlign: 'center' }}>
                {searchQuery ? 'No se encontraron clases' : 'No hay clases programadas en este momento'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredClases.map((clase) => {
                const claseId = clase.id || clase.ID || 0;
                const isExpanded = expandedClassId === claseId;
                
                return (
                  <div
                    key={claseId}
                    onClick={() => setExpandedClassId(isExpanded ? null : claseId)}
                    style={{
                      border: '2px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      padding: '30px',
                      transition: 'box-shadow 0.2s, border-color 0.2s, background-color 0.2s',
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? '#f0f5ff' : '#f9f9f9'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    {/* Vista Resumida */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '26px', color: 'var(--accent)', marginBottom: '8px', fontWeight: 600 }}>
                          {clase.nombre_clase}
                        </h3>
                        <p style={{ color: 'var(--muted)', marginBottom: '8px', fontSize: '16px' }}>
                          👤 {clase.nombre_entrenador}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '8px', fontSize: '18px' }}>
                          📅 {new Date(clase.fecha_horario_al_que_va).toLocaleDateString()}
                        </p>
                        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                          {isExpanded ? '▼ Cerrar detalles' : '▶ Ver detalles'}
                        </p>
                      </div>
                    </div>

                    {/* Vista Expandida */}
                    {isExpanded && (
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div>
                            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '5px' }}>Nombre del Entrenador</p>
                            <p style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 600 }}>{clase.nombre_entrenador}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '5px' }}>Email del Entrenador</p>
                            <p style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 600 }}>{clase.email_entrenador}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '5px' }}>Duración</p>
                            <p style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 600 }}>{clase.duracion} minutos</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '5px' }}>Fecha y Hora</p>
                            <p style={{ fontSize: '16px', color: 'var(--text)', fontWeight: 600 }}>
                              {new Date(clase.fecha_horario_al_que_va).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
                  Duración (en minutos)
                </label>
                <input
                  type="number"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  placeholder="Ej: 60"
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
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
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