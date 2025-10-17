from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from Servicios.servicios import servicio_de_usuario

router = APIRouter(prefix="", tags=["API Gymnastic"])


servicio_usuario = servicio_de_usuario()


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
            "documentación": "/docs",
        },
    }


@router.get("/api/health", tags=["General"])
async def health():
    """Health check para monitoreo"""
    return {"status": "ok", "service": "gymnastic-api"}


# ===== INICIAR SERVIDOR =====
# Ejecutar con: uvicorn main:app --reload

# Nota: ejecutar con `uvicorn App:app --reload` (App incluirá este router)
