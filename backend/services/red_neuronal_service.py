from sklearn.neural_network import MLPClassifier
import numpy as np
from services.data_menu import menus_completos
import random

# === Datos de entrenamiento sintéticos ===
X = np.array([
    [17, 20, 0], [22, 30, 0], [28, 40, 0],
    [32, 50, 1], [18, 25, 1], [25, 35, 1],
    [35, 55, 1], [20, 70, 0]
])
y = np.array([2, 1, 0, 0, 2, 1, 0, 1])  # 0=baja_cal, 1=balanceada, 2=alta_prot

modelo_dieta = MLPClassifier(hidden_layer_sizes=(6,), max_iter=1000, random_state=42)
modelo_dieta.fit(X, y)

#Generar funcion para predecir dieta
def predecir_dieta(imc, edad, sexo):
    """Predice la dieta recomendada según el IMC, edad y sexo."""
    pred = modelo_dieta.predict([[imc, edad, sexo]])[0]
    dietas = ["Baja en calorías", "Balanceada", "Alta en proteínas"]
    return dietas[pred]

# === Generar plan alimenticio según tipo de dieta ===
def generar_plan_alimenticio(tipo_dieta):
    """Genera desayuno, almuerzo, cena y snacks según tipo de dieta usando el dataset."""
    
    if tipo_dieta in menus_completos:
        # Elegir un menú aleatorio del tipo de dieta
        plan = random.choice(menus_completos[tipo_dieta])
    else:
        plan = {
            "Error": f"Tipo de dieta '{tipo_dieta}' no reconocido."
        }

    return plan