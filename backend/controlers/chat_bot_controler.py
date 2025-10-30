import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Blueprint


# --- Cargar variables de entorno (.env) ---
load_dotenv()
API_KEY = os.getenv("API_KEY")

# --- Configuración del modelo Gemini ---
genai.configure(api_key=API_KEY)

# --- Ruta del Chat ---
chat_ia = Blueprint('chat_ia', __name__)
@chat_ia.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")
        contexto = data.get("contexto", {})
        reglas = data.get("reglas", "")

        # Construir prompt completo
        prompt = f"""
{reglas}

Datos del usuario:
- Nombre: {contexto.get('nombre', 'Desconocido')}
- Peso: {contexto.get('peso', 'No disponible')} kg
- Altura: {contexto.get('altura', 'No disponible')} m
- IMC: {contexto.get('imc', 'No disponible')}

Usuario pregunta: {user_message}
"""

        # Crear el modelo de Gemini
        model = genai.GenerativeModel("gemini-2.0-flash")

        # Generar la respuesta
        response = model.generate_content(prompt)
        text = response.text if hasattr(response, "text") else "No se recibió texto."

        return jsonify({"reply": text})

    except Exception as e:
        print("Error al contactar la API de Gemini:", e)
        return jsonify({"error": "Lo siento, no pude procesar tu solicitud."}), 500

    try:
        # 1. Obtener el mensaje del usuario
        data = request.get_json()
        user_message = data.get("message", "")

        # 2. Crear el modelo de Gemini
        model = genai.GenerativeModel("gemini-2.0-flash")

        # 3. Generar la respuesta
        response = model.generate_content(user_message)
        
        # 4. Extraer texto de la respuesta
        text = response.text if hasattr(response, "text") else "No se recibió texto."

        # 5. Devolver la respuesta al frontend
        return jsonify({"reply": text})

    except Exception as e:
        print("Error al contactar la API de Gemini:", e)
        return jsonify({"error": "Lo siento, no pude procesar tu solicitud."}), 500