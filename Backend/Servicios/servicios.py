import sqlite3
from datetime import datetime

from passlib.context import CryptContext

from Base_de_datos.db import DatabaseManager

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class servicio_de_usuario:
    def __init__(self):
        self.db_manager = DatabaseManager("gymnastic.db")

    def registrar_usuario(self, Nombre, Email, Edad, Contraseña, Rol):
        """Servicio para registrar un nuevo usuario"""
        try:
            # Verificaciones de negocio
            if not self._validar_email(Email):
                return {"error": "Email inválido"}

            if not self._validar_contraseña(Contraseña):
                return {"error": "Contraseña debe tener al menos 8 caracteres"}

            if self._usuario_existe(Email):
                return {"error": "El usuario ya está registrado"}
            # Registrar en la base de datos
            query = """
            INSERT INTO usuarios (Nombre, Email, Edad, Contraseña, Rol, fecha_creacion)
            VALUES (?, ?, ?, ?, ?)
            """
            self.db_manager.cursor.execute(
                query, (Nombre, Email, Edad, Contraseña, Rol, datetime.now())
            )
            self.db_manager.conn.commit()

            return {"exito": "Usuario registrado correctamente"}

        except sqlite3.Error as e:
            return {"error": f"Error en base de datos: {e}"}
        except Exception as e:
            return {"error": f"Error interno: {e}"}

    def verificar_login(self, Email, Contraseña):
        """Servicio para verificar login de usuario existente"""
        try:
            # Buscar usuario
            query = "SELECT * FROM usuarios WHERE Email = ?"
            self.db_manager.cursor.execute(query, (Email,))
            usuario = self.db_manager.cursor.fetchone()

            if not usuario:
                return {"error": "Usuario no encontrado"}

            # Verificar contraseña
            hashed = pwd_context.hash(Contraseña)
            is_correct = pwd_context.verify(Contraseña, hashed)
            if not is_correct:
                return {"error": "Contraseña incorrecta"}

            return {
                "exito": "Login exitoso",
                "usuario": {
                    "ID": usuario[0],
                    "Nombre": usuario[1],
                    "Email": usuario[2],
                    "Edad": usuario[3],
                    "Rol": usuario[4],
                },
            }

        except Exception as e:
            return {"error": f"Error interno: {e}"}

    def _validar_email(self, Email):
        """Validación privada de Email"""
        return "@" in Email and "." in Email

    def _validar_contraseña(self, Contraseña):
        """Validación privada de Contraseña"""
        return len(Contraseña) >= 8

    def _usuario_existe(self, Email):
        """Verificación privada si usuario existe"""
        query = "SELECT id FROM usuarios WHERE Email = ?"
        self.db_manager.cursor.execute(query, (Email,))
        return self.db_manager.cursor.fetchone() is not None
