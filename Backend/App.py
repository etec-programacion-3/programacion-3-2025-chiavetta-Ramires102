from fastapi import FastAPI
from Base_de_datos import db
from Base_de_datos.db import inicializar_base_datos

app = FastAPI()

inicializar_base_datos()

@app.get("/")
def read_root():
    return {"message": "Hola mundo"}
