from datetime import datetime


class Usuario:
    def __init__(self, nombre, email, edad, contrasena):
        self.nombre = nombre
        self.email = email
        self.edad = edad
        self.contrasena = contrasena
        self.fecha_creacion = datetime.now()


class Clase:
    def __init__(self, nombre, descripcion, duracion, fecha_horario_al_que_va):
        self.nombre = nombre
        self.descripcion = descripcion
        self.duracion = duracion
        self.fecha_horario_al_que_va = fecha_horario_al_que_va


class ClaseProgramada:
    def __init__(
        self,
        nombre_entrenador,
        email_entrenador,
        nombre_clase,
        duracion,
        fecha_horario_al_que_va,
    ):
        self.nombre_entrenador = nombre_entrenador
        self.email_entrenador = email_entrenador
        self.nombre_clase = nombre_clase
        self.duracion = duracion
        self.fecha_horario_al_que_va = fecha_horario_al_que_va
