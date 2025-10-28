✅ Solución rápida y segura
1️⃣ Abre PowerShell como administrador
Presiona Inicio


Escribe PowerShell


Haz clic derecho y selecciona “Ejecutar como administrador”



2️⃣ Permite la ejecución solo durante esta sesión
En la ventana de PowerShell, escribe este comando:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

ejecutar este codigo para crear carpeta
python -m venv venv

⚙️ 3. Activa el entorno virtual
En Windows, el comando para activarlo es:
venv\Scripts\activate

👉 Cuando lo hagas correctamente, verás algo como esto al inicio de la línea:
(venv) C:\Users\TuUsuario\Documents\mi_proyecto>

Eso significa que estás “dentro” del entorno virtual.

📦 4. Instala las librerías necesarias
Ahora instala las dependencias que tu proyecto necesita:
pip install flask scikit-fuzzy numpy

Esto descargará e instalará:
Flask → framework web.


scikit-fuzzy → para lógica difusa.


NumPy → para cálculos numéricos.
para iniciar la ejecucion:
actualizar librerias:
pip freeze > requirements.txt


Ese archivo es el que luego puedes usar en cualquier otra máquina para reinstalar todo con:
pip install -r requirements.txt
correr el ambiente virtual
luego ejecutar para correr el puerto
python app.py

3️⃣ Crear entorno virtual
python -m venv venv


Esto crea una carpeta venv donde se instalarán las dependencias del proyecto.

⚙️ 4️⃣ Activar entorno virtual

En Windows:

venv\Scripts\activate


En Linux/Mac:

source venv/bin/activate


Si está activo, verás algo como:

(venv) C:\Users\TuUsuario\Documents\mi_proyecto>

📦 5️⃣ Instalar dependencias
pip install flask scikit-fuzzy numpy


Flask → Framework web para backend.

scikit-fuzzy → Lógica difusa para recomendaciones inteligentes.

NumPy → Cálculos numéricos.

6️⃣ Guardar dependencias

Para crear un archivo requirements.txt con todas las librerías instaladas:

pip freeze > requirements.txt


En otra máquina, puedes reinstalar todo con:

pip install -r requirements.txt

🚀 Ejecución del proyecto

Con el entorno virtual activado:

python app.py


Por defecto, Flask correrá en: http://127.0.0.1:5000

Todos los endpoints estarán disponibles bajo /api/

📁 Estructura del proyecto
mi_proyecto/
│
├─ app.py                   # Entrada principal del backend
├─ controlers/
│   └─ recomendacion_controller.py  # Endpoints API
├─ services/
│   ├─ imc_service.py       # Cálculo de IMC y estado
│   ├─ logica_difusa_service.py  # Recomendaciones difusas
│   ├─ red_neuronal_service.py   # Predicción de dieta con IA
│   └─ guardar_en_archivo.py     # Guardado de resultados en JSON
├─ resultados.json          # Historial de cálculos
└─ templates/               # Archivos HTML del frontend