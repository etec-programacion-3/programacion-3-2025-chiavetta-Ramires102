import sqlite3
from datetime import datetime

from passlib.context import CryptContext

from Base_de_datos.db import DatabaseManager

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class servicio_de_usuario:
    def __init__(self):
        self.db_manager = DatabaseManager("gymnastic.db")

    def registrar_usuario(self, nombre, email, edad, contraseña):
        """Servicio para registrar un nuevo usuario"""
        try:
            # Verificaciones de negocio
            if not self._validar_email(email):
                return {"error": "Email inválido"}

            if not self._validar_contraseña(contraseña):
                return {"error": "Contraseña debe tener al menos 8 caracteres"}

            if self._usuario_existe(email):
                return {"error": "El usuario ya está registrado"}
            # Registrar en la base de datos
            query = """
            INSERT INTO usuarios (nombre, email, edad, contraseña, fecha_creacion)
            VALUES (?, ?, ?, ?, ?)
            """
            self.db_manager.cursor.execute(
                query, (nombre, email, edad, contraseña, datetime.now())
            )
            self.db_manager.conn.commit()

            return {"exito": "Usuario registrado correctamente"}

        except sqlite3.Error as e:
            return {"error": f"Error en base de datos: {e}"}
        except Exception as e:
            return {"error": f"Error interno: {e}"}

    def verificar_login(self, email, contraseña):
        """Servicio para verificar login de usuario existente"""
        try:
            # Buscar usuario
            query = "SELECT * FROM usuarios WHERE email = ?"
            self.db_manager.cursor.execute(query, (email,))
            usuario = self.db_manager.cursor.fetchone()

            if not usuario:
                return {"error": "Usuario no encontrado"}

            # Verificar contraseña
            hashed = pwd_context.hash(contraseña)
            is_correct = pwd_context.verify(contraseña, hashed)
            if not is_correct:
                return {"error": "Contraseña incorrecta"}

            return {
                "exito": "Login exitoso",
                "usuario": {
                    "id": usuario[0],
                    "nombre": usuario[1],
                    "email": usuario[2],
                    "edad": usuario[3],
                },
            }

        except Exception as e:
            return {"error": f"Error interno: {e}"}

    def _validar_email(self, email):
        """Validación privada de email"""
        return "@" in email and "." in email

    def _validar_contraseña(self, contraseña):
        """Validación privada de contraseña"""
        return len(contraseña) >= 8

    def _usuario_existe(self, email):
        """Verificación privada si usuario existe"""
        query = "SELECT id FROM usuarios WHERE email = ?"
        self.db_manager.cursor.execute(query, (email,))
        return self.db_manager.cursor.fetchone() is not None
