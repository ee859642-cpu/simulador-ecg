const API_URL = "https://simulador-ecg.onrender.com";
const JUGADOR_ID = "medico_estudiante_1";

let casoActualId = 1;
let nivelActual = 1;
let canvas, ctx;
let animacionId = null;
let offsetOnda = 0;
let datosCasoActual = null;

const ELECTRODOS_REQUERIDOS = ["V1", "V2", "V3", "V4", "V5", "V6"];
let electrodosColocados = new Set();

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("ecg-wave");
    if (canvas) {
        ctx = canvas.getContext("2d");
        ajustarTamanoCanvas();
        window.addEventListener("resize", ajustarTamanoCanvas);
    }

    inicializarDragAndDrop();
    actualizarBannerNivel(1, "Posicionamiento Anatómico de Electrodos");
});

function actualizarBannerNivel(numeroNivel, tituloNivel) {
    const badge = document.getElementById("level-badge");
    const title = document.getElementById("level-title");
    if (badge) badge.innerText = `NIVEL ${numeroNivel}`;
    if (title) title.innerText = tituloNivel;
}

// --- FLUJO DE NIVELES ---

function comenzarNivel1() {
    nivelActual = 1;
    document.getElementById("modal-nivel1")?.classList.add("hidden");
}

function verificarElectrodosCompletos() {
    if (electrodosColocados.size === ELECTRODOS_REQUERIDOS.length) {
        setTimeout(() => {
            document.getElementById("modal-nivel2")?.classList.remove("hidden");
        }, 300);
    }
}

async function comenzarNivel2() {
    nivelActual = 2;
    actualizarBannerNivel(2, "Análisis de Señales e Interpretación de ECG");
    
    document.getElementById("modal-nivel2")?.classList.add("hidden");
    document.getElementById("monitor-panel")?.classList.remove("hidden");
    document.getElementById("decision-box")?.classList.add("hidden"); // Mantener oculto la IA en Nivel 2

    await cargarDatosCaso();
    // SE ELIMINÓ EL TEMPORIZADOR AUTOMÁTICO AL NIVEL 3.
    // El usuario permanece en Nivel 2 analizando la señal indefinidamente.
}

// --- CARGA DE CASO Y ECG ---

async function cargarDatosCaso() {
    try {
        const respuesta = await fetch(`${API_URL}/obtener_caso/${casoActualId}`);
        if (!respuesta.ok) throw new Error("Error al conectar con la API");

        datosCasoActual = await respuesta.json();
        actualizarInterfazCaso(datosCasoActual);

        casoActualId = (casoActualId % 3) + 1;
    } catch (error) {
        console.error("Error cargando paciente:", error);
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

function actualizarInterfazCaso(datos) {
    const elPatientInfo = document.getElementById("patient-info");
    const elBpm = document.getElementById("bpm-display");

    if (elPatientInfo) elPatientInfo.innerText = `Paciente: ID ${datos.paciente} (${datos.edad} años)`;
    if (elBpm) elBpm.innerText = `BPM: ${datos.frecuencia_cardiaca_bpm}`;

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
            } else {
                let posBrad = (x + offsetOnda) % 260;
                if (posBrad > 20 && posBrad < 40) y -= Math.sin((posBrad - 20) * Math.PI / 20) * 7;
                else if (posBrad >= 55 && posBrad < 60) y += 5;
                else if (posBrad >= 60 && posBrad < 70) y -= 50;
                else if (posBrad >= 70 && posBrad < 75) y += 10;
                else if (posBrad > 100 && posBrad < 140) y -= Math.sin((posBrad - 100) * Math.PI / 40) * 12;
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

// --- DRAG AND DROP ---

function inicializarDragAndDrop() {
    const electrodos = document.querySelectorAll(".electrode");
    const zonasDrop = document.querySelectorAll(".dropzone");

    electrodos.forEach(el => {
        el.setAttribute("draggable", "true");
        el.addEventListener("dragstart", (e) => {
            const lead = el.dataset.lead || el.innerText.trim();
            e.dataTransfer.setData("text/plain", lead);
        });
        el.addEventListener("click", () => {
            const lead = el.dataset.lead || el.innerText.trim();
            colocarElectrodo(lead);
        });
    });

    zonasDrop.forEach(zona => {
        zona.addEventListener("dragover", (e) => {
            e.preventDefault();
            zona.classList.add("hover");
        });
        zona.addEventListener("dragleave", () => {
            zona.classList.remove("hover");
        });
        zona.addEventListener("drop", (e) => {
            e.preventDefault();
            zona.classList.remove("hover");
            const lead = e.dataTransfer.getData("text/plain");
            if (zona.dataset.target === lead) {
                colocarElectrodo(lead);
            }
        });
        zona.addEventListener("click", () => {
            const lead = zona.dataset.target;
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
        zona.innerText = `✓ ${lead}`;
    }

    if (elOrigen) {
        elOrigen.style.opacity = "0.2";
        elOrigen.style.pointerEvents = "none";
    }

    electrodosColocados.add(lead);
    verificarElectrodosCompletos();
}

function abrirModal(tipo) {
    alert(`Sección de ${tipo}`);
}
