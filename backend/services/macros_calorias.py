def calcular_macros(imc, edad, sexo):
    # Esto es un ejemplo simplificado, puedes ajustarlo
    # Calcula calorías según TMB simple (Harris-Benedict simplificado)
    if sexo == 1:  # Hombre
        tmb = 66 + (13.7 * imc*25) + (5 * 170) - (6.8 * edad)
    else:  # Mujer
        tmb = 655 + (9.6 * imc*25) + (1.8 * 170) - (4.7 * edad)
    
    calorias = round(tmb * 1.2)  # factor de actividad ligera
    proteinas = round(calorias * 0.3 / 4)  # 30% calorías proteína
    grasas = round(calorias * 0.25 / 9)  # 25% calorías grasa
    carbs = round(calorias * 0.45 / 4)  # 45% calorías carbs
    return calorias, proteinas, carbs, grasas
