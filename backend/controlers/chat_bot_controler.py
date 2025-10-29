# backend_gemini.py
from flask import Flask, request, jsonify
import requests
import os
import GEMINI_API_KEY

app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Tu clave de Gemini

@app.route("/api/chatgemini", methods=["POST"])
def chat_gemini():
    data = request.json
    mensaje_usuario = data.get("mensaje")
    if not mensaje_usuario:
        return jsonify({"respuesta": "No se recibió ningún mensaje"}), 400

    try:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0:generateText"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY
        }
        body = {
            "prompt": mensaje_usuario,
            "maxOutputTokens": 200  # limita la cantidad de tokens usados
        }

        response = requests.post(url, json=body, headers=headers)
        response.raise_for_status()
        result = response.json()
        
        # Gemini devuelve la respuesta en result['candidates'][0]['content']
        respuesta = result.get("candidates", [{}])[0].get("content", "Sin respuesta")
        return jsonify({"respuesta": respuesta})

    except Exception as e:
        print("Error Gemini:", e)
        return jsonify({"respuesta": f"Error: {str(e)}"}), 500

