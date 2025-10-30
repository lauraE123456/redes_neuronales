
window.addEventListener('DOMContentLoaded', () => {
  const historial = JSON.parse(localStorage.getItem("historialIMC"));
  // 3️⃣ Verificar si existen los datos del usuario
  if (!historial || !historial.usuario || !historial.usuario.peso || !historial.usuario.altura) {
    const botMsg = document.createElement('div');
    botMsg.className = 'flex justify-start';
    botMsg.innerHTML = `
      <div class="bg-yellow-200 text-yellow-800 px-3 py-2 rounded-xl max-w-xs">
        Antes de continuar, por favor calcula tus datos (peso, altura, IMC, etc.) para que pueda personalizar tus recomendaciones.
      </div>`;
    chatArea.appendChild(botMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
    return; // ❌ Detiene el envío al backend
  }
  if (!historial) return;

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
// Si no hay nombre guardado, pedirlo
  if (!localStorage.getItem("userName")) {
    const namePrompt = document.createElement('div');
    namePrompt.className = 'flex justify-start';
    namePrompt.innerHTML = `
      <div class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl max-w-xs">
        ¡Hola! 😊 ¿Cómo te llamas?
      </div>`;
    chatArea.appendChild(namePrompt);
  }



// --- Cerrar modal ---
closeChatModal.addEventListener('click', () => {
  chatModal.classList.add('hidden');
});

chatModal.addEventListener('click', (e) => {
  if (e.target === chatModal) chatModal.classList.add('hidden');
});



// --- Enviar mensaje ---
sendBtn.addEventListener('click', async () => {
  const message = chatInput.value.trim();
  // 3️⃣ Verificar si existen los datos del usuario

  if (!message) return;

  // 1️⃣ Mostrar mensaje del usuario
  const userMsg = document.createElement('div');
  userMsg.className = 'flex justify-end';
  userMsg.innerHTML = `<div class="bg-green-500 text-white px-3 py-2 rounded-xl max-w-xs">${message}</div>`;
  chatArea.appendChild(userMsg);
  chatInput.value = '';
  chatArea.scrollTop = chatArea.scrollHeight;

  let userName = localStorage.getItem("userName");
    
  // Prompt personalizado\
  const datos_ia = JSON.parse(localStorage.getItem("historialIMC"));

  const systemPrompt = `
Hola ${userName}, de acuerdo con tu peso de ${datos_ia.usuario.peso} kg y tu altura de ${datos_ia.usuario.altura} m..."
Luego continúa con una recomendación breve y clara relacionada con su objetivo.
Pregunta si desea generar un tipo de entrenamiento o una dieta personalizada.

La pregunta del usuario es: "${message}".
`;
  // Si aún no hay nombre, guardar el que acaba de decir
  if (!userName) {
    localStorage.setItem("userName", message);
    
    const botMsg = document.createElement('div');
    botMsg.className = 'flex justify-start';
    botMsg.innerHTML = systemPrompt;
    chatArea.appendChild(botMsg);
    return; // No llamar al backend todavía
  }

  // Mostrar mensaje "Pensando..."
  const botMsg = document.createElement('div');
  botMsg.className = 'flex justify-start';
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

