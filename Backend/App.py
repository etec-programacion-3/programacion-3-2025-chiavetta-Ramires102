from fastapi import FastAPI

from Base_de_datos import db
from controladores import rutas

app = FastAPI(title="API Gymnastic")

# Inicializar base de datos (usa la instancia global db_manager en el módulo db)
db.db_manager.inicializar_base_datos()

# Incluir rutas desde el router
app.include_router(rutas.router)


@app.get("/")
def read_root():
    return {"message": "Hola mundo"}
