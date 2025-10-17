import sqlite3


class DatabaseManager:
    def __init__(self, db_name="gymnastic"):
        self.db_name = db_name
        self.crear_conexion()

    def crear_conexion(self):
        """Crear conexión a la base de datos"""
        try:
            self.conn = sqlite3.connect(self.db_name)
            self.cursor = self.conn.cursor()
            print(f"Conectado a la base de datos: {self.db_name}")
        except sqlite3.Error as e:
            print(f"Error al conectar: {e}")

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
            Nombre text NOT NULL PRIMARY KEY,
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
