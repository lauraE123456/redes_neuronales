def calcular_imc(peso, altura):
    """
    Calcula el IMC dado el peso (kg) y la altura (m).
    """
    if altura <= 0:
        raise ValueError("La altura debe ser mayor que 0")
    imc = peso / (altura ** 2)
    return round(imc, 2)  # redondeamos a 2 decimales

def estado_imc(imc):
    if imc < 18:
        return "Bajo peso"
    elif 18 <= imc < 25:
        return "Normal"
    elif 25 <= imc < 30:
        return "Sobrepeso"
    else:
        return "Obesidad"
