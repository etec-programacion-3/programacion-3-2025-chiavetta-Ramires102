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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'edad' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Log completo para debugging (abrir DevTools -> Console / Network)
      console.error('Register error:', error);

      // Intentar extraer mensaje del servidor, si existe
      const serverMessage = error?.response?.data?.detail || error?.response?.data?.message || null;

      setMessage({
        text: serverMessage || (error?.message ? `Error: ${error.message}` : 'Error al registrarse'),
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
            placeholder="tu@email.com"
          />
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
            minLength={6}
          />
        </div>

        <div className="info-text">
          Tu rol será asignado como: <strong>Usuario</strong>
        </div>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <div className="back-link">
        <a onClick={onSwitchToLogin} style={{ cursor: 'pointer' }}>← Volver al inicio de sesión</a>
      </div>
    </div>
  );
};

export default Register;