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


class ClaseRegistro(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    descripcion: str = Field(..., min_length=5, max_length=500)
    duracion: float = Field(..., gt=0)
    fecha_horario_al_que_va: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Yoga para principiantes",
                "descripcion": "Clase de yoga enfocada en principiantes.",
                "duracion": 1.5,
                "fecha_horario_al_que_va": "2024-07-15 10:00:00",
            }
        }


class ClaseProgramadaRegistro(BaseModel):
    nombre_entrenador: str = Field(..., min_length=2, max_length=100)
    email_entrenador: EmailStr
    nombre_clase: str = Field(..., min_length=2, max_length=100)
    duracion: float = Field(..., gt=0)
    fecha_horario_al_que_va: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "nombre_entrenador": "Carlos López",
                "email_entrenador": "Carlos@gmail.com",
                "nombre_clase": "Pilates Avanzado",
                "duracion": 1.0,
                "fecha_horario_al_que_va": "2024-07-16 14:00:00",
            }
        }


class ClaseProgramadaActualizacion(BaseModel):
    nombre_entrenador: str | None = Field(None, min_length=2, max_length=100)
    email_entrenador: EmailStr | None = None
    nombre_clase: str | None = Field(None, min_length=2, max_length=100)
    duracion: float | None = Field(None, gt=0)
    fecha_horario_al_que_va: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "nombre_entrenador": "Carlos López Actualizado",
                "email_entrenador": "Carlitos@gmail.com",
                "nombre_clase": "Pilates Intermedio",
                "duracion": 1.5,
                "fecha_horario_al_que_va": "2024-07-16 16:00:00",
            }
        }


class ClaseActualizacion(BaseModel):
    nombre: str | None = Field(None, min_length=2, max_length=100)
    descripcion: str | None = Field(None, min_length=5, max_length=500)
    duracion: float | None = Field(None, gt=0)
    fecha_horario_al_que_va: str | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "nombre": "Yoga Intermedio",
                "descripcion": "Clase de yoga para nivel intermedio.",
                "duracion": 2.0,
                "fecha_horario_al_que_va": "2024-07-15 12:00:00",
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


@router.post("/registro", status_code=status.HTTP_201_CREATED, tags=["Autenticación"])
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


@router.post("/login", tags=["Autenticación"])
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


@router.put("/usuario/{usuario_id}", tags=["Usuarios"])
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


@router.delete("/usuarios/{id}")
async def eliminar_usuario(id: int):
    resultado = servicio_usuario.eliminar_usuario(id)

    if "error" in resultado:
        raise HTTPException(status_code=404, detail=resultado["error"])

    return resultado


@router.get("/", tags=["General"])
async def home():
    """Ruta de inicio para verificar que la API está funcionando"""
    return {
        "mensaje": "API Gymnastic funcionando",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "registro": "/registro [POST]",
            "login": "/login [POST]",
            "actualizar_usuario": "/usuario/{usuario_id} [PUT]",
            "documentación": "/docs",
        },
    }


@router.get("/health", tags=["General"])
async def health():
    """Health check para monitoreo"""
    return {"status": "ok", "service": "gymnastic-api"}


@router.get("/usuarios/registrados", tags=["Usuarios"])
async def obtener_usuarios_de_prueba():
    """Ruta de prueba para obtener usuarios (no para producción)"""
    resultado = servicio_usuario.obtener_usuarios()
    return resultado


@router.get("/usuarios/{id}", tags=["Usuarios"])
async def obtener_usuario_por_id(id: int):
    """Ruta para obtener un usuario por ID"""
    resultado = servicio_usuario.obtener_usuario_por_id(id)
    if "error" in resultado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=resultado["error"]
        )
    return resultado


@router.get("/usuarios/rol/{rol}", tags=["Usuarios"])
async def obtener_usuarios_por_rol(rol: str):
    """Ruta para obtener usuarios por rol"""
    resultado = servicio_usuario.obtener_usuarios_por_rol(rol)
    if "error" in resultado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=resultado["error"]
        )
    return resultado


# --------------------------------rutas de clases-------------------------------------


@router.get("/clase", tags=["Clases"])
async def obtener_clases():
    """Ruta para obtener las clases del gym"""
    resultado = servicio_clase.obtener_clases()
    return resultado


@router.get("/clase/{id}", tags=["Clases"])
async def obtener_clase_por_id(id: int):
    """Ruta para obtener una clase del gym por ID"""
    resultado = servicio_clase.obtener_clase_por_id(id)
    return resultado


@router.post("/clase", tags=["Clases"])
async def agregar_clase(clase: ClaseRegistro):
    """Ruta para crear una nueva clase del gym"""
    resultado = servicio_clase.agregar_clase(
        nombre=clase.nombre,
        descripcion=clase.descripcion,
        duracion=clase.duracion,
        fecha_horario_al_que_va=clase.fecha_horario_al_que_va,
    )
    return resultado


@router.put("/clase/{id}", tags=["Clases"])
async def actualizar_clase(id: int, clase: ClaseActualizacion):
    """Ruta para actualizar una clase del gym"""
    resultado = servicio_clase.actualizar_clase(
        id=id,
        nombre=clase.nombre,
        descripcion=clase.descripcion,
        duracion=clase.duracion,
        fecha_horario_al_que_va=clase.fecha_horario_al_que_va,
    )
    return resultado


@router.delete("/clase/{id}", tags=["Clases"])
async def eliminar_clase(id: int):
    """Ruta para eliminar una clase del gym"""
    resultado = servicio_clase.eliminar_clase(id)
    return resultado


# --------------------------------rutas de clasesProgramadas-------------------------------------


@router.get("/clasesProgramadas", tags=["Clases Programadas"])
async def obtener_clases_programadas():
    """Ruta para obtener las clases programadas del gym"""
    resultado = servicio_clase.obtener_clases_programadas()
    return resultado


@router.get("/clasesProgramadas/{id}", tags=["Clases Programadas"])
async def obtener_clase_programada_por_id(id: int):
    """Ruta para obtener una clase programada del gym por ID"""
    resultado = servicio_clase.obtener_clase_programada_por_id(id)
    return resultado


@router.post("/clasesProgramadas", tags=["Clases Programadas"])
async def agregar_clase_programada(clase_programada: ClaseProgramadaRegistro):
    """Ruta para crear una nueva clase programada del gym"""
    resultado = servicio_clase.agregar_clase_programada(
        nombre_entrenador=clase_programada.nombre_entrenador,
        email_entrenador=clase_programada.email_entrenador,
        nombre_clase=clase_programada.nombre_clase,
        duracion=clase_programada.duracion,
        fecha_horario_al_que_va=clase_programada.fecha_horario_al_que_va,
    )
    return resultado


@router.put("/clasesProgramadas/{id}", tags=["Clases Programadas"])
async def actualizar_clase_programada(
    id: int, clase_programada: ClaseProgramadaActualizacion
):
    """Ruta para actualizar una clase programada del gym"""
    resultado = servicio_clase.actualizar_clase_programada(
        id=id,
        nombre_entrenador=clase_programada.nombre_entrenador,
        email_entrenador=clase_programada.email_entrenador,
        nombre_clase=clase_programada.nombre_clase,
        duracion=clase_programada.duracion,
        fecha_horario_al_que_va=clase_programada.fecha_horario_al_que_va,
    )
    return resultado


@router.delete("/clasesProgramadas/{id}", tags=["Clases Programadas"])
async def eliminar_clase_programada(id: int):
    """Ruta para eliminar una clase programada del gym"""
    resultado = servicio_clase.eliminar_clase_programada(id)
    return resultado
