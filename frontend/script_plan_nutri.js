
window.addEventListener('DOMContentLoaded', () => {
  const historial = JSON.parse(localStorage.getItem("historialIMC"));
 

  const resultado = historial.resultado;
  const recomendacion = resultado.recomendacion_difusa || "No disponible";
  const dieta = resultado.plan_dieta || "No disponible";

  document.getElementById('explicacionIA').textContent =
    `Basado en tu objetivo y tu IMC, la IA recomienda una dieta ${recomendacion}. Con alimentos cuidadosamente seleccionados para ayudarte a sentirte más fuerte, saludable y lleno de energía.`;

  // Si tienes macros/calorías
  if (resultado.calorias) document.getElementById('calorias').textContent = `${resultado.calorias} kcal`;
  if (resultado.proteinas) document.getElementById('proteinas').textContent = `${resultado.proteinas} g`;
  if (resultado.carbs) document.getElementById('carbs').textContent = `${resultado.carbs} g`;
  if (resultado.grasas) document.getElementById('grasas').textContent = `${resultado.grasas} g`;

  if (dieta.desayuno) document.getElementById('desayuno').textContent = dieta.desayuno;
  if (dieta.almuerzo) document.getElementById('almuerzo').textContent = dieta.almuerzo;
  if (dieta.cena) document.getElementById('cena').textContent = dieta.cena;
  if (dieta.snacks) document.getElementById('snacks').textContent = dieta.snacks;
});

// ===== Generar nueva dieta =====
document.getElementById("btnGenerar").addEventListener("click", async () => {
    const historial = JSON.parse(localStorage.getItem("historialIMC"));
    if (!historial) return alert("No hay datos del usuario disponibles");

    const { imc, edad, sexo } = historial.resultado;
    const datos_locales = JSON.parse(localStorage.getItem("historialIMC"));
    const tipo_dieta=datos_locales.resultado.recomendacion_difusa
    console.log(tipo_dieta)
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/nueva_dieta/${tipo_dieta}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imc, edad, sexo })
        });

        const data = await response.json();
        const menu = data.plan_dieta;
      
        // Actualizar DOM con la nueva dieta
        document.getElementById('desayuno').textContent = menu.desayuno;
        document.getElementById('almuerzo').textContent = menu.almuerzo;
        document.getElementById('cena').textContent = menu.cena;
        document.getElementById('snacks').textContent = menu.snacks;
          historial.resultado = { ...historial.resultado, plan_dieta: menu }; // reemplazamos el plan_dieta
    localStorage.setItem("historialIMC", JSON.stringify(historial));

        // Actualizar explicación IA con tipo de dieta
        document.getElementById('explicacionIA').textContent =
          `Basado en tu objetivo y tu IMC, la IA recomienda una dieta ${data.tipo_dieta}. Con alimentos cuidadosamente seleccionados para ayudarte a sentirte más fuerte, saludable y lleno de energía.`;

        console.log("Nueva dieta generada:", data.tipo_dieta, menu);
    } catch (error) {
        console.error("Error al generar nueva dieta:", error);
        alert("Ocurrió un error generando la dieta. Intenta de nuevo.");
    }
});

//descargar documento dieta
document.getElementById("btnDescargar").addEventListener("click", () => {
    // Obtener los datos de la dieta desde el DOM
    const desayuno = document.getElementById("desayuno")?.textContent || "No especificado";
    const almuerzo = document.getElementById("almuerzo")?.textContent || "No especificado";
    const cena = document.getElementById("cena")?.textContent || "No especificado";
    const snacks = document.getElementById("snacks")?.textContent || "No especificado";
    const explicacion = document.getElementById("explicacionIA")?.textContent || "";

    // Construir el texto del archivo
    const contenido = 
`🧠 Plan Nutricional Personalizado

${explicacion}

🍽️ Dieta Recomendada:
---------------------------------
🥣 Desayuno:
${desayuno}

🍛 Almuerzo:
${almuerzo}

🌙 Cena:
${cena}

🍏 Snacks:
${snacks}

---------------------------------
Generado por IA Nutricional 💚`;

    // Crear el blob y el enlace de descarga
    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "Mi_Dieta_Personalizada.txt";
    enlace.click();

    // Liberar memoria
    URL.revokeObjectURL(url);
  });
  //inicio para conectar el chatbot con gemini
  const btnPreferencias = document.getElementById('btnPreferencias');
const chatModal = document.getElementById('chatModal');
const closeChatModal = document.getElementById('closeChatModal');
const chatArea = document.getElementById('chatArea');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// --- Abrir modal ---
btnPreferencias.addEventListener('click', () => {
  chatModal.classList.remove('hidden');
  chatInput.focus();
});




// --- Cerrar modal ---
closeChatModal.addEventListener('click', () => {
  chatModal.classList.add('hidden');
});

chatModal.addEventListener('click', (e) => {
  if (e.target === chatModal) chatModal.classList.add('hidden');
});

// --- Función para agregar mensajes al chat ---
function addMessage(text, side = "bot", color = "bg-gray-200 text-gray-800") {
  const msg = document.createElement("div");
  msg.className = `flex ${side === "bot" ? "justify-start" : "justify-end"}`;
  msg.innerHTML = `<div class="${color} px-3 py-2 rounded-xl max-w-xs whitespace-pre-line">${text}</div>`;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// --- Función para bloquear el chat ---
function bloquearChat() {
  addMessage(
    "⚠️ Antes de continuar, por favor calcula tus datos (peso, altura, IMC, etc.) para que pueda personalizar tus recomendaciones.",
    "bot",
    "bg-yellow-200 text-yellow-800"
  );
  chatInput.disabled = true;
  sendBtn.disabled = true;
  chatInput.placeholder = "Por favor calcula tu IMC antes de continuar...";
  sendBtn.classList.add("opacity-50", "cursor-not-allowed");
}

// --- Función para desbloquear el chat ---
function desbloquearChat() {
  chatInput.disabled = false;
  sendBtn.disabled = false;
  chatInput.placeholder = "Escribe tu mensaje...";
  sendBtn.classList.remove("opacity-50", "cursor-not-allowed");
}

// --- Verificar datos del IMC al iniciar ---
let datos_ia = JSON.parse(localStorage.getItem("historialIMC"));
let userName = localStorage.getItem("userName");

if (!datos_ia || !datos_ia.resultado || !datos_ia.resultado.imc) {
  bloquearChat();

  // Esperar a que el usuario calcule el IMC (otro script actualiza localStorage)
  window.addEventListener("storage", (event) => {
    if (event.key === "historialIMC") {
      datos_ia = JSON.parse(event.newValue);
      if (datos_ia && datos_ia.resultado && datos_ia.resultado.imc) {
        desbloquearChat();
        addMessage("✅ ¡Gracias! Ya tengo tus datos. 😊", "bot", "bg-green-200 text-green-800");
        if (!userName) addMessage("¡Hola! 😊 ¿Cómo te llamas?", "bot");
      }
    }
  });
} else {
  // Si ya hay datos, preguntar por el nombre si no existe
  if (!userName) addMessage("¡Hola! 😊 ¿Cómo te llamas?", "bot");
}

// --- Enviar mensaje ---
sendBtn.addEventListener("click", async () => {
  const message = chatInput.value.trim();
  if (!message) return;

  // Mostrar mensaje del usuario
  addMessage(message, "user", "bg-green-500 text-white");
  chatInput.value = "";

  // --- Releer datos actualizados ---
  datos_ia = JSON.parse(localStorage.getItem("historialIMC"));
  userName = localStorage.getItem("userName");

  // 1️⃣ Si no hay datos del IMC, advertir y salir
  if (!datos_ia || !datos_ia.resultado || !datos_ia.resultado.imc) {
    bloquearChat();
    return;
  }

  // 2️⃣ Si no hay nombre, guardar el que acaba de decir
  if (!userName) {
    localStorage.setItem("userName", message);
    userName = message;

    const systemPrompt = `
¡Encantado de conocerte, ${userName}! 😄  
De acuerdo con tu peso de ${datos_ia.usuario.peso} kg y tu altura de ${datos_ia.usuario.altura} m, tu IMC es ${datos_ia.resultado.imc}.
Según esto, puedo recomendarte rutinas o dietas personalizadas.  
¿Deseas que te genere un tipo de entrenamiento o una dieta?`;

    addMessage(systemPrompt, "bot", "bg-blue-100 text-blue-800");
    return; // 🔹 No llamar al backend todavía
  }

  // 3️⃣ Si ya hay nombre e IMC, hablar con la IA (Gemini vía backend Flask)
  const botMsg = document.createElement("div");
  botMsg.className = "flex justify-start";
  botMsg.innerHTML = `<div class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl max-w-xs italic">Pensando...</div>`;
  chatArea.appendChild(botMsg);
  chatArea.scrollTop = chatArea.scrollHeight;

  try {
    // 3️⃣ Llamar al backend (Flask con Gemini)
    const response = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    console.log("Data que me trae la ia",data)
    
    // 4️⃣ Mostrar respuesta de la IA
    botMsg.innerHTML = `<div class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl max-w-xs">${data.reply}</div>`;
  } catch (error) {
    console.error("Error al obtener respuesta del backend:", error);
    botMsg.innerHTML = `<div class="bg-red-500 text-white px-3 py-2 rounded-xl max-w-xs">Error al conectar con la IA.</div>`;
  }

  chatArea.scrollTop = chatArea.scrollHeight;
});

// --- Enviar con Enter ---
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

