from flask import Flask
from controlers.recomendacion_controller import recomendacion_bp
from flask_cors import CORS

app = Flask(__name__)

#uso de cors
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5500"}})
app.register_blueprint(recomendacion_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
