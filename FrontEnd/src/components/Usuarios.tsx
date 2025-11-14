import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoleDisplayText } from '../utils/auth.ts';
import api from '../services/api.ts';

interface Usuario {
  ID: number;
  Nombre: string;
  Email: string;
  Edad: number;
  Rol: string;
}

const Usuarios: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Estados para edición
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    loadUsuarios();
  }, [navigate]);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios/registrados');
      const data = response.data;
      
      // Aceptar varias formas de respuesta
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else if (data && Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else if (data && Array.isArray(data.results)) {
        setUsuarios(data.results);
      } else {
        console.warn('Estructura de respuesta inesperada:', data);
        setUsuarios([]);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (field: string) => {
    if (selectedUser) {
      const fieldMap: { [key: string]: keyof Usuario } = {
        nombre: 'Nombre',
        email: 'Email',
        edad: 'Edad',
        rol: 'Rol'
      };
      
      const dbField = fieldMap[field] as keyof Usuario;
      setEditField(field);
      setEditValue(selectedUser[dbField]?.toString() || '');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedUser || !editValue) {
      alert('Por favor completa el campo');
      return;
    }

    try {
      const updateData: any = {};
      
      if (editField === 'nombre') updateData.nombre = editValue;
      else if (editField === 'email') updateData.email = editValue;
      else if (editField === 'edad') updateData.edad = parseInt(editValue);
      else if (editField === 'rol') updateData.rol = editValue;

      await api.put(`/usuario/${selectedUser.ID}`, updateData);
      
      // Actualizar el usuario seleccionado en memoria
      const updatedUser = { ...selectedUser };
      if (editField === 'nombre') updatedUser.Nombre = editValue;
      else if (editField === 'email') updatedUser.Email = editValue;
      else if (editField === 'edad') updatedUser.Edad = parseInt(editValue);
      else if (editField === 'rol') updatedUser.Rol = editValue;
      
      setSelectedUser(updatedUser);
      
      // Actualizar la lista de usuarios
      setUsuarios(usuarios.map(u => 
        u.ID === selectedUser.ID ? updatedUser : u
      ));
      
      setEditField('');
      setEditValue('');
      alert('Usuario actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar el usuario');
    }
  };

  const getRoleDisplay = (rol: string) => {
    return getRoleDisplayText(rol);
  };

  const filteredUsuarios = usuarios.filter(user =>
    user.Nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.Email.toLowerCase().includes(searchQuery.toLowerCase())
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
            👥 Usuarios
          </div>
        </div>
      </div>

      {/* Main Content */}
  <div style={{ padding: '60px', maxWidth: '1800px', margin: '0 auto' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '40px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '20px 25px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
              outline: 'none'
            }}
          />
        </div>

        {/* Users List */}
  <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '40px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', minHeight: '600px' }}>
          {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
              <p style={{ color: 'var(--accent)', fontSize: '18px' }}>Cargando usuarios...</p>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
              <div style={{ fontSize: '96px', marginBottom: '30px', opacity: 0.3 }}>👤</div>
              <p style={{ color: 'var(--muted)', fontSize: '22px', textAlign: 'center' }}>
                {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredUsuarios.map((usuario) => (
                <div
                  key={usuario.ID}
                  onClick={() => {
                    setSelectedUser(usuario);
                    setEditModalOpen(true);
                  }}
                  style={{
                    border: '2px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '30px',
                    transition: 'box-shadow 0.2s, border-color 0.2s, background-color 0.2s',
                    cursor: 'pointer',
                    backgroundColor: 'var(--card-bg)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '22px', color: '#333', marginBottom: '15px', fontWeight: 600 }}>
                        {usuario.Nombre}
                      </h3>
                      <p style={{ color: '#666', marginBottom: '8px', fontSize: '16px' }}>
                        📧 {usuario.Email}
                      </p>
                      <p style={{ color: '#666', marginBottom: '8px', fontSize: '16px' }}>
                        🎂 {usuario.Edad} años
                      </p>
                      <p style={{ color: '#667eea', fontWeight: 600, fontSize: '16px' }}>
                        {getRoleDisplay(usuario.Rol)}
                      </p>
                    </div>
                    <div style={{ fontSize: '32px', opacity: 0.3 }}>→</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editModalOpen && selectedUser && (
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
            onClick={() => {
              setEditModalOpen(false);
              setSelectedUser(null);
              setEditField('');
              setEditValue('');
            }}
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
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
              onClick={() => {
                setEditModalOpen(false);
                setSelectedUser(null);
                setEditField('');
                setEditValue('');
              }}
            >
              ×
            </button>

            <h2 style={{ fontSize: '28px', color: '#667eea', marginBottom: '30px', fontWeight: 600 }}>
              Editar Usuario
            </h2>

            {!editField ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>Nombre</p>
                    <p style={{ fontSize: '16px', color: '#333', fontWeight: 600 }}>{selectedUser.Nombre}</p>
                  </div>
                  <button
                    onClick={() => handleEditUser('nombre')}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Editar
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>Email</p>
                    <p style={{ fontSize: '16px', color: '#333', fontWeight: 600 }}>{selectedUser.Email}</p>
                  </div>
                  <button
                    onClick={() => handleEditUser('email')}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Editar
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>Edad</p>
                    <p style={{ fontSize: '16px', color: '#333', fontWeight: 600 }}>{selectedUser.Edad}</p>
                  </div>
                  <button
                    onClick={() => handleEditUser('edad')}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Editar
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>Rol</p>
                    <p style={{ fontSize: '16px', color: '#333', fontWeight: 600 }}>{getRoleDisplay(selectedUser.Rol)}</p>
                  </div>
                  <button
                    onClick={() => handleEditUser('rol')}
                    style={{
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Editar
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                  <button
                    onClick={() => {
                      setEditModalOpen(false);
                      setSelectedUser(null);
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
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '14px', color: '#999', marginBottom: '10px', textTransform: 'capitalize' }}>
                  Nuevo {editField === 'rol' ? 'rol' : editField}
                </p>
                {editField === 'rol' ? (
                  <select
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginBottom: '20px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  >
                    <option value="Usuario">Usuario</option>
                    <option value="!Entrenador!">Entrenador</option>
                    <option value="%Admin%">Admin</option>
                  </select>
                ) : (
                  <input
                    type={editField === 'edad' ? 'number' : editField === 'email' ? 'email' : 'text'}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginBottom: '20px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                )}
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={() => {
                      setEditField('');
                      setEditValue('');
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
                    onClick={handleSaveEdit}
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
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Usuarios;
