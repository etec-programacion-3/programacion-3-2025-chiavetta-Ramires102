import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.ts';
import { authUtils, normalizeRole } from '../utils/auth.ts';
import { authService } from '../services/api.ts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('Usuario');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('usuario');
  const [profileImage, setProfileImage] = useState<string>('');
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);
  const [accountDetailsOpen, setAccountDetailsOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [verifyPasswordModalOpen, setVerifyPasswordModalOpen] = useState<boolean>(false);
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [pendingFieldUpdate, setPendingFieldUpdate] = useState<'name' | 'email' | 'password' | null>(null);


  const loadUser = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }

    try {
      const resp = await api.get(`/usuarios/${userId}`);
      const user = resp.data.usuario || resp.data;
      setUserName(user?.Nombre || 'Usuario');
      setUserEmail(user?.Email || '');
      setUserRole(user?.Rol || 'usuario');
      authUtils.setUserRole(user?.Rol || 'usuario');

      const base = api.defaults?.baseURL || '';
      if (user?.imagen_perfil) setProfileImage(`${base}${user.imagen_perfil}`);
      else setProfileImage(`${base}/static/default-profile.png`);
    } catch (err) {
      console.error('Error cargando usuario', err);
    }
  }, [navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const navigateTo = (path: string) => navigate(path);

  const handleLogout = () => {
    authUtils.clearAll();
    window.location.href = '/';
  };

  // helper actions that operate on the current user
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileImageChange = async (file: File | null) => {
    if (!file) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      setIsUploading(true);
      const imagePath = await authService.uploadProfileImage(parseInt(userId), file);
      const base = api.defaults?.baseURL || '';
      const finalUrl = `${base}${imagePath}?t=${Date.now()}`;
      setProfileImage(finalUrl);
      authUtils.setProfileImageUrl(imagePath);
      alert('Imagen de perfil actualizada');
    } catch (err) {
      console.error('Error al subir imagen', err);
      alert('Error al subir imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const confirmed = window.confirm('¿Estás seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      await authService.deleteUser(parseInt(userId));
      authUtils.clearAll();
      window.location.href = '/';
    } catch (err) {
      console.error('Error al eliminar cuenta', err);
      alert('Error al eliminar cuenta');
    }
  };

  const handleMakeAdmin = async () => {
    const ADMIN_PASSWORD = '123456789';
    const attempt = window.prompt('Ingrese la contraseña de administrador:');
    if (attempt !== ADMIN_PASSWORD) {
      alert('Contraseña incorrecta');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      await authService.updateUser(parseInt(userId), { rol: 'admin' });
      authUtils.setUserRole('admin');
      setUserRole('admin');
      alert('Ahora eres admin');
    } catch (err) {
      console.error('Error al asignar admin', err);
      alert('Error al asignar rol admin');
    }
  };

  const handleUpdateField = async (field: 'name' | 'email' | 'password') => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const updateData: any = {};
      
      if (field === 'name' && newName) {
        updateData.nombre = newName;
      } else if (field === 'email' && newEmail) {
        updateData.email = newEmail;
      } else if (field === 'password' && newPassword) {
        updateData.contrasena = newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        alert('Por favor ingresa un nuevo valor');
        return;
      }

      await authService.updateUser(parseInt(userId), updateData);
      
      if (field === 'name' && newName) setUserName(newName);
      if (field === 'email' && newEmail) setUserEmail(newEmail);
      
      setEditingField(null);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      alert('Datos actualizados correctamente');
      loadUser();
    } catch (err) {
      console.error('Error al actualizar datos', err);
      alert('Error al actualizar datos');
    }
  };

  const handleVerifyPasswordForUpdate = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !verifyPassword) {
      alert('Por favor ingresa tu contraseña');
      return;
    }

    try {
      const isValid = await authService.verifyPassword(parseInt(userId), { contrasena: verifyPassword });
      if (!isValid) {
        alert('Contraseña incorrecta');
        setVerifyPassword('');
        return;
      }

      // Si contraseña es correcta, abrimos el campo para editar
      if (pendingFieldUpdate === 'name') {
        setEditingField('name');
        setNewName(userName);
      } else if (pendingFieldUpdate === 'email') {
        setEditingField('email');
        setNewEmail(userEmail);
      } else if (pendingFieldUpdate === 'password') {
        setEditingField('password');
        setNewPassword('');
      }

      setVerifyPasswordModalOpen(false);
      setVerifyPassword('');
      setPendingFieldUpdate(null);
    } catch (err) {
      console.error('Error al verificar contraseña', err);
      alert('Error al verificar contraseña');
    }
  };

  const startFieldUpdate = (field: 'name' | 'email' | 'password') => {
    setPendingFieldUpdate(field);
    setVerifyPasswordModalOpen(true);
  };


  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)', color: 'var(--text)', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <header style={{ padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--overlay)', backdropFilter: 'blur(6px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>Dashboard</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700 }}>{userName}</div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>{normalizeRole(userRole)}</div>
          </div>
          <img 
            src={profileImage} 
            alt="perfil" 
            onClick={() => setAccountModalOpen(true)}
            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.06)', cursor: 'pointer' }} 
          />
        </div>
      </header>

      <main style={{ padding: '40px 500px', maxWidth: 1800, width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--card-bg)', padding: 20, borderRadius: 12, flex: '1', minWidth: 320, maxWidth: 400 }}>
            <h2 style={{ color: 'var(--accent)', marginTop: 0 }}>Clases Programadas</h2>
            <p style={{ color: 'var(--muted)' }}>Ver y administrar las clases disponibles.</p>
            <button onClick={() => navigateTo('/clases-programadas')} className="btn" style={{ marginTop: 12 }}>Ir</button>
          </div>

          <div style={{ background: 'var(--card-bg)', padding: 20, borderRadius: 12, flex: '1', minWidth: 320, maxWidth: 400 }}>
            <h2 style={{ color: 'var(--accent)', marginTop: 0 }}>Ejercicios y Clases</h2>
            <p style={{ color: 'var(--muted)' }}>Explorar ejercicios y contenidos.</p>
            <button onClick={() => navigateTo('/ejercicios-y-clases')} className="btn" style={{ marginTop: 12 }}>Ir</button>
          </div>
        </div>
      </main>

      {/* Right slide-over panel for account actions */}
      {accountModalOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 990 }} onClick={() => setAccountModalOpen(false)} />
          <aside style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: 400, maxWidth: '90%', background: 'var(--card-bg)', boxShadow: '-8px 0 30px rgba(0,0,0,0.4)', zIndex: 1000, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setAccountModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
            </div>

            {/* Profile image centered */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: -10 }}>
              <img src={profileImage} alt="perfil" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.1)' }} />
            </div>

            {/* User name with role icon */}
            <div style={{ textAlign: 'center', marginTop: -8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 20, color: normalizeRole(userRole) === 'admin' ? '#FFD700' : 'var(--text)' }}>
                  {userName}
                </span>
                {normalizeRole(userRole) === 'admin' && <span style={{ fontSize: 20 }}>👑</span>}
                {normalizeRole(userRole) === 'entrenador' && <span style={{ fontSize: 20 }}>💪</span>}
              </div>
            </div>

            {/* Welcome message */}
            <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ margin: 0, color: 'var(--text)', fontSize: 18 }}>Bienvenido, {userName}</h3>
              <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14 }}>Email: {userEmail}</p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn" onClick={() => { setAccountModalOpen(false); setAccountDetailsOpen(true); }}>Mi cuenta</button>
              <button className="btn" onClick={() => { setAccountModalOpen(false); navigateTo('/usuarios'); }} style={{ display: normalizeRole(userRole) === 'admin' ? 'block' : 'none' }}>Usuarios</button>
              <button className="btn btn-secondary" onClick={handleLogout}>Cerrar sesión</button>
            </div>

            <div style={{ marginTop: 'auto', fontSize: 12, color: 'var(--muted)', textAlign: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div>Soporte · Ajustes · Versión 1.0</div>
            </div>
          </aside>
        </>
      )}

      {/* Center modal: account details */}
      {accountDetailsOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1010 }} onClick={() => setAccountDetailsOpen(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1011, width: '90%', maxWidth: 600 }}>
            <div style={{ background: '#1a1a2e', padding: 28, borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Mi Cuenta</h3>
                <button onClick={() => setAccountDetailsOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <img src={profileImage} alt="perfil" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.1)' }} />
                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleProfileImageChange(e.target.files?.[0] || null)} />
                  <button className="btn" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>{isUploading ? 'Subiendo...' : 'Cambiar imagen'}</button>
                </div>

                <div style={{ width: '100%', marginTop: 12 }}>
                  {/* Nombre field */}
                  <div style={{ marginBottom: 20, padding: 16, background: 'rgba(197, 54, 54, 0.03)', borderRadius: 8 }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between'}}>

                      <label style={{ fontWeight: 600, color: 'var(--muted)', fontSize: 13 }}>Nombre</label>
                      <button 
                        className="btn" 
                        style={{ padding: '4px 12px', fontSize: 12 }}
                        onClick={() => {
                          if (editingField === 'name') {
                            handleUpdateField('name'); 
                          } else {
                            startFieldUpdate('name');
                          }
                        }}
                      >
                        {editingField === 'name' ? 'Guardar' : 'Actualizar'}
                      </button>
                    </div>
                    {editingField === 'name' ? (
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        style={{ width: '100%', padding: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--text)' }}
                      />
                    ) : (
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{userName}</div>
                    )}
                  </div>

                  {/* Email field */}
                  <div style={{ marginBottom: 20, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between'}}>

                      <label style={{ fontWeight: 600, color: 'var(--muted)', fontSize: 13 }}>Email</label>
                      <button 
                        className="btn" 
                        style={{ padding: '4px 12px', fontSize: 12 }}
                        onClick={() => {
                          if (editingField === 'email') {
                            handleUpdateField('email');
                          } else {
                            startFieldUpdate('email');
                          }
                        }}
                      >
                        {editingField === 'email' ? 'Guardar' : 'Actualizar'}
                      </button>
                    </div>
                    {editingField === 'email' ? (
                      <input 
                        type="email" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)}
                        style={{ width: '100%', padding: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--text)' }}
                      />
                    ) : (
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{userEmail}</div>
                    )}
                  </div>

                  {/* Password field */}
                  <div style={{ marginBottom: 20, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between'}}>
                      <label style={{ fontWeight: 600, color: 'var(--muted)', fontSize: 13 }}>Contraseña</label>
                      <button 
                        className="btn" 
                        style={{ padding: '4px 12px', fontSize: 12 }}
                        onClick={() => {
                          if (editingField === 'password') {
                            handleUpdateField('password');
                          } else {
                            startFieldUpdate('password');
                          }
                        }}
                      >
                        {editingField === 'password' ? 'Guardar' : 'Actualizar'}
                      </button>
                    </div>
                    {editingField === 'password' ? (
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        style={{ width: '100%', padding: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--text)' }}
                      />
                    ) : (
                      <div style={{ fontWeight: 600, fontSize: 16 }}>••••••••</div>
                    )}
                  </div>

                  {/* Rol field - no editable */}
                  <div style={{ marginBottom: 20, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ fontWeight: 600, color: 'var(--muted)', fontSize: 13 }}>Rol</label>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: normalizeRole(userRole) === 'admin' ? '#FFD700' : 'var(--text)' }}>
                        {normalizeRole(userRole)}
                      </span>
                      {normalizeRole(userRole) === 'admin' && <span>👑</span>}
                      {normalizeRole(userRole) === 'entrenador' && <span>💪</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button className="btn" onClick={handleMakeAdmin}>Soy Admin</button>
                    <button className="btn btn-danger" onClick={handleDeleteAccount}>Eliminar cuenta</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de verificación de contraseña */}
      {verifyPasswordModalOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1020 }} onClick={() => { setVerifyPasswordModalOpen(false); setVerifyPassword(''); }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1021, width: '90%', maxWidth: 400 }}>
            <div style={{ background: 'var(--card-bg)', padding: 24, borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 700 }}>Verificar identidad</h3>
              <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Ingresa tu contraseña actual para continuar</p>
              
              <input 
                type="password" 
                value={verifyPassword} 
                onChange={(e) => setVerifyPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleVerifyPasswordForUpdate();
                  }
                }}
                placeholder="Contraseña actual"
                style={{ width: '100%', padding: 12, marginBottom: 16, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--text)', fontSize: 14 }}
              />

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => { setVerifyPasswordModalOpen(false); setVerifyPassword(''); }}
                >
                  Cancelar
                </button>
                <button 
                  className="btn" 
                  onClick={handleVerifyPasswordForUpdate}
                >
                  Verificar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
