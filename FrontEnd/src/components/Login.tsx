import React, { useState, useEffect } from 'react';
import { authService } from '../services/api.ts';
import { authUtils } from '../utils/auth.ts';
import { LoginRequest } from '../types/index.ts';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    contrasena: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousAccounts, setPreviousAccounts] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const prev = authUtils.getPreviousAccounts();
    setPreviousAccounts(prev);
    const lastEmail = authUtils.getLastEmail();
    if (lastEmail) {
      setFormData(prev => ({ ...prev, email: lastEmail }));
    }
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com\.ar)$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'El correo es requerido';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Solo se aceptan emails de @gmail.com o @yahoo.com.ar';
    }

    if (!formData.contrasena) {
      errors.contrasena = 'La contraseña es requerida';
    } else if (!isValidPassword(formData.contrasena)) {
      errors.contrasena = 'La contraseña debe tener mínimo 8 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      setMessage({ text: 'Por favor corrige los errores en el formulario', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: 'Iniciando sesión...', type: 'info' });

    try {
      const response = await authService.login(formData);

      // Store authentication data
      authUtils.setToken(response.token);
      authUtils.setUserId(response.usuario.ID.toString());
      authUtils.setUsername(response.usuario.nombre);
      authUtils.setUserRole(response.usuario.rol);
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
      let errorMessage = 'Error al iniciar sesión';
      
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        errorMessage = typeof detail === 'string' ? detail : JSON.stringify(detail);
      } else if (error?.response?.data?.message) {
        const message = error.response.data.message;
        errorMessage = typeof message === 'string' ? message : JSON.stringify(message);
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessage({
        text: errorMessage,
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
            placeholder="tu@gmail.com o tu@yahoo.com.ar"
          />
          {validationErrors.email && (
            <div style={{ color: '#ff7a7a', fontSize: '14px', marginTop: '4px' }}>
              ⚠️ {validationErrors.email}
            </div>
          )}
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
            minLength={8}
          />
          {validationErrors.contrasena && (
            <div style={{ color: '#ff7a7a', fontSize: '14px', marginTop: '4px' }}>
              ⚠️ {validationErrors.contrasena}
            </div>
          )}
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
            ℹ️ Mínimo 8 caracteres
          </div>
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
          <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '8px' }}>Cuentas previas:</div>
          {previousAccounts.map((email, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255,255,255,0.02)',
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