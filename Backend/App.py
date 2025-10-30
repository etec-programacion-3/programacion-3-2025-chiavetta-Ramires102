from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Base_de_datos import db
from controladores import rutas

app = FastAPI(title="API Gymnastic")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],  # URLs del frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

app.include_router(rutas.router)

# Inicializar base de datos (usa la instancia global db_manager en el módulo db)
db.db_manager.inicializar_base_datos()

# Incluir rutas desde el router
app.include_router(rutas.router)


@app.get("/")
def read_root():
    return {"message": "Hola mundo"}
