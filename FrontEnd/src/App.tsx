import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import EjerciciosYClases from './components/EjerciciosYClases.tsx';
import ClasesProgramadas from './components/ClasesProgramadas.tsx';
import { authUtils } from './utils/auth.ts';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const token = authUtils.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (email: string) => {
    setCurrentView('login');
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
        {/* Rutas públicas (cuando NO está autenticado) */}
        {!isAuthenticated ? (
          <>
            <Route 
              path="/" 
              element={
                <div>
                  {currentView === 'login' ? (
                    <Login 
                      onLoginSuccess={handleLoginSuccess}
                      onSwitchToRegister={handleSwitchToRegister}
                    />
                  ) : (
                    <Register 
                      onRegisterSuccess={handleRegisterSuccess}
                      onSwitchToLogin={handleSwitchToLogin}
                    />
                  )}
                </div>
              } 
            />
            {/* Redirige cualquier otra ruta al login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          /* Rutas privadas (cuando está autenticado) */
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ejercicios-y-clases" element={<EjerciciosYClases />} />
            <Route path="/clases-programadas" element={<ClasesProgramadas />} />
            {/* Redirige la raíz al dashboard si está autenticado */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Redirige cualquier ruta no encontrada al dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;