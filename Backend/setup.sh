#!/bin/bash
echo "Configurando entorno de desarrollo..."
python3 -m venv venv
source Backend/venv/bin/activate
pip install -r requirements.txt
