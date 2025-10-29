from flask import Flask
from controlers.recomendacion_controller import recomendacion_bp
from controlers.nueva_dieta_controller import nueva_dieta_bp
from flask_cors import CORS

app = Flask(__name__)

#uso de cors
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5500"}})
app.register_blueprint(recomendacion_bp)
app.register_blueprint(nueva_dieta_bp)

if __name__ == '__main__':
    app.run(port=8000, debug=True)