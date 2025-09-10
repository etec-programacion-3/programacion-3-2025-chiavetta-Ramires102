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
        '''Crear tabla usuarios con primary key'''
        query = '''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            edad INTEGER,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        '''
        self.cursor.execute(query)
        self.conn.commit()
        print("Tabla 'usuarios' creada exitosamente")

    def tabla_gym_muscuacion(self):
        """Crear tabla productos"""
        query = '''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            series REAL NOT NULL,
            repeticiones REAL NOT NULL,
            fecha_horario_al_que_va DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        '''
        self.cursor.execute(query)
        self.conn.commit()
        print("Tabla 'musculacion' creada exitosamente")