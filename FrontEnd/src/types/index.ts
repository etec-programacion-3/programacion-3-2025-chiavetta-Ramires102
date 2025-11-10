export interface User {
  ID: number;
  nombre: string;
  email: string;
  edad: number;
  rol: string;
  profile_image_url?: string;
}

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  edad: number;
  contrasena: string;
  rol: string;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

// Interfaz para actualizar datos del usuario
export interface UpdateUserRequest {
  nombre?: string;
  email?: string;
  contrasena?: string;
  edad?: number;
}

// Interfaz para verificar contraseña
export interface VerifyPasswordRequest {
  contrasena: string;
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
}

export interface ExerciseCategory {
  id: string;
  title: string;
  exercises: Exercise[];
}