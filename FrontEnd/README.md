# 💪 TecnoGym Frontend - Documentación

## 📋 Introducción

Este es el frontend de **TecnoGym**, una aplicación web de gestión de un gimnasio con ejercicios, clases programadas y perfil de usuario. Está construido con **React** y **TypeScript**, usando **Axios** para comunicarse con el backend en `http://localhost:5000`.

---

## 🚀 Cómo ejecutar

```bash
npm start
```

La aplicación se abre en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes principales de la UI
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── EjerciciosYClases.tsx
│   ├── ClasesProgramadas.tsx
│   └── Usuarios.tsx
├── services/           # Lógica de comunicación con API
│   └── api.ts
├── utils/              # Funciones auxiliares
│   └── auth.ts
├── types/              # Definiciones de TypeScript
│   └── index.ts
├── App.tsx             # Componente raíz y enrutamiento
└── index.tsx           # Punto de entrada
```

---

## 🔑 Componentes Principales

### 1️⃣ **App.tsx** - Enrutador Principal
- **Responsabilidad**: Maneja toda la navegación y verifica si el usuario está autenticado
- **Rutas**:
  - `/` → Login / Registro (sin autenticación)
  - `/dashboard` → Panel principal del usuario
  - `/ejercicios-y-clases` → Ejercicios con videos y calendario de clases
  - `/clases-programadas` → Lista completa de clases del gimnasio
  - `/usuarios` → Gestión de usuarios (admin)
- **Flujo**: 
  - Al abrir la app, verifica si hay un token en localStorage
  - Si existe → muestra Dashboard
  - Si no existe → muestra Login/Registro

---

### 2️⃣ **Login.tsx** - Pantalla de Inicio de Sesión
- **Funcionalidad**:
  - Campo email y contraseña
  - Verifica credenciales con el backend (`POST /login`)
  - Guarda el token JWT en localStorage
  - Opción para ir a Registro
- **Validación**: Email y contraseña obligatorios

---

### 3️⃣ **Register.tsx** - Pantalla de Registro
- **Funcionalidad**:
  - Formulario con: nombre, email, edad, contraseña, rol
  - Crea nuevo usuario en el backend (`POST /registro`)
  - Luego redirige a Login
- **Error Handling**: Muestra mensajes de error del servidor en la UI y consola

---

### 4️⃣ **Dashboard.tsx** - Panel Principal del Usuario
- **Componentes**:
  - 👤 **Perfil**: Foto, nombre, email, rol del usuario
  - 🎯 **Tarjetas de navegación**:
    - Ejercicios y Clases
    - Clases Programadas
    - Tienda
  - ⚙️ **Modal de Cuenta**:
    - Ver/actualizar nombre, email, contraseña
    - Cambiar foto de perfil (subir imagen)
    - Eliminar cuenta
  - 📱 **Sidebar**: Menú con opciones y cerrar sesión

- **Flujo de actualización de datos**:
  1. Usuario hace clic en "Actualizar" en un campo
  2. Se abre modal pidiendo la contraseña actual
  3. Backend verifica contraseña (`POST /usuario/{id}/verify-password`)
  4. Si es correcta → permite ingresar nuevo valor
  5. Actualiza datos (`PUT /usuario/{id}`)

---

### 5️⃣ **EjerciciosYClases.tsx** - Ejercicios + Calendario de Clases
- **Lado Izquierdo - Ejercicios**:
  - 3 categorías expandibles:
    - 💪 Parte Superior del Cuerpo (22 ejercicios)
    - 🦵 Parte Inferior del Cuerpo (19 ejercicios)
    - 🫀 Abdomen (25 ejercicios)
  - Cada ejercicio es un botón
  - Al hacer clic → abre modal con:
    - Nombre del ejercicio
    - Video de YouTube embebido
    - Descripción detallada

- **Lado Derecho - Calendario de Clases**:
  - Obtiene clases del backend (`GET /clase`)
  - Muestra máximo 8 clases
  - Si hay más de 8 → botón "✨ ... más" que abre modal con todas
  - Al hacer clic en una clase → modal con:
    - 📅 Nombre y fecha/hora
    - ⏱️ Duración
    - 📝 Descripción completa

---

### 6️⃣ **ClasesProgramadas.tsx** - Gestión de Clases
- **Funcionalidad**:
  - Obtiene todas las clases del backend (`GET /clase`)
  - Buscar/filtrar clases por nombre
  - Ver detalles de cada clase
  - Si es Admin:
    - Botón para agregar nueva clase
    - Modal con formulario (nombre, descripción, duración, fecha/hora)
    - Crear clase en backend (`POST /clase`)

---

### 7️⃣ **Usuarios.tsx** - Gestión de Usuarios (Admin)
- **Funcionalidad**:
  - Lista todos los usuarios
  - Ver detalles de cada usuario
  - Eliminar usuarios (solo admin)
  - Editar roles/permisos

---

## 🔌 Servicios y API

### **api.ts** - Cliente HTTP
```typescript
// Axios configurado con:
- Base URL: http://localhost:5000
- Interceptor de autenticación: añade token Bearer a cada request
- Métodos de servicios:
  - login(email, contraseña)
  - register(datos)
  - updateUser(id, datos)
  - verifyPassword(id, contraseña)
  - deleteUser(id)
  - uploadProfileImage(id, file)
  - getClases()
```

---

### **auth.ts** - Utilidades de Autenticación
```typescript
- getToken()                    // Lee token de localStorage
- setToken(token)               // Guarda token en localStorage
- clearToken()                  // Borra token (logout)
- getProfileImageUrl()          // Lee URL de foto guardada
- setProfileImageUrl(url)       // Guarda URL de foto
- clearAll()                    // Limpia todo al logout
```

---

## 📊 Tipos de Datos (TypeScript)

```typescript
// Usuario
User {
  ID: number
  nombre: string
  email: string
  edad: number
  rol: string
  profile_image_url?: string
}

// Login
LoginRequest {
  email: string
  contrasena: string
}

// Registro
RegisterRequest {
  nombre: string
  email: string
  edad: number
  contrasena: string
  rol: string
}

// Clase
Clase {
  id: number
  nombre: string
  descripcion: string
  duracion: string
  fecha_horario_al_que_va: string
}

// Ejercicio
Exercise {
  id: number
  title: string
  description: string
  videoUrl: string
  category: string
}
```

---

## 🎨 Diseño Visual

- **Paleta de colores**:
  - 🟣 Principal: `#667eea` (azul púrpura)
  - 🟠 Secundario: `#764ba2` (morado oscuro)
  - Gradientes: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

- **Componentes**:
  - Modales para detalles y formularios
  - Botones con efectos hover (sombra y movimiento)
  - Tarjetas con sombra y bordes redondeados
  - Sidebar deslizable para menú
  - Formularios con validación básica

---

## 🔐 Autenticación y Seguridad

1. **Login**: 
   - Usuario ingresa email y contraseña
   - Backend valida y retorna token JWT
   - Token se guarda en localStorage

2. **Requests autenticados**:
   - Interceptor de Axios añade `Authorization: Bearer <token>` a cada request

3. **Logout**:
   - Se borra token de localStorage
   - Usuario vuelve a Login

4. **Verificación de contraseña**:
   - Necesaria para actualizar datos sensibles (email, contraseña)
   - Backend valida contraseña actual antes de permitir cambio

---

## 🔄 Flujos Principales

### Flujo de Registro e Inicio de Sesión
```
Visitante → Página Login/Registro
           ↓
        ¿Nuevo usuario?
        ├─ SÍ → Registro → Backend crea usuario → Login automático
        └─ NO → Login → Backend valida → Token guardado → Dashboard
```

### Flujo de Visualización de Clases
```
Usuario en EjerciciosYClases
           ↓
    Frontend obtiene GET /clase
           ↓
    ¿Más de 8 clases?
    ├─ SÍ → Muestra 8 + botón "...más"
    └─ NO → Muestra todas
           ↓
    Usuario hace clic en clase → Modal con detalles
```

### Flujo de Actualización de Datos
```
Usuario en Dashboard → Hace clic "Actualizar" en un campo
           ↓
    Modal pide contraseña actual
           ↓
    POST /usuario/{id}/verify-password (valida)
           ↓
    ¿Contraseña correcta?
    ├─ SÍ → Permite ingresar nuevo valor → PUT /usuario/{id}
    └─ NO → Muestra error
```

---

## 🐛 Debugging y Logs

El frontend tiene logging detallado en la consola del navegador (F12):

- 🔄 **Clases**: `🔄 Iniciando carga...` → `✅ Respuesta recibida` → `📊 Clases cargadas: X`
- 🔐 **Autenticación**: `login response`, `register error`, etc.
- ⚠️ **Errores**: Status HTTP y datos de error

---

## 📋 Endpoint del Backend Utilizados

```
POST   /login                           → Inicio de sesión
POST   /registro                        → Registro de usuario
GET    /usuarios/{id}                   → Obtener datos del usuario
PUT    /usuarios/{id}                   → Actualizar usuario
DELETE /usuarios/{id}                   → Eliminar usuario
POST   /usuario/{id}/verify-password    → Verificar contraseña
POST   /usuario/{id}/imagen_perfil      → Subir foto de perfil

GET    /clase                           → Obtener todas las clases
GET    /clase/{nombre}                  → Obtener clase por nombre
POST   /clase                           → Crear nueva clase
PUT    /clase/{id}                      → Actualizar clase
DELETE /clase/{id}                      → Eliminar clase
```

---

## ✨ Características Principales

✅ Autenticación con JWT
✅ Gestión completa de usuario (perfil, foto, actualización de datos)
✅ 66 ejercicios categorizados con videos de YouTube
✅ Calendario de clases con modal expandible
✅ Sistema de verificación de contraseña para cambios sensibles
✅ UI responsivo y moderno
✅ Logging detallado para debugging
✅ Manejo robusto de errores

---

## 🛠️ Tecnologías Usadas

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **CSS-in-JS** - Estilos inline
- **Modales personalizadas** - Sin librerías externas

---

## 📝 Notas para Desarrolladores

1. Los estilos están en **inline CSS** (React style objects) - no hay archivos .css para componentes
2. El token JWT se guarda en **localStorage** bajo la clave `token`
3. El ID del usuario se guarda en **localStorage** bajo la clave `userId`
4. La URL de foto se guarda en **localStorage** bajo la clave `profileImageUrl`
5. El componente **App.tsx** es el punto central de control de autenticación
6. Todos los requests incluyen automáticamente el token por el interceptor de Axios