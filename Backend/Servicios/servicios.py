import logging
import sqlite3
from datetime import datetime

import bcrypt

from Base_de_datos.db import DatabaseManager

logger = logging.getLogger(__name__)

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)


class servicio_de_usuario:
    def __init__(self):
        self.db_manager = DatabaseManager("gymnastic.db")

    def _truncar_contrasena(self, contrasena):
        """
        Truncar contraseña a 72 bytes para bcrypt.
        Bcrypt tiene un límite estricto de 72 bytes.
        """
        contrasena_bytes = contrasena.encode("utf-8")
        if len(contrasena_bytes) > 72:
            # Truncar a 72 bytes
            contrasena_bytes = contrasena_bytes[:72]
            logger.info("Contraseña truncada a 72 bytes")
        return contrasena_bytes

    def _hashear_contrasena(self, contrasena):
        """Hashear contraseña usando bcrypt"""
        contrasena_bytes = self._truncar_contrasena(contrasena)
        salt = bcrypt.gensalt(rounds=12)
        hash_bytes = bcrypt.hashpw(contrasena_bytes, salt)
        return hash_bytes.decode("utf-8")

    def _verificar_contrasena(self, contrasena, hash_almacenado):
        """Verificar contraseña contra hash"""
        contrasena_bytes = self._truncar_contrasena(contrasena)
        hash_bytes = hash_almacenado.encode("utf-8")
        return bcrypt.checkpw(contrasena_bytes, hash_bytes)

    def registrar_usuario(self, Nombre, Email, Edad, contrasena, Rol):
        """Servicio para registrar un nuevo usuario"""
        try:
            logger.info(f"Registrando usuario: {Email}")

            # Verificaciones de negocio
            if not self._validar_email(Email):
                logger.warning(f"Email inválido: {Email}")
                return {"error": "Email inválido"}

            if not self._validar_contrasena(contrasena):
                logger.warning("Contraseña no cumple requisitos")
                return {"error": "contraseña debe tener al menos 8 caracteres"}

            if self._usuario_existe(Email):
                logger.warning(f"Usuario ya existe: {Email}")
                return {"error": "El usuario ya está registrado"}

            # Hashear contraseña (ya incluye truncamiento)
            contrasena_hasheada = self._hashear_contrasena(contrasena)
            logger.info(f"Hash generado exitosamente para {Email}")

            query = """
                INSERT INTO usuarios (Nombre, Email, Edad, Contraseña, Rol, fecha_creacion)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            self.db_manager.cursor.execute(
                query, (Nombre, Email, Edad, contrasena_hasheada, Rol, datetime.now())
            )
            self.db_manager.conn.commit()
            logger.info(f"Usuario registrado exitosamente: {Email}")

            return {"exito": "Usuario registrado correctamente"}

        except sqlite3.Error as e:
            logger.error(f"Error DB en registro: {e}")
            self.db_manager.conn.rollback()
            return {"error": f"Error en base de datos: {e}"}
        except Exception as e:
            logger.error(f"Error interno en registro: {e}", exc_info=True)
            return {"error": f"Error interno: {e}"}

    def verificar_login(self, Email, contrasena):
        """Servicio para verificar login de usuario existente"""
        try:
            # Buscar usuario
            query = "SELECT * FROM usuarios WHERE Email = ?"
            self.db_manager.cursor.execute(query, (Email,))
            usuario = self.db_manager.cursor.fetchone()

            if not usuario:
                logger.warning(f"Usuario no encontrado: {Email}")
                return {"error": "Usuario no encontrado"}

            contrasena_hasheada = usuario[4]  # Hash almacenado en DB

            # Verificar contraseña (ya incluye truncamiento)
            is_correct = self._verificar_contrasena(contrasena, contrasena_hasheada)

            if not is_correct:
                logger.warning(f"Contraseña incorrecta para {Email}")
                return {"error": "Contraseña incorrecta"}

            logger.info(f"Login exitoso para {Email}")
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
            logger.error(f"Error interno en login: {e}", exc_info=True)
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

    def actualizar_usuario(
        self, usuario_id, Nombre=None, Email=None, Edad=None, contrasena=None, Rol=None
    ):
        try:
            # Primero verificamos si el usuario existe
            query_select = "SELECT * FROM usuarios WHERE id = ?"
            self.db_manager.cursor.execute(query_select, (usuario_id,))
            usuario = self.db_manager.cursor.fetchone()
            if not usuario:
                return {"error": "Usuario no encontrado"}

            # Construir la consulta de actualización dinámicamente según los parámetros no None
            campos = []
            valores = []

            if Nombre is not None:
                campos.append("Nombre = ?")
                valores.append(Nombre)

            if Email is not None:
                if not self._validar_email(Email):
                    return {"error": "Email inválido"}
                campos.append("Email = ?")
                valores.append(Email)

            if Edad is not None:
                campos.append("Edad = ?")
                valores.append(Edad)

            if contrasena is not None:
                if not self._validar_contrasena(contrasena):
                    return {"error": "Contraseña debe tener al menos 8 caracteres"}
                contrasena_hasheada = self._hashear_contrasena(contrasena)
                campos.append("Contraseña = ?")
                valores.append(contrasena_hasheada)

            if Rol is not None:
                campos.append("Rol = ?")
                valores.append(Rol)

            if not campos:
                return {"error": "No se proporcionaron campos para actualizar"}

            # Agregar ID para la cláusula WHERE
            valores.append(usuario_id)

            query_update = f"UPDATE usuarios SET {', '.join(campos)} WHERE id = ?"
            self.db_manager.cursor.execute(query_update, tuple(valores))
            self.db_manager.conn.commit()

            return {"exito": "Usuario actualizado correctamente"}

        except sqlite3.Error as e:
            self.db_manager.conn.rollback()
            return {"error": f"Error en base de datos: {e}"}
        except Exception as e:
            return {"error": f"Error interno: {e}"}

    def eliminar_usuario(self, id):
        try:
            query = "DELETE FROM usuarios WHERE id = ?"
            self.db_manager.cursor.execute(query, (id,))
            self.db_manager.conn.commit()

            if self.db_manager.cursor.rowcount == 0:
                return {"error": "Usuario no encontrado"}
            return {"exito": "Usuario eliminado correctamente"}

        except sqlite3.Error as e:
            self.db_manager.conn.rollback()
            return {"error": f"Error en base de datos: {e}"}
        except Exception as e:
            return {"error": f"Error interno: {e}"}

    def obtener_usuarios(self):
        try:
            query = "SELECT id, Nombre, Email, Edad, Rol, fecha_creacion FROM usuarios"
            self.db_manager.cursor.execute(query)
            usuarios = self.db_manager.cursor.fetchall()

            lista_usuarios = []
            for usuario in usuarios:
                lista_usuarios.append(
                    {
                        "ID": usuario[0],
                        "Nombre": usuario[1],
                        "Email": usuario[2],
                        "Edad": usuario[3],
                        "Rol": usuario[4],
                        "fecha_creacion": usuario[5],
                    }
                )

            return {"usuarios": lista_usuarios}

        except sqlite3.Error as e:
            return {"error": f"Error en base de datos: {e}"}
        except Exception as e:
            logger.error(f"Error interno al obtener usuarios: {e}", exc_info=True)
            return {"error": f"Error interno: {e}"}
