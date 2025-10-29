from flask import Blueprint, jsonify
from services.red_neuronal_service import generar_plan_alimenticio

nueva_dieta_bp = Blueprint('nueva_dieta_bp',__name__)
@nueva_dieta_bp.route('/api/nueva_dieta/<tipo_dieta>', methods=['POST'])
def obtener_nueva_dieta(tipo_dieta):
    print('tipo_dieta:', tipo_dieta)
    try:
        print('tipo_dieta:', tipo_dieta)
        dieta = generar_plan_alimenticio(tipo_dieta)
        return jsonify({
            "tipo_dieta": tipo_dieta,    # nombre de la dieta
            "plan_dieta": dieta          # menú completo
        })
    except Exception as e:
        print("Error generando la dieta:", e)
        return jsonify({"error": str(e)}), 500