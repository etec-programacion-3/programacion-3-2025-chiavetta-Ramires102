import os
import sqlite3
from pathlib import Path


class DatabaseManager:
    def __init__(self, db_name: str = "gymnastic.db"):
        # Normalizar nombre a *.db
        if not db_name.endswith(".db"):
            db_name = f"{db_name}.db"
        self.db_name = db_name
        # Crear ruta absoluta consistente
        self.db_path = Path(__file__).resolve().parent.parent / self.db_name
        self.conn = None  # Inicializar conn
        self.cursor = None  # Inicializar cursor
        self.crear_conexion()

    def crear_conexion(self):
        """Crear conexión a la base de datos usando ruta absoluta y mostrarla."""
        try:
            db_file = str(self.db_path)
            # Asegurar que la carpeta existe
            db_dir = os.path.dirname(db_file)
            if db_dir and not os.path.exists(db_dir):
                os.makedirs(db_dir, exist_ok=True)

            # CRÍTICO: Configurar la conexión correctamente
            self.conn = sqlite3.connect(
                db_file,
                check_same_thread=False,  # Permite uso en múltiples threads
                isolation_level="DEFERRED",  # Modo de transacción explícito
            )

            # IMPORTANTE: Habilitar WAL mode para mejor concurrencia
            self.conn.execute("PRAGMA journal_mode=WAL")

            self.cursor = self.conn.cursor()
            print(f"Conectado a la base de datos: {db_file}")
            print(f"Ruta absoluta: {self.db_path.absolute()}")

        except sqlite3.Error as e:
            print(f"Error al conectar: {e}")
            raise

    def crear_tabla_usuarios(self):
        """Crear tabla usuarios"""
        query = """
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Nombre TEXT NOT NULL,
            Email TEXT UNIQUE NOT NULL,
            Edad INTEGER,
            Contraseña TEXT NOT NULL,
            Rol TEXT DEFAULT 'Usuario',
            imagen_perfil TEXT,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """
        self.cursor.execute(query)
        self.conn.commit()
        print("Tabla 'usuarios' creada exitosamente")

    def clase_del_gym(self):
        """Crear tabla clase_del_gym"""
        query = """
        CREATE TABLE IF NOT EXISTS clase_del_gym (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Nombre text NOT NULL,
            Descripcion text NOT NULL,
            Duracion REAL NOT NULL,
            fecha_horario_al_que_va DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """
        self.cursor.execute(query)
        self.conn.commit()
        print("Tabla 'clase_del_gym' creada exitosamente")

    def clase_programada(self):
        """Crear tabla clase_programada"""
        query = """
        CREATE TABLE IF NOT EXISTS clase_programada (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_entrenador TEXT NOT NULL,
            email_entrenador TEXT NOT NULL,
            nombre_clase TEXT NOT NULL,
            Duracion REAL NOT NULL,

            fecha_horario_al_que_va DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN Key (nombre_entrenador) REFERENCES Usuario(Nombre),
            FOREIGN Key (email_entrenador) REFERENCES Usuario(Email),
            FOREIGN Key (nombre_clase) REFERENCES clase_del_gym (Nombre)
        )
        """
        self.cursor.execute(query)
        self.conn.commit()
        print("Tabla 'clase_del_gym' creada exitosamente")
        try:
            self.cursor.execute(query)
            self.conn.commit()
        except sqlite3.Error as e:
            print(f"Error al crear clase_programada: {e}")

    def inicializar_base_datos(self):
        print("Inicializando base de datos...")
        self.crear_tabla_usuarios()
        self.clase_del_gym()
        self.clase_programada()
        print("Base de datos inicializada completamente")

    def cerrar_conexion(self):
        """Cerrar la conexión a la base de datos"""
        if self.conn:
            self.conn.close()
            print("Conexión cerrada")


# INICIALIZACIÓN DE LA BASE DE DATOS
if __name__ == "__main__":
    # Crear instancia del manejador de base de datos
    db_manager = DatabaseManager("gymnastic.db")

    # Crear todas las tablas
    db_manager.inicializar_base_datos()

    # Cerrar la conexión
    db_manager.cerrar_conexion()

db_manager = DatabaseManager("gymnastic.db")
