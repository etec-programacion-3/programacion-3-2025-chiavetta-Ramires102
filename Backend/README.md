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
