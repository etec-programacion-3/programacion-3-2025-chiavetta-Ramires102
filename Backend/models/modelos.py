from datetime import datetime

class Usuario:
    def __init__(self, nombre, email, edad, contraseña):
        self.nombre = nombre
        self.email = email
        self.edad = edad
        self.contraseña = contraseña
        self.fecha_creacion = datetime.now()
    
   
