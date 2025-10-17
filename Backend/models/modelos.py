from datetime import datetime


class Usuario:
    def __init__(self, nombre, email, edad, contrasena):
        self.nombre = nombre
        self.email = email
        self.edad = edad
        self.contrasena = contrasena
        self.fecha_creacion = datetime.now()
