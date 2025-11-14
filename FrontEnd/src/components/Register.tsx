import React, { useState } from 'react';
import { authService } from '../services/api.ts';
import { RegisterRequest } from '../types/index.ts';

interface RegisterProps {
  onRegisterSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    nombre: '',
    email: '',
    edad: 0,
    contrasena: '',
    rol: 'usuario',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Validar email (solo Gmail y Yahoo)
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@(gmail\.com|yahoo\.com\.ar)$/.test(email);
  };

  // Validar contraseña
  const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'edad' ? parseInt(value) || 0 : value
    }));
    
    // Limpiar error cuando el usuario escribe
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Solo se aceptan emails de @gmail.com o @yahoo.com.ar';
    }

    // Validar edad
    if (!formData.edad || formData.edad < 1 || formData.edad > 120) {
      errors.edad = 'La edad debe estar entre 1 y 120 años';
    }

    // Validar contraseña
    if (!formData.contrasena) {
      errors.contrasena = 'La contraseña es requerida';
    } else if (!isValidPassword(formData.contrasena)) {
      errors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar forma primero
    if (!validateForm()) {
      setMessage({ 
        text: 'Por favor, corrige los errores en el formulario', 
        type: 'error' 
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: 'Procesando registro...', type: 'info' });

    try {
      await authService.register(formData);
      setMessage({ text: '¡Registro exitoso! Ya puedes iniciar sesión', type: 'success' });

      // Clear form
      setFormData({
        nombre: '',
        email: '',
        edad: 0,
        contrasena: '',
        rol: 'usuario',
      });

      // Switch to login after 2 seconds
      setTimeout(() => {
        onRegisterSuccess(formData.email);
        onSwitchToLogin();
      }, 2000);
    } catch (error: any) {
      console.error('Register error:', error);

      let errorMessage = 'Error al registrarse';
      
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

  return (
    <div className="container">
      <h2>Registrarse</h2>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Usuario</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            placeholder="usuario123"
          />
          {validationErrors.nombre && (
            <div style={{ color: '#ff7a7a', fontSize: '14px', marginTop: '4px' }}>
              ⚠️ {validationErrors.nombre}
            </div>
          )}
        </div>

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
          <label htmlFor="edad">Edad</label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={formData.edad || ''}
            onChange={handleInputChange}
            required
            min="1"
            max="120"
            placeholder="25"
          />
          {validationErrors.edad && (
            <div style={{ color: '#ff7a7a', fontSize: '14px', marginTop: '4px' }}>
              ⚠️ {validationErrors.edad}
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

        <div className="info-text">
          Tu rol será asignado como: <strong>Usuario</strong>
        </div>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

        <div className="back-link">
        <button 
          onClick={onSwitchToLogin} 
          style={{ 
            cursor: 'pointer', 
            background: 'none', 
            border: 'none', 
            color: 'var(--accent)',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};

export default Register;