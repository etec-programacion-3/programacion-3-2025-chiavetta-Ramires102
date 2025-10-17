import logging
import sqlite3
from datetime import datetime

from passlib.context import CryptContext

from Base_de_datos.db import DatabaseManager

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
    bcrypt__truncate_error=False,
)
logger = logging.getLogger(__name__)


if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)


class servicio_de_usuario:
    def __init__(self):
        self.db_manager = DatabaseManager("gymnastic.db")

    def registrar_usuario(self, Nombre, Email, Edad, contrasena, Rol):
        """Servicio para registrar un nuevo usuario"""
        try:
            # Verificaciones de negocio
            if not self._validar_email(Email):
                return {"error": "Email inválido"}

            if not self._validar_contrasena(contrasena):
                return {"error": "contraseña debe tener al menos 8 caracteres"}

            if self._usuario_existe(Email):
                return {"error": "El usuario ya está registrado"}

            # Truncar STRING a 72 caracteres ANTES de hashear
            if len(contrasena.encode("utf-8")) > 72:
                contrasena_truncada = contrasena.encode("utf-8")[:72]
                contrasena = contrasena_truncada.decode("utf-8", errors="ignore")

            contrasena_hasheada = pwd_context.hash(contrasena_truncada)

            query = """
                INSERT INTO usuarios (Nombre, Email, Edad, Contraseña, Rol, fecha_creacion)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            self.db_manager.cursor.execute(
                query, (Nombre, Email, Edad, contrasena_hasheada, Rol, datetime.now())
            )
            self.db_manager.conn.commit()

            return {"exito": "Usuario registrado correctamente"}

        except sqlite3.Error as e:
            return {"error": f"Error en base de datos: {e}"}
        except Exception as e:
            return {"error": f"Error interno: {e}"}

    def verificar_login(self, Email, contrasena):
        """Servicio para verificar login de usuario existente"""
        try:
            # Buscar usuario
            query = "SELECT * FROM usuarios WHERE Email = ?"
            self.db_manager.cursor.execute(query, (Email,))
            usuario = self.db_manager.cursor.fetchone()

            if not usuario:
                return {"error": "Usuario no encontrado"}

            contrasena_hasheada = usuario[4]  # Hash almacenado en DB
            contrasena_truncada = contrasena[:72]  # Truncar contraseña del usuario

            is_correct = pwd_context.verify(contrasena_truncada, contrasena_hasheada)

            if not is_correct:
                return {"error": "Contraseña incorrecta"}

            return {
                "exito": "Login exitoso",
                "usuario": {
                    "ID": usuario[0],
                    "Nombre": usuario[1],
                    "Email": usuario[2],
                    "Edad": usuario[3],
                    "Rol": usuario[5],
                },
            }

        except Exception as e:
            return {"error": f"Error interno: {e}"}

    def _validar_email(self, Email):
        """Validación privada de Email"""
        return "@" in Email and "." in Email

    def _validar_contrasena(self, contrasena):
        """Validación privada de contraseña"""
        return len(contrasena) >= 8

    def _usuario_existe(self, Email):
        """Verificación privada si usuario existe"""
        query = "SELECT id FROM usuarios WHERE Email = ?"
        self.db_manager.cursor.execute(query, (Email,))
        return self.db_manager.cursor.fetchone() is not None
