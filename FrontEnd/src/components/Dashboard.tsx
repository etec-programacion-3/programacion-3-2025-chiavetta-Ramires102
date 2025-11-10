import React, { useState, useEffect } from 'react';
import { authUtils } from '../utils/auth.ts';
import { ExerciseCategory } from '../types';
import api, { authService } from '../services/api.ts';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>(() => {
    const savedImage = authUtils.getProfileImageUrl();
    if (savedImage) {
      // Construir URL completa desde la ruta relativa guardada
      const fullUrl = `${api.defaults.baseURL}${savedImage}`;
      return `${fullUrl}?t=${new Date().getTime()}`;
    }
    return `${api.defaults.baseURL}/static/default-profile.png?t=${new Date().getTime()}`;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateField, setUpdateField] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      window.location.href = '/';
      return;
    }

    try {
      const response = await api.get(`/usuarios/${userId}`);
      const user = response.data.usuario;
      
      setUserName(user.Nombre);
      setUserEmail(user.Email);
      setUserRole(user.Rol);
      // Construir URL de imagen
      let imageUrl = '';
      if (user.imagen_perfil) {
        imageUrl = `${api.defaults.baseURL}${user.imagen_perfil}`;
      } else {
        imageUrl = `${api.defaults.baseURL}/static/default-profile.png`;
      }

      // Agregar timestamp para evitar cache
      const timestamp = new Date().getTime();
      const finalImageUrl = `${imageUrl}?t=${timestamp}`;

  // Guardar en localStorage la ruta relativa (como devuelve el backend)
  // El backend devuelve algo como: /imagen_perfil/user_1.png
  authUtils.setProfileImageUrl(user.imagen_perfil || '');

  // Actualizar estado con timestamp (URL completa)
  setProfileImage(finalImageUrl);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const userId = localStorage.getItem('userId');
  if (!userId) return;

  console.log('🔵 1. Archivo seleccionado:', file.name);

  try {
    const imageUrl = await authService.uploadProfileImage(parseInt(userId), file);
    console.log('🟢 2. Respuesta del backend (imageUrl):', imageUrl);
    
  const fullImageUrl = `${api.defaults.baseURL}${imageUrl}`;
  console.log('🟡 3. URL completa construida:', fullImageUrl);
    
  // Guardar la ruta relativa que devuelve el backend (no la URL completa)
  authUtils.setProfileImageUrl(imageUrl);
  console.log('🟠 4. Guardado en localStorage (ruta relativa):', authUtils.getProfileImageUrl());
    
    const timestamp = new Date().getTime();
    const finalUrl = `${fullImageUrl}?t=${timestamp}`;
    console.log('🔴 5. URL final con timestamp:', finalUrl);
    
    setProfileImage(finalUrl);
    console.log('🟣 6. Estado actualizado');
    
  } catch (error) {
    console.error('❌ Error:', error);
    alert('Error al subir la imagen');
    await loadUserData();
  }
  };

  const handleUpdateField = (field: string) => {
    setUpdateField(field);
    setCurrentPassword('');
    setNewValue('');
    setUpdateModalOpen(true);
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      await authService.deleteUser(parseInt(userId));
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error al eliminar la cuenta');
    }
  };

  const handleVerifyPassword = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !currentPassword) return;

    try {
      const isValid = await authService.verifyPassword(parseInt(userId), { contrasena: currentPassword });
      if (isValid) {
        setUpdateModalOpen(true);
      } else {
        alert('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('Error al verificar la contraseña');
    }
  };

  const handleUpdateValue = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !newValue) return;

    try {
      await authService.updateUser(parseInt(userId), { [updateField]: newValue });
      await loadUserData();
      setUpdateModalOpen(false);
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error updating value:', error);
      alert('Error al actualizar los datos');
    }
  };

  const handleLogout = () => {
    authUtils.clearAll();
    window.location.reload();
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const exerciseCategories: ExerciseCategory[] = [
    {
      id: 'upper',
      title: 'Ejercicios Parte Superior del Cuerpo',
      exercises: [
        {
          id: 1,
          title: 'Press de Banca',
          description: 'Ejercicio fundamental para desarrollar el pecho, hombros y tríceps. Acuéstate en un banco plano, agarra la barra con las manos separadas a la altura de los hombros y bájala controladamente hasta el pecho. Empuja hacia arriba hasta extender completamente los brazos.',
          videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
          category: 'upper'
        },
        {
          id: 2,
          title: 'Dominadas',
          description: 'Excelente para desarrollar la espalda y bíceps. Cuélgate de una barra con las palmas hacia adelante, tira de tu cuerpo hacia arriba hasta que tu barbilla supere la barra. Baja controladamente.',
          videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
          category: 'upper'
        }
      ]
    },
    {
      id: 'lower',
      title: 'Ejercicios Parte Inferior del Cuerpo',
      exercises: [
        {
          id: 3,
          title: 'Sentadillas',
          description: 'El rey de los ejercicios para piernas. Trabaja cuádriceps, glúteos e isquiotibiales. Coloca la barra sobre los hombros, baja flexionando las rodillas hasta que los muslos estén paralelos al suelo y sube.',
          videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
          category: 'lower'
        },
        {
          id: 4,
          title: 'Peso Muerto',
          description: 'Ejercicio compuesto que trabaja toda la cadena posterior. Con la espalda recta, levanta la barra del suelo extendiendo las caderas y rodillas simultáneamente hasta estar completamente erguido.',
          videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
          category: 'lower'
        }
      ]
    },
    {
      id: 'abs',
      title: 'Ejercicios de Abdomen',
      exercises: [
        {
          id: 5,
          title: 'Plancha',
          description: 'Ejercicio isométrico fundamental para el core. Apóyate sobre los antebrazos y puntas de los pies, mantén el cuerpo recto como una tabla. Contrae el abdomen y mantén la posición.',
          videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
          category: 'abs'
        },
        {
          id: 6,
          title: 'Crunches',
          description: 'Clásico ejercicio para abdominales. Acostado boca arriba con rodillas flexionadas, coloca las manos detrás de la cabeza y eleva el torso contrayendo los abdominales. Baja controladamente.',
          videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU',
          category: 'abs'
        }
      ]
    }
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh" }}>
      {/* Overlay */}
      {(sidebarOpen || accountModalOpen) && (
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
            setSidebarOpen(false);
            setAccountModalOpen(false);
          }}
        />
      )}

      {/* Account Modal */}
      {accountModalOpen && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          zIndex: 1001,
          maxWidth: '500px',
          width: '90%'
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
            onClick={() => setAccountModalOpen(false)}
          >
            ×
          </button>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#667eea', marginBottom: '25px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
            👤 Mi Cuenta
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' }}>
            <img 
            src={profileImage} 
            alt="Perfil" 
            data-profile-image="true"
            style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #667eea', marginBottom: '10px', objectFit: 'cover' }} 
          />
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfileImageChange}
            />
            <button
              onClick={() => document.getElementById('imageInput')?.click()}
              style={{ background: '#4ade80', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cambiar Imagen
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed #eee' }}>
            <span style={{ fontWeight: 600, color: '#333', width: '120px' }}>Nombre:</span>
            <span style={{ flexGrow: 1, color: '#666', marginRight: '15px' }}>{userName}</span>
            <button
              onClick={() => handleUpdateField('nombre')}
              style={{ background: '#667eea', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Actualizar
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed #eee' }}>
            <span style={{ fontWeight: 600, color: '#333', width: '120px' }}>Email:</span>
            <span style={{ flexGrow: 1, color: '#666', marginRight: '15px' }}>{userEmail}</span>
            <button
              onClick={() => handleUpdateField('email')}
              style={{ background: '#667eea', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Actualizar
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed #eee' }}>
            <span style={{ fontWeight: 600, color: '#333', width: '120px' }}>Contraseña:</span>
            <span style={{ flexGrow: 1, color: '#666', marginRight: '15px' }}>••••••••</span>
            <button
              onClick={() => handleUpdateField('contrasena')}
              style={{ background: '#667eea', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              Actualizar
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: 'none' }}>
            <span style={{ fontWeight: 600, color: '#333', width: '120px' }}>Rol:</span>
            <span style={{ flexGrow: 1, color: '#666', marginRight: '15px' }}>{userRole}</span>
          </div>

          <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
            <button style={{ background: '#f97316', color: 'white', width: '100%', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>
              👑 Soy Admin
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              style={{ background: '#ef4444', color: 'white', width: '100%', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 }}
            >
              🗑️ Borrar Cuenta
            </button>
          </div>

          {/* Modal de Actualización */}
          {updateModalOpen && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1002,
              width: '90%',
              maxWidth: '400px'
            }}>
              <h3 style={{ marginBottom: '20px' }}>
                {currentPassword ? 'Nuevo Valor' : 'Verificar Contraseña'}
              </h3>
              
              {!currentPassword ? (
                <>
                  <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      onClick={() => setUpdateModalOpen(false)}
                      style={{
                        padding: '8px 16px',
                        background: '#e0e0e0',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleVerifyPassword}
                      style={{
                        padding: '8px 16px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Verificar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type={updateField === 'contrasena' ? 'password' : 'text'}
                    placeholder={`Nuevo ${updateField}`}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      onClick={() => {
                        setCurrentPassword('');
                        setNewValue('');
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#e0e0e0',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleUpdateValue}
                      style={{
                        padding: '8px 16px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Actualizar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Modal de Confirmación de Borrado */}
          {deleteModalOpen && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 1002,
              width: '90%',
              maxWidth: '400px'
            }}>
              <h3 style={{ marginBottom: '20px' }}>¿Estás seguro?</h3>
              <p style={{ marginBottom: '20px' }}>Esta acción no se puede deshacer.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#e0e0e0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    padding: '8px 16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
          💪 TecnoGym
        </div>
        <div
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }}
          onClick={() => setSidebarOpen(true)}
        >
          <img 
            src={profileImage} 
            alt="Perfil" 
            data-profile-image="true"
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        </div>
      </div>

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        right: sidebarOpen ? '0' : '-400px',
        top: '0',
        width: '400px',
        height: '100vh',
        background: 'white',
        boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.2)',
        transition: 'right 0.3s ease',
        zIndex: 1000,
        overflowY: 'auto'
      }}>
        <button
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            cursor: 'pointer'
          }}
          onClick={() => setSidebarOpen(false)}
        >
          ×
        </button>

        <div style={{
          position: 'relative',
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '20px 0'
          }}>
            <img 
              src={profileImage} 
              alt="Perfil" 
              data-profile-image="true"
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', margin: '0 auto' }} 
            />
            <div style={{ marginTop: '12px', color: 'white', fontWeight: 600, fontSize: '18px', textAlign: 'center', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </div>
          </div>
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ padding: '15px', margin: '10px 0', background: '#f5f5f5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => { setAccountModalOpen(true); setSidebarOpen(false); }}>
            <span style={{ fontSize: '24px' }}>👤</span>
            <span>Mi Cuenta</span>
          </div>

          <div style={{ padding: '15px', margin: '10px 0', background: '#f5f5f5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={handleLogout}>
            <span style={{ fontSize: '24px' }}>🚪</span>
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {exerciseCategories.map((category) => (
            <div key={category.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'opacity 0.2s'
                }}
                onClick={() => toggleCategory(category.id)}
              >
                <span style={{ fontSize: '22px', fontWeight: 600 }}>← {category.title}</span>
                <span style={{ fontSize: '20px', transition: 'transform 0.3s' }}>
                  {expandedCategories.has(category.id) ? '▼' : '▶'}
                </span>
              </div>
              <div style={{
                maxHeight: expandedCategories.has(category.id) ? '600px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}>
                {category.exercises.map((exercise) => (
                  <div key={exercise.id} style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', color: '#333' }}>
                      {exercise.title}
                    </div>
                    <iframe
                      title={`Video de ${exercise.title}`}
                      style={{ width: '100%', maxWidth: '560px', height: '315px', borderRadius: '8px', marginBottom: '10px' }}
                      src={exercise.videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <p style={{ color: '#666', lineHeight: '1.6' }}>
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;