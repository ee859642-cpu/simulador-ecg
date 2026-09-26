const API_URL = "https://simulador-ecg.onrender.com";

let casoActualId = 1;
let nivelActual = 1;
let aciertosNivel2 = 0;
const META_ACIERTOS_NIVEL2 = 10;

let canvas, ctx;
let animacionId = null;
let offsetOnda = 0;
let datosCasoActual = null;

const TRATAMIENTOS = {
    "Sinus Rhythm": "Ritmo cardíaco normal y saludable. No requiere tratamiento farmacológico ni intervención. Se recomienda mantener hábitos de vida saludables.",
    "Sinus Bradycardia": "Frecuencia cardíaca < 60 BPM. Si el paciente está asintomático, solo requiere observación. En presencia de mareos o síncope, considerar Atropina EV o marcapasos temporal.",
    "Sinus Tachycardia": "Frecuencia cardíaca > 100 BPM. Generalmente secundaria a fiebre, ansiedad, deshidratación o ejercicio. Tratar la causa subyacente (reposición de fluidos, control del dolor o ansiolíticos)."
};

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

function actualizarContadorAciertos() {
    const scoreBadge = document.getElementById("score-badge");
    if (scoreBadge) {
        scoreBadge.innerText = `🎯 Aciertos: ${aciertosNivel2} / ${META_ACIERTOS_NIVEL2}`;
        scoreBadge.classList.remove("hidden");
    }
}

function comenzarNivel1() {
    nivelActual = 1;
    document.getElementById("modal-nivel1")?.classList.add("hidden");
    document.getElementById("ai-panel")?.classList.add("hidden");
    document.getElementById("score-badge")?.classList.add("hidden");
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
    actualizarContadorAciertos();
    
    document.getElementById("modal-nivel2")?.classList.add("hidden");
    document.getElementById("monitor-panel")?.classList.remove("hidden");
    document.getElementById("ai-panel")?.classList.remove("hidden");

    await cargarDatosCaso();
}

async function cargarDatosCaso() {
    try {
        const respuesta = await fetch(`${API_URL}/obtener_caso/${casoActualId}`);
        if (!respuesta.ok) throw new Error("Error al conectar con la API");

        datosCasoActual = await respuesta.json();
        actualizarInterfazCaso(datosCasoActual);

        // Selección cíclica entre los casos disponibles
        casoActualId = (casoActualId % 3) + 1;
    } catch (error) {
        console.error("Error cargando paciente:", error);
    }
}

function actualizarInterfazCaso(datos) {
    const elPatientInfo = document.getElementById("patient-info");
    const elBpm = document.getElementById("bpm-display");
    const elAiDiag = document.getElementById("ai-diagnosis-text");
    const elAiConf = document.getElementById("ai-confidence-text");

    if (elPatientInfo) elPatientInfo.innerText = `Paciente: ID ${datos.paciente} (${datos.edad} años)`;
    if (elBpm) elBpm.innerText = `BPM: ${datos.frecuencia_cardiaca_bpm}`;
    
    if (elAiDiag) elAiDiag.innerText = datos.prediccion_ia || "Sinus Rhythm";
    if (elAiConf) elAiConf.innerText = `Confianza: ${datos.confianza_ia || 98}%`;

    ajustarTamanoCanvas();
    iniciarTrazadoECG(datos.ritmo_patologia_real);
}

function tomarDecisionIA(confiaEnIA) {
    const ritmoReal = datosCasoActual?.ritmo_patologia_real || "Sinus Rhythm";
    const prediccionIA = datosCasoActual?.prediccion_ia || "Sinus Rhythm";
    const esCorrecto = (prediccionIA.toLowerCase() === ritmoReal.toLowerCase());

    if (esCorrecto) {
        aciertosNivel2++;
        actualizarContadorAciertos();
    }

    mostrarResultadoModal(
        esCorrecto ? "¡Diagnóstico Correcto!" : "Diagnóstico Incorrecto",
        esCorrecto,
        ritmoReal
    );
}

function abrirModalManual() {
    document.getElementById("modal-manual")?.classList.remove("hidden");
}

function cerrarModalManual() {
    document.getElementById("modal-manual")?.classList.add("hidden");
}

function evaluarDiagnosticoManual() {
    const select = document.getElementById("select-diagnostico");
    const seleccion = select.value;
    const ritmoReal = datosCasoActual?.ritmo_patologia_real || "Sinus Rhythm";
    
    cerrarModalManual();

    const esCorrecto = (seleccion.toLowerCase() === ritmoReal.toLowerCase());

    if (esCorrecto) {
        aciertosNivel2++;
        actualizarContadorAciertos();
    }

    mostrarResultadoModal(
        esCorrecto ? "¡Análisis Manual Acertado!" : "Análisis Manual Incorrecto",
        esCorrecto,
        ritmoReal
    );
}

function mostrarResultadoModal(titulo, esCorrecto, ritmoReal) {
    const badge = document.getElementById("res-status-badge");
    const realDiag = document.getElementById("res-real-diag");
    const treatment = document.getElementById("res-treatment-text");

    document.getElementById("res-status-title").innerText = titulo;
    
    if (badge) {
        badge.innerText = esCorrecto ? "✓ ACIERTO" : "✖ ERROR";
        badge.className = `result-badge ${esCorrecto ? "success" : "error"}`;
    }

    if (realDiag) realDiag.innerText = ritmoReal;
    if (treatment) treatment.innerText = TRATAMIENTOS[ritmoReal] || "Tratamiento no especificado.";

    document.getElementById("modal-resultado")?.classList.remove("hidden");
}

async function siguienteCasoNivel2() {
    document.getElementById("modal-resultado")?.classList.add("hidden");

    if (aciertosNivel2 >= META_ACIERTOS_NIVEL2) {
        document.getElementById("modal-nivel2-completado")?.classList.remove("hidden");
    } else {
        await cargarDatosCaso();
    }
}

function continuarPracticandoNivel2() {
    document.getElementById("modal-nivel2-completado")?.classList.add("hidden");
    cargarDatosCaso();
}

function reiniciarDesdeNivel1() {
    aciertosNivel2 = 0;
    actualizarContadorAciertos();
    reiniciarElectrodos();
    document.getElementById("monitor-panel")?.classList.add("hidden");
    document.getElementById("ai-panel")?.classList.add("hidden");
    actualizarBannerNivel(1, "Posicionamiento Anatómico de Electrodos");
    comenzarNivel1();
}

function reiniciarElectrodos() {
    electrodosColocados.clear();
    const zonasDrop = document.querySelectorAll(".dropzone");
    zonasDrop.forEach(zona => {
        zona.classList.remove("occupied");
        zona.innerText = zona.dataset.target;
    });

    const electrodos = document.querySelectorAll(".electrode");
    electrodos.forEach(el => {
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
    });
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
            } else if (ritmo === "Sinus Tachycardia") {
                let posTaq = (x + offsetOnda) % 120;
                if (posTaq > 10 && posTaq < 25) y -= Math.sin((posTaq - 10) * Math.PI / 15) * 8;
                else if (posTaq >= 30 && posTaq < 35) y += 6;
                else if (posTaq >= 35 && posTaq < 45) y -= 55;
                else if (posTaq >= 45 && posTaq < 50) y += 12;
                else if (posTaq > 60 && posTaq < 90) y -= Math.sin((posTaq - 60) * Math.PI / 30) * 14;
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
        zona.addEventListener("dragover", (e) => e.preventDefault());
        zona.addEventListener("drop", (e) => {
            e.preventDefault();
            const lead = e.dataTransfer.getData("text/plain");
            if (zona.dataset.target === lead) colocarElectrodo(lead);
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
