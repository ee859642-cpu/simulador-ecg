// URL base de la API FastAPI desplegada en Render
const API_URL = "https://simulador-ecg.onrender.com";
// Identificador del usuario/estudiante
const JUGADOR_ID = "medico_estudiante_1";

// Estado local de la aplicación
let casoActualId = 1;
let nivelActual = 1;
let canvas, ctx;
let animacionId = null;
let offsetOnda = 0;
let datosCasoActual = null;

// Configuración de electrodos requeridos (Nivel 1)
const ELECTRODOS_REQUERIDOS = ["V1", "V2", "V3", "V4", "V5", "V6"];
let electrodosColocados = new Set();

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Canvas del ECG
    canvas = document.getElementById("ecg-wave");
    if (canvas) {
        ctx = canvas.getContext("2d");
        ajustarTamanoCanvas();
        window.addEventListener("resize", ajustarTamanoCanvas);
    }

    inicializarDragAndDrop();
    actualizarBannerNivel(1, "Posicionamiento Anatómico de Electrodos");
});

// Actualiza la etiqueta del banner superior
function actualizarBannerNivel(numeroNivel, tituloNivel) {
    const badge = document.getElementById("level-badge");
    const title = document.getElementById("level-title");
    if (badge) badge.innerText = `NIVEL ${numeroNivel}`;
    if (title) title.innerText = tituloNivel;
}

// --- FLUJO DE NIVELES Y TRANSICIONES ---

// Nivel 1: Cierre del modal inicial de bienvenida
function comenzarNivel1() {
    nivelActual = 1;
    const modalNivel1 = document.getElementById("modal-nivel1");
    if (modalNivel1) modalNivel1.classList.add("hidden");
}

// Transición del Nivel 1 al Nivel 2
function verificarElectrodosCompletos() {
    if (electrodosColocados.size === ELECTRODOS_REQUERIDOS.length) {
        setTimeout(() => {
            const modalNivel2 = document.getElementById("modal-nivel2");
            if (modalNivel2) modalNivel2.classList.remove("hidden");
        }, 400);
    }
}

// Nivel 2: Iniciar visualización de ECG sin sugerencia de IA
async function comenzarNivel2() {
    nivelActual = 2;
    actualizarBannerNivel(2, "Análisis de Señales e Interpretación de ECG");
    
    document.getElementById("modal-nivel2")?.classList.add("hidden");
    document.getElementById("monitor-panel")?.classList.remove("hidden");
    document.getElementById("decision-box")?.classList.add("hidden"); // Ocultar IA aún

    await cargarDatosCaso();

    // Luego de 4 segundos analizando la señal, avanzar automáticamente al Nivel 3
    setTimeout(() => {
        const modalNivel3 = document.getElementById("modal-nivel3");
        if (modalNivel3) modalNivel3.classList.remove("hidden");
    }, 4000);
}

// Nivel 3: Habilitar diagnóstico asistido por IA y toma de decisión
function comenzarNivel3() {
    nivelActual = 3;
    actualizarBannerNivel(3, "Evaluación de IA & Toma de Decisión Clínica");

    document.getElementById("modal-nivel3")?.classList.add("hidden");
    document.getElementById("decision-box")?.classList.remove("hidden"); // Revelar sugerencia de IA
}

// --- CARGA DE DATOS DESDE RENDER ---

async function cargarDatosCaso() {
    try {
        const respuesta = await fetch(`${API_URL}/obtener_caso/${casoActualId}`);
        if (!respuesta.ok) throw new Error("Error al conectar con la API");

        datosCasoActual = await respuesta.json();
        actualizarInterfazCaso(datosCasoActual);

        casoActualId = (casoActualId % 3) + 1;
    } catch (error) {
        console.error("Error cargando paciente:", error);
        alert("No se pudo conectar con el servidor backend en Render.");
    }
}

function iniciarNuevoCaso() {
    reiniciarElectrodos();
    document.getElementById("monitor-panel")?.classList.add("hidden");
    document.getElementById("decision-box")?.classList.add("hidden");
    comenzarNivel1();
}

function reiniciarElectrodos() {
    electrodosColocados.clear();
    const zonasDrop = document.querySelectorAll(".dropzone");
    zonasDrop.forEach(zona => {
        zona.classList.remove("occupied");
        zona.style.backgroundColor = "";
        zona.style.borderColor = "";
        zona.style.color = "";
        const lead = zona.dataset.target;
        zona.innerText = lead;
    });

    const electrodos = document.querySelectorAll(".electrode");
    electrodos.forEach(el => {
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
    });
}

// --- ACTUALIZACIÓN VISUAL Y CANVAS DE ECG ---

function actualizarInterfazCaso(datos) {
    const elPatientInfo = document.getElementById("patient-info");
    const elBpm = document.getElementById("bpm-display");
    const elAiText = document.getElementById("ai-text");
    const elAiConf = document.getElementById("ai-confidence");

    if (elPatientInfo) elPatientInfo.innerText = `Paciente: ID ${datos.paciente} (${datos.edad} años)`;
    if (elBpm) elBpm.innerText = `BPM: ${datos.frecuencia_cardiaca_bpm}`;
    if (elAiText) elAiText.innerText = `Sugerencia IA: ${datos.ia_sugerencia}`;
    if (elAiConf) elAiConf.innerText = `Confianza IA: ${datos.ia_confianza_porcentaje}%`;

    ajustarTamanoCanvas();
    iniciarTrazadoECG(datos.ritmo_patologia_real);
}

function ajustarTamanoCanvas() {
    if (!canvas || !canvas.parentElement) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}

function iniciarTrazadoECG(ritmo) {
    if (!canvas || !ctx) return;
    if (animacionId) cancelAnimationFrame(animacionId);

    function dibujar() {
        ctx.fillStyle = "#030B12";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        dibujarCuadricula();

        ctx.strokeStyle = "#00FF66";
        ctx.lineWidth = 2;
        ctx.beginPath();

        let x = 0;
        let yBase = canvas.height / 2;

        while (x < canvas.width) {
            let y = yBase;

            if (ritmo === "Sinus Rhythm") {
                let pos = (x + offsetOnda) % 200;
                if (pos > 20 && pos < 40) y -= Math.sin((pos - 20) * Math.PI / 20) * 8;
                else if (pos >= 50 && pos < 55) y += 6;
                else if (pos >= 55 && pos < 65) y -= 55;
                else if (pos >= 65 && pos < 70) y += 12;
                else if (pos > 90 && pos < 130) y -= Math.sin((pos - 90) * Math.PI / 40) * 14;

            } else if (ritmo === "Sinus Bradycardia") {
                let posBrad = (x + offsetOnda) % 260;
                if (posBrad > 20 && posBrad < 40) y -= Math.sin((posBrad - 20) * Math.PI / 20) * 7;
                else if (posBrad >= 55 && posBrad < 60) y += 5;
                else if (posBrad >= 60 && posBrad < 70) y -= 50;
                else if (posBrad >= 70 && posBrad < 75) y += 10;
                else if (posBrad > 100 && posBrad < 140) y -= Math.sin((posBrad - 100) * Math.PI / 40) * 12;

            } else {
                let ruido1 = Math.sin((x + offsetOnda) * 0.1) * 22;
                let ruido2 = Math.cos((x * 0.3) + offsetOnda) * 15;
                let ruido3 = (Math.random() - 0.5) * 18;
                y = yBase + ruido1 + ruido2 + ruido3;
            }

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            x += 2;
        }

        ctx.stroke();
        offsetOnda += 2.5;
        animacionId = requestAnimationFrame(dibujar);
    }

    dibujar();
}

function dibujarCuadricula() {
    ctx.strokeStyle = "rgba(0, 255, 102, 0.08)";
    ctx.lineWidth = 1;

    const tamanoCuadro = 20;
    for (let x = 0; x < canvas.width; x += tamanoCuadro) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += tamanoCuadro) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// --- LÓGICA DE DRAG & DROP E INTERACCIÓN ---

function inicializarDragAndDrop() {
    const electrodos = document.querySelectorAll(".electrode");
    const zonasDrop = document.querySelectorAll(".dropzone");

    electrodos.forEach(el => {
        el.setAttribute("draggable", "true");

        el.addEventListener("dragstart", (e) => {
            const lead = el.dataset.lead || el.innerText.trim();
            e.dataTransfer.setData("text/plain", lead);
            e.dataTransfer.effectAllowed = "move";
        });

        el.addEventListener("click", () => {
            const lead = el.dataset.lead || el.innerText.trim();
            colocarElectrodo(lead);
        });
    });

    zonasDrop.forEach(zona => {
        zona.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            zona.classList.add("hover");
        });

        zona.addEventListener("dragleave", () => {
            zona.classList.remove("hover");
        });

        zona.addEventListener("drop", (e) => {
            e.preventDefault();
            zona.classList.remove("hover");
            const lead = e.dataTransfer.getData("text/plain");
            
            if (zona.dataset.target === lead || zona.innerText.includes(lead)) {
                colocarElectrodo(lead);
            }
        });

        zona.addEventListener("click", () => {
            const lead = zona.dataset.target || zona.innerText.trim();
            if (lead) colocarElectrodo(lead);
        });
    });
}

function colocarElectrodo(lead) {
    if (!ELECTRODOS_REQUERIDOS.includes(lead)) return;

    const zona = document.querySelector(`.dropzone[data-target="${lead}"]`);
    const elOrigen = document.querySelector(`.electrode[data-lead="${lead}"]`);

    if (zona) {
        zona.classList.add("occupied");
        zona.style.backgroundColor = "#22c55e";
        zona.style.borderColor = "#ffffff";
        zona.style.color = "#ffffff";
        zona.innerText = `✓ ${lead}`;
    }

    if (elOrigen) {
        elOrigen.style.opacity = "0.2";
        elOrigen.style.pointerEvents = "none";
    }

    electrodosColocados.add(lead);
    verificarElectrodosCompletos();
}

// --- EVALUACIÓN DE DECISIÓN Y MODALES DE FEEDBACK ---

async function tomarDecision(confiaEnIa, diagnosticoManual = null) {
    const casoEvaluado = (casoActualId === 1) ? 3 : casoActualId - 1;

    try {
        const respuesta = await fetch(`${API_URL}/evaluar_decision/?jugador_id=${JUGADOR_ID}&caso_id=${casoEvaluado}&confia_en_ia=${confiaEnIa}`, {
            method: "POST"
        });

        const resultado = await respuesta.json();
        
        const elBias = document.getElementById("bias-display");
        if (elBias) elBias.innerText = `Índice Dependencia IA: ${Math.round(resultado.indice_dependencia_acumulado * 100)}%`;

        mostrarFeedbackModal(resultado);

    } catch (error) {
        console.error("Error evaluando decisión:", error);
    }
}

function mostrarSelectorManual() {
    document.getElementById("modal-selector")?.classList.remove("hidden");
}

function cerrarSelectorManual() {
    document.getElementById("modal-selector")?.classList.add("hidden");
}

function confirmarDecisionManual() {
    const sel = document.getElementById("select-patologia");
    const valor = sel ? sel.value : null;
    cerrarSelectorManual();
    tomarDecision(false, valor);
}

function mostrarFeedbackModal(res) {
    const modal = document.getElementById("modal-feedback");
    const badge = document.getElementById("feedback-badge");
    const title = document.getElementById("feedback-title");
    const msg = document.getElementById("feedback-message");
    const realDiag = document.getElementById("feedback-real-diag");
    const biasVal = document.getElementById("feedback-bias-val");

    if (!modal) return;

    if (res.resultado === "CORRECTO") {
        if (badge) { badge.innerText = "CORRECTO"; badge.className = "badge badge-success"; }
        if (title) title.innerText = "¡Diagnóstico Correcto!";
    } else {
        if (badge) { badge.innerText = "INCORRECTO"; badge.className = "badge badge-error"; }
        if (title) title.innerText = "¡Error Clínico Detectado!";
    }

    if (msg) msg.innerText = res.mensaje;
    if (realDiag) realDiag.innerText = res.diagnostico_correcto;
    if (biasVal) biasVal.innerText = `${Math.round(res.indice_dependencia_acumulado * 100)}%`;

    modal.classList.remove("hidden");
}

function cerrarFeedbackModal() {
    document.getElementById("modal-feedback")?.classList.add("hidden");
}

function abrirModal(tipo) {
    const overlay = document.getElementById("modal-overlay");
    const body = document.getElementById("modal-body");
    if (!overlay || !body) return;

    if (tipo === 'ajustes') {
        body.innerHTML = "<h3>⚙️ Ajustes de Simulación</h3><p>Sensibilidad del sensor y configuración de pantalla.</p>";
    } else if (tipo === 'patologias') {
        body.innerHTML = "<h3>📚 Base de Datos (27 Patologías)</h3><p>Listado de ritmos cardíacos y criterios diagnósticos.</p>";
    } else if (tipo === 'metricas') {
        body.innerHTML = "<h3>🧠 Modelo de IA y Sesgo de Automatización</h3><p>Métricas acumuladas de desempeño clínico frente a las recomendaciones de la IA.</p>";
    }

    overlay.classList.remove("hidden");
}

function cerrarModal() {
    document.getElementById("modal-overlay")?.classList.add("hidden");
}
