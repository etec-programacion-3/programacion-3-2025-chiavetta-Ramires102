import logging
import sqlite3

from Base_de_datos.db import DatabaseManager

logger = logging.getLogger(__name__)

if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)


class servicio_de_clase:
    def __init__(self):
        self.db_manager = DatabaseManager("gymnastic.db")

    def obtener_clases(self):
        """Servicio para obtener todas las clases del gym"""
        try:
            logger.info("Obteniendo todas las clases del gym")
            query = "SELECT * FROM clase_del_gym"
            self.db_manager.cursor.execute(query)
            clases = self.db_manager.cursor.fetchall()
            resultado = [
                {
                    "Nombre": clase[0],
                    "Descripcion": clase[1],
                    "Duracion": clase[2],
                    "fecha_horario_al_que_va": clase[3],
                }
                for clase in clases
            ]
            return {"clases": resultado}
        except Exception as e:
            logger.error(f"Error al obtener clases: {e}")
            return {"error": f"Error interno: {e}"}

    def agregar_clase(self, nombre, descripcion, duracion, fecha_horario_al_que_va):
        """Servicio para agregar una nueva clase al gym"""
        try:
            logger.info(f"Agregando nueva clase: {nombre}")
            query = """
            INSERT INTO clase_del_gym (Nombre, Descripcion, Duracion, fecha_horario_al_que_va)
            VALUES (?, ?, ?, ?)
            """
            self.db_manager.cursor.execute(
                query, (nombre, descripcion, duracion, fecha_horario_al_que_va)
            )
            self.db_manager.conn.commit()
            return {"exito": "Clase agregada correctamente"}
        except sqlite3.IntegrityError:
            logger.error(f"Clase con nombre {nombre} ya existe")
            return {"error": "Clase con este nombre ya existe"}
        except Exception as e:
            logger.error(f"Error al agregar clase: {e}")
            return {"error": f"Error interno: {e}"}

    def actualizar_clase(
        self,
        id,
        nombre=None,
        descripcion=None,
        duracion=None,
        fecha_horario_al_que_va=None,
    ):
        """Servicio para actualizar una clase del gym"""
        try:
            # Primero verificamos si el usuario existe
            query_select = "SELECT * FROM usuarios WHERE id = ?"
            self.db_manager.cursor.execute(query_select, (id,))
            clase = self.db_manager.cursor.fetchone()
            if not clase:
                return {"error": "clase no encontrado"}

            campos = []
            valores = []

            if nombre is not None:
                campos.append("Nombre = ?")
                valores.append(nombre)

            if descripcion is not None:
                campos.append("Descripcion = ?")
                valores.append(descripcion)

            if duracion is not None:
                campos.append("Duracion = ?")
                valores.append(duracion)

            if fecha_horario_al_que_va is not None:
                campos.append("fecha_horario_al_que_va = ?")
                valores.append(fecha_horario_al_que_va)

            if not campos:
                return {"error": "No se proporcionaron campos para actualizar"}

            valores.append(id)

            query = f"UPDATE clase_del_gym SET {', '.join(campos)} WHERE Nombre = ?"
            self.db_manager.cursor.execute(query, tuple(valores))
            self.db_manager.conn.commit()

            if self.db_manager.cursor.rowcount == 0:
                logger.warning(f"Clase no encontrada: {nombre}")
                return {"error": "Clase no encontrada"}
            return {"exito": "Clase actualizada correctamente"}

        except Exception as e:
            logger.error(f"Error al actualizar clase: {e}")
            return {"error": f"Error interno: {e}"}

    def eliminar_clase(self, nombre):
        """Servicio para eliminar una clase del gym por nombre"""
        try:
            logger.info(f"Eliminando clase: {nombre}")
            query = "DELETE FROM clase_del_gym WHERE Nombre = ?"
            self.db_manager.cursor.execute(query, (nombre,))
            self.db_manager.conn.commit()
            if self.db_manager.cursor.rowcount == 0:
                logger.warning(f"Clase no encontrada: {nombre}")
                return {"error": "Clase no encontrada"}
            return {"exito": "Clase eliminada correctamente"}
        except Exception as e:
            logger.error(f"Error al eliminar clase: {e}")
            return {"error": f"Error interno: {e}"}
