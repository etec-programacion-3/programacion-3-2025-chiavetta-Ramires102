from fastapi import FastAPI, HTTPException, status
from Base_de_datos import db

app = FastAPI()

db.db_manager.inicializar_base_datos()

@app.get("/")
def read_root():
    return {"message": "Hola mundo"}
