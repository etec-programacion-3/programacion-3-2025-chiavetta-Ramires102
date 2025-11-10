import React, { useState, useEffect } from 'react';
import { authService } from '../services/api.ts';
import { authUtils } from '../utils/auth.ts';
import { LoginRequest } from '../types/index.ts';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    contrasena: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousAccounts, setPreviousAccounts] = useState<string[]>([]);

  useEffect(() => {
    const prev = authUtils.getPreviousAccounts();
    setPreviousAccounts(prev);
    const lastEmail = authUtils.getLastEmail();
    if (lastEmail) {
      setFormData(prev => ({ ...prev, email: lastEmail }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: 'Iniciando sesión...', type: 'info' });

    try {
      const response = await authService.login(formData);

      // Store authentication data
      authUtils.setToken(response.token);
      authUtils.setUserId(response.usuario.ID.toString());
      authUtils.setUsername(response.usuario.nombre);
      authUtils.setLastEmail(formData.email);

      // Update previous accounts
      const prevAccounts = authUtils.getPreviousAccounts();
      if (!prevAccounts.includes(formData.email)) {
        prevAccounts.push(formData.email);
        authUtils.setPreviousAccounts(prevAccounts);
        setPreviousAccounts(prevAccounts);
      }

      setMessage({ text: '¡Login exitoso! Redirigiendo al dashboard...', type: 'success' });
      setTimeout(() => {
        onLoginSuccess();
      }, 800);
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.detail || 'Error al iniciar sesión',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectPreviousAccount = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="tu@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleInputChange}
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onSwitchToRegister}>
          Crear una cuenta
        </button>
      </form>

      {previousAccounts.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>Cuentas previas:</div>
          {previousAccounts.map((email, index) => (
            <div
              key={index}
              style={{
                background: '#f5f5f5',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '6px',
                cursor: 'pointer'
              }}
              onClick={() => selectPreviousAccount(email)}
            >
              {email}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Login;