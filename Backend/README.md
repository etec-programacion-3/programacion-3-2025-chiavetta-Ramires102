### alumno: Pablo Chiavetta

### instalar para windows
    - uvicorn
    - fastapi
    - pyjwt
    - bcrypt
    - 'pydantic[email]'
    - python-multipart

## como funciona

    Tenes que crear un venv con el comando "source setup.sh", esto lo que hace es que te inicia un entorno virtual el cual se instalan dependencias como fastAPI, ruff y pre-commit.

    - todo lo que esta en el venv no se va a guardar en el repo

    *Para iniciar el servidor tenes que poner esto "uvicorn App:app --reload --port 5000"


### Resumen del proyecto

Este repositorio contiene el backend de una API construida con FastAPI para gestionar usuarios, clases y clases programadas. A grandes rasgos:

- `App.py`: instancia principal de FastAPI, configura CORS, monta las rutas (`controladores/rutas.py`) y expone la carpeta `imagen_perfil/` como archivos estáticos para servir las imágenes de perfil.
- `main.py`: archivo alternativo con una app FastAPI; la ejecución recomendada (y la que incluye las rutas y estáticos) es con `App:app`.
- `controladores/rutas.py`: define los endpoints (registro, login, usuarios, clases, clases programadas, subida de imagen de perfil). Aquí se gestiona la validación de entrada y la respuesta a las peticiones.
- `Servicios/`:
    - `servicios.py`: lógica de negocio relacionada con usuarios (registro, login, actualización, subir ruta de imagen en DB, etc.).
    - `servicios_clases.py`: lógica para crear/leer/actualizar/eliminar clases y clases programadas.
- `models/modelos.py`: modelos y esquemas compartidos (si aplica) para representar entidades.
- `Base_de_datos/db.py`: manejador de la base de datos SQLite, inicialización y conexiones.
- `imagen_perfil/`: carpeta donde se guardan las imágenes de perfil subidas. Los archivos aquí se sirven en la URL `/imagen_perfil/<nombre>`.
- Archivos auxiliares: `requirements.txt`, `pyproject.toml`, `package.json` (metadatos/deps), y varios archivos `request*.http` con ejemplos de peticiones para probar la API.

Cómo ejecutar (rápido):

1. Crear/activar entorno virtual e instalar dependencias (ver `setup.sh` y `requirements.txt`). 
    Esto se debe ejecutar con   
```bash
source setup.sh
``` 
2. Iniciar el servidor con:

```bash
uvicorn App:app --reload --port 5000
```
