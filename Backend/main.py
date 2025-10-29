from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Base_de_datos import db

app = FastAPI()

db.db_manager.inicializar_base_datos()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8080/"],  # URL de tu frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
)


@app.get("/")
def read_root():
    return {"message": "Hola mundo"}
