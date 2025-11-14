import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import EjerciciosYClases from './components/EjerciciosYClases.tsx';
import ClasesProgramadas from './components/ClasesProgramadas.tsx';
import Usuarios from './components/Usuarios.tsx';
import { authUtils } from './utils/auth.ts';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Verificar si hay token al cargar la app
    const token = authUtils.getToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      const newToken = authUtils.getToken();
      setIsAuthenticated(!!newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Si aún está cargando, mostrar un loader o nada
  if (isAuthenticated === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', color: '#667eea' }}>Cargando...</div>;
  }

  const handleLoginSuccess = () => {
    // Verificar que el token se guardó correctamente
    const token = authUtils.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ejercicios-y-clases" element={<EjerciciosYClases />} />
            <Route path="/clases-programadas" element={<ClasesProgramadas />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route 
              path="/" 
              element={
                currentView === 'login' ? (
                  <Login 
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                  />
                ) : (
                  <Register 
                    onRegisterSuccess={() => handleSwitchToLogin()}
                    onSwitchToLogin={handleSwitchToLogin}
                  />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;