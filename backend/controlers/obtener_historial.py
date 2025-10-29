from services.guardar_en_archivo import ARCHIVO_RESULTADOS
from controlers.recomendacion_controller import recomendacion_bp
import json
from flask import jsonify

@recomendacion_bp.route('/api/historial', methods=['GET'])
def obtener_historial():
    try:
        if ARCHIVO_RESULTADOS.exists():
            with open(ARCHIVO_RESULTADOS, "r", encoding="utf-8") as f:
                datos = json.load(f)
        else:
            datos = []
        return jsonify(datos)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
