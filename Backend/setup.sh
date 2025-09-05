#!/bin/bash
echo "Configurando entorno de desarrollo..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "¡Listo! Ejecuta 'source venv/bin/activate' para usar ruff"