from flask import Blueprint, request, jsonify
from services.imc_service import calcular_imc,estado_imc
from services.logica_difusa_service import obtener_recomendacion_difusa
from services.red_neuronal_service import predecir_dieta

recomendacion_bp = Blueprint('recomendacion_bp', __name__)
@recomendacion_bp.route('/api/recomendacion', methods=['POST'])
def obtener_recomendacion():
    try:
        datos = request.get_json()
        print("📩 Datos recibidos del front:", datos)  # <--- agrega esto

        edad_val = float(datos['edad'])
        peso = float(datos['peso'])
        altura = float(datos['altura'])
        sexo_texto = datos['sexo'].upper()
        print(f"Edad: {edad_val}, Peso: {peso}, Altura: {altura}, Sexo: {sexo_texto}")

        sexo_valor = 1 if sexo_texto == 'M' else 0
        imc_valor = calcular_imc(peso, altura)
        estado_valor = estado_imc(imc_valor) 
        print("✅ IMC calculado:", imc_valor, "Estado:", estado_valor)

        valor_difuso, texto_difuso = obtener_recomendacion_difusa(edad_val, imc_valor, sexo_valor)
        print("✅ Resultado difuso:", valor_difuso, texto_difuso)

        dieta_nn = predecir_dieta(imc_valor, edad_val, sexo_valor)
        print("✅ Dieta predicha:", dieta_nn)

        return jsonify({
            "imc": imc_valor,
            "estado": estado_valor,
            "valor_difuso": round(valor_difuso, 2),
            "recomendacion_difusa": texto_difuso,
            "dieta_neuronal": dieta_nn
        })

    except Exception as e:
        print("❌ Error en el backend:", e)
        return jsonify({"error": str(e)}), 400

