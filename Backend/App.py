from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from Base_de_datos import db
from controladores import rutas

# Crear una única instancia de la app
app = FastAPI(title="API Gymnastic")

# CORS - en desarrollo permitimos todo para evitar bloqueos de origen.
# En producción restringir a la(s) URL(s) de frontend adecuadas.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar base de datos
db.db_manager.inicializar_base_datos()

# Incluir rutas del router
app.include_router(rutas.router)

# Montar carpeta de imágenes de perfil para servir archivos estáticos
base_dir = os.path.dirname(__file__)
imagenes_dir = os.path.join(base_dir, "imagen_perfil")
os.makedirs(imagenes_dir, exist_ok=True)
app.mount("/imagen_perfil", StaticFiles(directory=imagenes_dir), name="imagen_perfil")


@app.get("/")
def read_root():
    return {"message": "Hola mundo"}
