import json
from pathlib import Path

ARCHIVO_RESULTADOS = Path("resultados.json")

def guardar_en_archivo(resultado):
    """Agrega un registro al archivo JSON"""
    # Si existe, cargamos el contenido
    if ARCHIVO_RESULTADOS.exists():
        with open(ARCHIVO_RESULTADOS, "r", encoding="utf-8") as f:
            datos = json.load(f)
    else:
        datos = []

    # Agregamos el nuevo resultado
    datos.append(resultado)

    # Guardamos de nuevo en el archivo
    with open(ARCHIVO_RESULTADOS, "w", encoding="utf-8") as f:
        json.dump(datos, f, indent=4, ensure_ascii=False)
