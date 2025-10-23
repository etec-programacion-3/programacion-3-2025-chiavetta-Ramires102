from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from Servicios.servicios import servicio_de_usuario
from Servicios.servicios_clases import servicio_de_clase

router = APIRouter(prefix="", tags=["API Gymnastic"])
servicio_usuario = servicio_de_usuario()
servicio_clase = servicio_de_clase()


class UsuarioRegistro(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    edad: int = Field(..., ge=1, le=120)
    contrasena: str = Field(..., min_length=8)
    rol: str | None = "usuario"

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan Pérez",
                "email": "juan@example.com",
                "edad": 25,
                "contrasena": "miPassword123",
                "rol": "usuario",
            }
        }


class UsuarioActualizacion(BaseModel):
    nombre: str | None = Field(None, min_length=2, max_length=100)
    email: EmailStr | None = None
    edad: int | None = Field(None, ge=1, le=120)
    contrasena: str | None = Field(None, min_length=8)
    rol: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Juan Pérez Actualizado",
                "email": "juan.nuevo@example.com",
                "edad": 26,
                "contrasena": "nuevoPassword123",
                "rol": "admin",
            }
        }


class UsuarioLogin(BaseModel):
    email: EmailStr
    contrasena: str

    class Config:
        json_schema_extra = {
            "example": {"email": "juan@example.com", "contrasena": "miPassword123"}
        }


@router.post(
    "/api/registro", status_code=status.HTTP_201_CREATED, tags=["Autenticación"]
)
async def registrar(usuario: UsuarioRegistro):
    """
    Registrar un nuevo usuario en el sistema.
    - **nombre**: Nombre completo del usuario
    - **email**: Email válido y único
    - **edad**: Edad del usuario (1-120)
    - **contrasena**: Mínimo 8 caracteres
    - **rol**: Rol del usuario (por defecto: usuario)
    """
    resultado = servicio_usuario.registrar_usuario(
        Nombre=usuario.nombre,
        Email=usuario.email,
        Edad=usuario.edad,
        contrasena=usuario.contrasena,
        Rol=usuario.rol,
    )
    if "error" in resultado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=resultado["error"]
        )
    return resultado


@router.post("/api/login", tags=["Autenticación"])
async def login(credenciales: UsuarioLogin):
    """
    Iniciar sesión con email y contrasena.
    - **email**: Email del usuario registrado
    - **contrasena**: contrasena del usuario
    """
    resultado = servicio_usuario.verificar_login(
        Email=credenciales.email, contrasena=credenciales.contrasena
    )
    if "error" in resultado:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=resultado["error"]
        )
    return resultado


@router.put("/api/usuario/{usuario_id}", tags=["Usuarios"])
async def actualizar_usuario(usuario_id: int, datos: UsuarioActualizacion):
    """
    Actualizar los datos de un usuario existente.

    - **usuario_id**: ID del usuario a actualizar
    - **nombre**: Nuevo nombre (opcional)
    - **email**: Nuevo email (opcional)
    - **edad**: Nueva edad (opcional)
    - **contrasena**: Nueva contraseña (opcional)
    - **rol**: Nuevo rol (opcional)

    Solo se actualizarán los campos que se envíen en la petición.
    """
    # Crear diccionario solo con los campos que no son None
    datos_actualizar = {k: v for k, v in datos.model_dump().items() if v is not None}

    if not datos_actualizar:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Debe proporcionar al menos un campo para actualizar",
        )

    # Mapear los nombres de los campos si es necesario
    datos_servicio = {}
    if "nombre" in datos_actualizar:
        datos_servicio["Nombre"] = datos_actualizar["nombre"]
    if "email" in datos_actualizar:
        datos_servicio["Email"] = datos_actualizar["email"]
    if "edad" in datos_actualizar:
        datos_servicio["Edad"] = datos_actualizar["edad"]
    if "contrasena" in datos_actualizar:
        datos_servicio["contrasena"] = datos_actualizar["contrasena"]
    if "rol" in datos_actualizar:
        datos_servicio["Rol"] = datos_actualizar["rol"]

    resultado = servicio_usuario.actualizar_usuario(
        usuario_id=usuario_id, **datos_servicio
    )

    if "error" in resultado:
        if "no encontrado" in resultado["error"].lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=resultado["error"]
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=resultado["error"]
        )

    return resultado


@router.delete("/api/usuarios/{id}")
async def eliminar_usuario(id: int):
    resultado = servicio_usuario.eliminar_usuario(id)

    if "error" in resultado:
        raise HTTPException(status_code=404, detail=resultado["error"])

    return resultado


# ===== RUTAS DE PRUEBA =====
@router.get("/", tags=["General"])
async def home():
    """Ruta de inicio para verificar que la API está funcionando"""
    return {
        "mensaje": "API Gymnastic funcionando",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "registro": "/api/registro [POST]",
            "login": "/api/login [POST]",
            "actualizar_usuario": "/api/usuario/{usuario_id} [PUT]",
            "documentación": "/docs",
        },
    }


@router.get("/api/health", tags=["General"])
async def health():
    """Health check para monitoreo"""
    return {"status": "ok", "service": "gymnastic-api"}


@router.get("/api/usuarios/regitrados", tags=["Usuarios"])
async def obtener_usuarios_de_prueba():
    """Ruta de prueba para obtener usuarios (no para producción)"""
    resultado = servicio_usuario.obtener_usuarios()
    return resultado


# --------------------------------rutas de clases-------------------------------------


@router.get("/api/clase", tags=["Clases"])
async def obtener_clases():
    """Ruta para obtener las clases del gym"""
    resultado = servicio_clase.obtener_clases()
    return resultado


@router.get("/api/clase/{id}", tags=["Clases"])
async def obtener_clase_por_id():
    """Ruta para obtener una clase del gym por ID"""
    resultado = servicio_clase.obtener_clases()
    return resultado


@router.post("/api/clase", tags=["Clases"])
async def crear_clase():
    """Ruta para crear una nueva clase del gym"""
    resultado = servicio_clase.agregar_clase()
    return resultado


@router.put("/api/clase/{id}", tags=["Clases"])
async def actualizar_clase():
    """Ruta para actualizar una clase del gym"""
    resultado = servicio_clase.actualizar_clase()
    return resultado


@router.delete("/api/clase/{id}", tags=["Clases"])
async def eliminar_clase():
    """Ruta para eliminar una clase del gym"""
    resultado = servicio_clase.eliminar_clase()
    return resultado
