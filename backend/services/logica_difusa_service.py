import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# === Definición del sistema difuso ===
edad = ctrl.Antecedent(np.arange(0, 101, 1), 'edad')
imc = ctrl.Antecedent(np.arange(10, 41, 0.1), 'imc')
sexo = ctrl.Antecedent(np.arange(0, 1.1, 0.1), 'sexo')
recomendacion = ctrl.Consequent(np.arange(0, 11, 1), 'recomendacion')

# === Conjuntos difusos ===
edad['joven'] = fuzz.trimf(edad.universe, [0, 20, 35])
edad['adulto'] = fuzz.trimf(edad.universe, [30, 50, 65])
edad['mayor'] = fuzz.trimf(edad.universe, [60, 80, 100])

imc['bajo'] = fuzz.trimf(imc.universe, [10, 17, 20])
imc['normal'] = fuzz.trimf(imc.universe, [18, 22, 25])
imc['sobrepeso'] = fuzz.trimf(imc.universe, [24, 27, 30])
imc['obesidad'] = fuzz.trimf(imc.universe, [29, 35, 40])

sexo['femenino'] = fuzz.trimf(sexo.universe, [0, 0, 0.4])
sexo['masculino'] = fuzz.trimf(sexo.universe, [0.6, 1, 1])

recomendacion['baja_cal'] = fuzz.trimf(recomendacion.universe, [0, 0, 4])
recomendacion['balanceada'] = fuzz.trimf(recomendacion.universe, [3, 5, 7])
recomendacion['alta_cal'] = fuzz.trimf(recomendacion.universe, [6, 10, 10])
recomendacion['alta_prot'] = fuzz.trimf(recomendacion.universe, [8, 10, 10])

# === Reglas ===
reglas = [
    ctrl.Rule(sexo['femenino'] & imc['bajo'], recomendacion['alta_cal']),
    ctrl.Rule(sexo['femenino'] & imc['normal'], recomendacion['balanceada']),
    ctrl.Rule(sexo['femenino'] & imc['sobrepeso'], recomendacion['baja_cal']),
    ctrl.Rule(sexo['masculino'] & imc['bajo'], recomendacion['alta_prot']),
    ctrl.Rule(sexo['masculino'] & imc['normal'], recomendacion['balanceada']),
    ctrl.Rule(sexo['masculino'] & imc['obesidad'], recomendacion['baja_cal']),
    ctrl.Rule(edad['mayor'] & imc['bajo'], recomendacion['alta_prot'])
]

sistema_ctrl = ctrl.ControlSystem(reglas)

def obtener_recomendacion_difusa(edad_val, imc_val, sexo_val):
    """Ejecuta el sistema difuso y devuelve el valor de recomendación."""
    sistema = ctrl.ControlSystemSimulation(sistema_ctrl)
    sistema.input['edad'] = edad_val
    sistema.input['imc'] = imc_val
    sistema.input['sexo'] = sexo_val
    
    try:
        sistema.compute()
        valor_difuso = sistema.output['recomendacion']
    except Exception as e:
        print("⚠️ Error difuso:", e)
        valor_difuso = 0

    # Interpretación del resultado difuso
    if valor_difuso < 3:
        texto = "Baja en calorías"
    elif valor_difuso < 6:
        texto = "Balanceada"
    elif valor_difuso < 8:
        texto = "Alta en calorías"
    else:
        texto = "Alta en proteínas"

    return valor_difuso, texto
