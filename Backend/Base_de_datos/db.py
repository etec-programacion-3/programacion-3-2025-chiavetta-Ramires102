import sqlite3
from datetime import datetime

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
        '''Crear tabla usuarios'''
        query = '''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            edad INTEGER,
            contraseña TEXT NOT NULL,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        '''
        self.cursor.execute(query)
        self.conn.commit()
        print("Tabla 'usuarios' creada exitosamente")

    def tabla_gym_muscuacion(self):
        """Crear tabla musculacion"""
        query = '''
        CREATE TABLE IF NOT EXISTS musculacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            series REAL NOT NULL,
            repeticiones REAL NOT NULL,
            fecha_horario_al_que_va DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        '''
        self.cursor.execute(query)
        self.conn.commit()
        print("Tabla 'musculacion' creada exitosamente")

    def inicializar_base_datos(self):
        print("Inicializando base de datos...")
        self.crear_tabla_usuarios()
        self.tabla_gym_muscuacion()
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
