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
                    "id": clase[0],
                    "Nombre": clase[1],
                    "Descripcion": clase[2],
                    "Duracion": clase[3],
                    "fecha_horario_al_que_va": clase[4],
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
            VALUES ( ?, ?, ?, ?)
            """
            self.db_manager.cursor.execute(
                query, (nombre, descripcion, duracion, fecha_horario_al_que_va)
            )
            self.db_manager.conn.commit()
            last_id = self.db_manager.cursor.lastrowid
            return {"exito": "Clase agregada correctamente", "id": last_id}
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

            query = f"UPDATE clase_del_gym SET {', '.join(campos)} WHERE id = ?"
            self.db_manager.cursor.execute(query, tuple(valores))
            self.db_manager.conn.commit()

            if self.db_manager.cursor.rowcount == 0:
                logger.warning(f"Clase no encontrada id: {id}")
                return {"error": "Clase no encontrada"}
            return {"exito": "Clase actualizada correctamente"}

        except Exception as e:
            logger.error(f"Error al actualizar clase: {e}")
            return {"error": f"Error interno: {e}"}

    def eliminar_clase(self, id):
        """Servicio para eliminar una clase del gym por id"""
        try:
            logger.info(f"Eliminando clase id: {id}")
            query = "DELETE FROM clase_del_gym WHERE id = ?"
            self.db_manager.cursor.execute(query, (id,))
            self.db_manager.conn.commit()
            if self.db_manager.cursor.rowcount == 0:
                logger.warning(f"Clase no encontrada id: {id}")
                return {"error": "Clase no encontrada"}
            return {"exito": "Clase eliminada correctamente"}
        except Exception as e:
            logger.error(f"Error al eliminar clase: {e}")
            return {"error": f"Error interno: {e}"}

    def obtener_clase_por_id(self, id):
        """Servicio para obtener una clase del gym por ID"""
        try:
            logger.info(f"Obteniendo clase por ID: {id}")
            query = "SELECT * FROM clase_del_gym WHERE id = ?"
            self.db_manager.cursor.execute(query, (id,))
            clase = self.db_manager.cursor.fetchone()
            if clase is None:
                logger.warning(f"Clase no encontrada con ID: {id}")
                return {"error": "Clase no encontrada"}

            resultado = {
                "Nombre": clase[0],
                "Descripcion": clase[1],
                "Duracion": clase[2],
                "fecha_horario_al_que_va": clase[3],
            }
            return {"clase": resultado}
        except Exception as e:
            logger.error(f"Error al obtener clase por ID: {e}")
            return {"error": f"Error interno: {e}"}

    # --------------------------------servicios de clasesProgramadas-------------------------------------

    def obtener_clases_programadas(self):
        """Servicio para obtener todas las clases programadas del gym"""
        try:
            logger.info("Obteniendo todas las clases programadas del gym")
            query = "SELECT * FROM clase_programada"
            self.db_manager.cursor.execute(query)
            clases_programadas = self.db_manager.cursor.fetchall()
            resultado = [
                {
                    "ID": clase[0],
                    "nombre_entrenador": clase[1],
                    "email_entrenador": clase[2],
                    "nombre_clase": clase[3],
                    "Duracion": clase[4],
                    "fecha_horario_al_que_va": clase[5],
                }
                for clase in clases_programadas
            ]
            return {"clases_programadas": resultado}
        except Exception as e:
            logger.error(f"Error al obtener clases programadas: {e}")
            return {"error": f"Error interno: {e}"}

    def obtener_clase_programada_por_id(self, id):
        """Servicio para obtener una clase programada del gym por ID"""
        try:
            logger.info(f"Obteniendo clase programada por ID: {id}")
            query = "SELECT * FROM clase_programada WHERE ID = ?"
            self.db_manager.cursor.execute(query, (id,))
            clase_programada = self.db_manager.cursor.fetchone()
            if clase_programada is None:
                logger.warning(f"Clase programada no encontrada con ID: {id}")
                return {"error": "Clase programada no encontrada"}

            resultado = {
                "ID": clase_programada[0],
                "nombre_entrenador": clase_programada[1],
                "email_entrenador": clase_programada[2],
                "nombre_clase": clase_programada[3],
                "Duracion": clase_programada[4],
                "fecha_horario_al_que_va": clase_programada[5],
            }
            return {"clase_programada": resultado}
        except Exception as e:
            logger.error(f"Error al obtener clase programada por ID: {e}")
            return {"error": f"Error interno: {e}"}

    def agregar_clase_programada(
        self,
        nombre_entrenador,
        email_entrenador,
        nombre_clase,
        duracion,
        fecha_horario_al_que_va,
    ):
        """Servicio para agregar una nueva clase programada al gym"""
        try:
            logger.info(f"Agregando nueva clase programada: {nombre_clase}")
            query = """
            INSERT INTO clase_programada (nombre_entrenador, email_entrenador, nombre_clase, Duracion, fecha_horario_al_que_va)
            VALUES ( ?, ?, ?, ?, ?)
            """
            self.db_manager.cursor.execute(
                query,
                (
                    nombre_entrenador,
                    email_entrenador,
                    nombre_clase,
                    duracion,
                    fecha_horario_al_que_va,
                ),
            )
            self.db_manager.conn.commit()
            last_id = self.db_manager.cursor.lastrowid
            return {"exito": "Clase programada agregada correctamente", "ID": last_id}
        except sqlite3.IntegrityError:
            logger.error(f"Clase programada con nombre {nombre_clase} ya existe")
            return {"error": "Clase programada con este nombre ya existe"}
        except Exception as e:
            logger.error(f"Error al agregar clase programada: {e}")
            return {"error": f"Error interno: {e}"}

    def actualizar_clase_programada(
        self,
        id,
        nombre_entrenador=None,
        email_entrenador=None,
        nombre_clase=None,
        duracion=None,
        fecha_horario_al_que_va=None,
    ):
        """Servicio para actualizar una clase programada del gym"""
        try:
            campos = []
            valores = []

            if nombre_entrenador is not None:
                campos.append("nombre_entrenador = ?")
                valores.append(nombre_entrenador)

            if email_entrenador is not None:
                campos.append("email_entrenador = ?")
                valores.append(email_entrenador)

            if nombre_clase is not None:
                campos.append("nombre_clase = ?")
                valores.append(nombre_clase)

            if duracion is not None:
                campos.append("Duracion = ?")
                valores.append(duracion)

            if fecha_horario_al_que_va is not None:
                campos.append("fecha_horario_al_que_va = ?")
                valores.append(fecha_horario_al_que_va)

            if not campos:
                return {"error": "No se proporcionaron campos para actualizar"}

            valores.append(id)

            query = f"UPDATE clase_programada SET {', '.join(campos)} WHERE ID = ?"
            self.db_manager.cursor.execute(query, tuple(valores))
            self.db_manager.conn.commit()

            if self.db_manager.cursor.rowcount == 0:
                logger.warning(f"Clase programada no encontrada id: {id}")
                return {"error": "Clase programada no encontrada"}
            return {"exito": "Clase programada actualizada correctamente"}

        except Exception as e:
            logger.error(f"Error al actualizar clase programada: {e}")
            return {"error": f"Error interno: {e}"}

    def eliminar_clase_programada(self, id):
        """Servicio para eliminar una clase programada del gym por id"""
        try:
            logger.info(f"Eliminando clase programada id: {id}")
            query = "DELETE FROM clase_programada WHERE ID = ?"
            self.db_manager.cursor.execute(query, (id,))
            self.db_manager.conn.commit()
            if self.db_manager.cursor.rowcount == 0:
                logger.warning(f"Clase programada no encontrada id: {id}")
                return {"error": "Clase programada no encontrada"}
            return {"exito": "Clase programada eliminada correctamente"}
        except Exception as e:
            logger.error(f"Error al eliminar clase programada: {e}")
            return {"error": f"Error interno: {e}"}
