const API_URL = "https://simulador-ecg.onrender.com";

// BASE DE DATOS DE LOS 27 RITMOS EXACTOS DEL PROFESOR
const RITMOS_DOCENTE = {
    "Sinus rhythm": { bpm: 72, desc: "Ritmo sinusal normal. Frecuencia dentro del rango fisiológico estándar." },
    "Sinus bradycardia": { bpm: 54, desc: "Bradicardia sinusal. Frecuencia cardíaca por debajo de 60 BPM." },
    "Sinus Tachycardia": { bpm: 138, desc: "Taquicardia sinusal. Frecuencia cardíaca elevada por encima de 100 BPM." },
    "Sinus Arhythmia": { bpm: 78, desc: "Arritmia sinusal. Variación fisiológica del ritmo coordinado con la respiración." },
    "Sinus exits block": { bpm: 48, desc: "Bloqueo de salida sinusal. Fallo de conducción del impulso desde el nodo SA." },
    "Sinus arrest": { bpm: 54, desc: "Paro sinusal. Pausa en la actividad del nodo sinusal." },
    "NSR with PAC(PJC) NSR with premature atrial": { bpm: 84, desc: "Ritmo sinusal normal con despolarizaciones auriculares/unccionales prematuras." },
    "Supraventricular tachycardia": { bpm: 180, desc: "Taquicardia supraventricular. Ritmo rápido originado por encima de los ventrículos." },
    "Atrial Fibrillallation": { bpm: 90, desc: "Fibrilación auricular. Actividad auricular desorganizada e irregular." },
    "Atrial Flutter": { bpm: 75, desc: "Aleteo auricular. Circuito de reentrada auricular con ondas en diente de sierra." },
    "Paced Atrial rhythm": { bpm: 60, desc: "Ritmo auricular marcapaseado. Estimulación eléctrica auricular por dispositivo." },
    "NSR with 1 AVB(NSR with firot degree AV Block)": { bpm: 74, desc: "Ritmo sinusal con Bloqueo AV de 1er grado (intervalo PR prolongado constante)." },
    "2 AVB type I": { bpm: 48, desc: "Bloqueo AV de 2do grado Tipo I (Mobitz I / Wenckebach). Prolongación progresiva de PR." },
    "2 AVB type II": { bpm: 60, desc: "Bloqueo AV de 2do grado Tipo II (Mobitz II). Fallos intermitentes de conducción sin prolongación de PR." },
    "2 AVB 2:1": { bpm: 38, desc: "Bloqueo AV de 2do grado 2:1. Conducción de un complejo por cada dos ondas P." },
    "3 AVB Block": { bpm: 36, desc: "Bloqueo AV de 3er grado (Completo). Disociación auriculo-ventricular total." },
    "NSR with PJC(Premature Junctional Complex)": { bpm: 84, desc: "Ritmo sinusal normal con complejo prematuro de la unión." },
    "Junctional Rhythm": { bpm: 48, desc: "Ritmo nodal/unccional. Ritmo de escape originado en el nodo AV." },
    "Accelerated Junctional": { bpm: 82, desc: "Ritmo unccional acelerado. Frecuencia nodal aumentada entre 60 y 100 BPM." },
    "Junctional Tachycardia": { bpm: 186, desc: "Taquicardia unccional. Ritmo rápido originado en el tejido de la unión." },
    "Wandering Pacemaker": { bpm: 78, desc: "Marcapasos migratorio. Cambios de morfología de la onda P por variación del sitio de origen." },
    "NSR with PVC(Sinus Rhythm with Premature ventricular complex)": { bpm: 68, desc: "Ritmo sinusal con despolarización ventricular prematura (extrasístole ventricular)." },
    "Idioventricular rhythm": { bpm: 36, desc: "Ritmo idioventricular. Escape ventricular lento por ausencia de pacemaker superior." },
    "Accelerated dioventricular rhythm": { bpm: 84, desc: "Ritmo idioventricular acelerado (RIVA). Ritmo ventricular entre 50 y 100 BPM." },
    "Ventricular tachycardia(VTach)": { bpm: 210, desc: "Taquicardia ventricular. Ritmo ventricular rápido de complejos QRS anchos." },
    "Ventricular fibrillation": { bpm: 0, desc: "Fibrilación ventricular. Actividad eléctrica ventricular caótica sin gasto cardíaco." },
    "Paced Ventricula": { bpm: 80, desc: "Ritmo ventricular marcapaseado. Estimulación directa por dispositivo en ventrículo." }
};

let nivelActual = 1;
let aciertosNivel2 = 0;
const META_ACIERTOS_NIVEL2 = 10;

// SISTEMA DE SESGO / BIAS DE LA IA
let confiasSeguidasIA = 0;
let aciertosManualesSeguidos = 0;
let indiceDependenciaIA = 0;

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

    poblarOpcionesDiagnostico();
    inicializarDragAndDrop();
    actualizarBannerNivel(1, "Posicionamiento Anatómico de Electrodos");
});

function poblarOpcionesDiagnostico() {
    const select = document.getElementById("select-diagnostico");
    const containerInfo = document.getElementById("lista-patologias-container");
    if (!select) return;

    select.innerHTML = "";
    if (containerInfo) containerInfo.innerHTML = "";

    Object.keys(RITMOS_DOCENTE).forEach(ritmo => {
        const option = document.createElement("option");
        option.value = ritmo;
        option.innerText = ritmo;
        select.appendChild(option);

        if (containerInfo) {
            const item = document.createElement("div");
            item.className = "patologia-item";
            item.innerHTML = `<strong>• ${ritmo}</strong> (BPM: ${RITMOS_DOCENTE[ritmo].bpm})`;
            containerInfo.appendChild(item);
        }
    });
}

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

function actualizarDisplayDependencia() {
    const biasDisp = document.getElementById("bias-display");
    if (biasDisp) {
        biasDisp.innerText = `Índice Dependencia IA: ${indiceDependenciaIA}%`;
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
    actualizarDisplayDependencia();
    
    document.getElementById("modal-nivel2")?.classList.add("hidden");
    document.getElementById("monitor-panel")?.classList.remove("hidden");
    document.getElementById("ai-panel")?.classList.remove("hidden");

    generarNuevoCasoAleatorio();
}

function generarNuevoCasoAleatorio() {
    const listaKeys = Object.keys(RITMOS_DOCENTE);
    const ritmoReal = listaKeys[Math.floor(Math.random() * listaKeys.length)];
    const infoRitmo = RITMOS_DOCENTE[ritmoReal];

    let prediccionIA = ritmoReal;
    let confianza = Math.floor(Math.random() * 6) + 93;

    // Si confías más de 2 veces seguidas en la IA, esta falla intencionalmente para inducir sesgo de automatización
    if (confiasSeguidasIA >= 2) {
        const filtradas = listaKeys.filter(r => r !== ritmoReal);
        prediccionIA = filtradas[Math.floor(Math.random() * filtradas.length)];
        confianza = Math.floor(Math.random() * 5) + 95;
    }

    datosCasoActual = {
        paciente: `PAC-${Math.floor(Math.random() * 800 + 100)}`,
        edad: Math.floor(Math.random() * 50 + 25),
        frecuencia_cardiaca_bpm: infoRitmo.bpm,
        ritmo_patologia_real: ritmoReal,
        prediccion_ia: prediccionIA,
        confianza_ia: confianza
    };

    actualizarInterfazCaso(datosCasoActual);
}

function actualizarInterfazCaso(datos) {
    const elPatientInfo = document.getElementById("patient-info");
    const elBpm = document.getElementById("bpm-display");
    const elAiDiag = document.getElementById("ai-diagnosis-text");
    const elAiConf = document.getElementById("ai-confidence-text");

    if (elPatientInfo) elPatientInfo.innerText = `Paciente: ID ${datos.paciente} (${datos.edad} años)`;
    if (elBpm) elBpm.innerText = `BPM: ${datos.frecuencia_cardiaca_bpm}`;
    
    if (elAiDiag) elAiDiag.innerText = datos.prediccion_ia;
    if (elAiConf) elAiConf.innerText = `Confianza: ${datos.confianza_ia}%`;

    ajustarTamanoCanvas();
    iniciarTrazadoECG(datos.ritmo_patologia_real);
}

function tomarDecisionIA() {
    confiasSeguidasIA++;
    aciertosManualesSeguidos = 0;
    indiceDependenciaIA = Math.min(100, indiceDependenciaIA + 25);
    actualizarDisplayDependencia();

    const ritmoReal = datosCasoActual.ritmo_patologia_real;
    const prediccionIA = datosCasoActual.prediccion_ia;
    const esCorrecto = (prediccionIA === ritmoReal);

    if (esCorrecto) {
        aciertosNivel2++;
        actualizarContadorAciertos();
    }

    mostrarResultadoModal(
        esCorrecto ? "¡Diagnóstico Correcto con la IA!" : "¡Error por sobre-confianza en la IA!",
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
    const ritmoReal = datosCasoActual.ritmo_patologia_real;
    
    cerrarModalManual();

    const esCorrecto = (seleccion === ritmoReal);

    if (esCorrecto) {
        aciertosNivel2++;
        aciertosManualesSeguidos++;
        
        if (aciertosManualesSeguidos >= 3) {
            confiasSeguidasIA = 0;
            indiceDependenciaIA = Math.max(0, indiceDependenciaIA - 35);
        }
        actualizarContadorAciertos();
        actualizarDisplayDependencia();
    } else {
        aciertosManualesSeguidos = 0;
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
    if (treatment) treatment.innerText = RITMOS_DOCENTE[ritmoReal]?.desc || "Descripción clínica no disponible.";

    document.getElementById("modal-resultado")?.classList.remove("hidden");
}

function siguienteCasoNivel2() {
    document.getElementById("modal-resultado")?.classList.add("hidden");

    if (aciertosNivel2 >= META_ACIERTOS_NIVEL2) {
        document.getElementById("modal-nivel2-completado")?.classList.remove("hidden");
    } else {
        generarNuevoCasoAleatorio();
    }
}

function continuarPracticandoNivel2() {
    document.getElementById("modal-nivel2-completado")?.classList.add("hidden");
    generarNuevoCasoAleatorio();
}

function reiniciarDesdeNivel1() {
    aciertosNivel2 = 0;
    confiasSeguidasIA = 0;
    aciertosManualesSeguidos = 0;
    indiceDependenciaIA = 0;
    actualizarContadorAciertos();
    actualizarDisplayDependencia();
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

// RENDERIZADO DINÁMICO DE SEÑALES ECG SEGÚN RITMO
function iniciarTrazadoECG(ritmo) {
    if (!canvas || !ctx) return;
    if (animacionId) cancelAnimationFrame(animacionId);

    function dibujar() {
        ctx.fillStyle = "#030B12";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        dibujarCuadricula();

        ctx.strokeStyle = (ritmo.includes("Ventricular fibrillation") || ritmo.includes("arrest")) ? "#ef4444" : "#00FF66";
        ctx.lineWidth = 2;
        ctx.beginPath();

        let x = 0;
        let yBase = canvas.height / 2;

        while (x < canvas.width) {
            let y = yBase;

            if (ritmo === "Ventricular fibrillation") {
                y += (Math.random() - 0.5) * 50; // Trazado desorganizado y caótico
            } else if (ritmo === "Sinus arrest") {
                let posArrest = (x + offsetOnda) % 350;
                if (posArrest > 250) y += (Math.random() - 0.5) * 2; // Línea casi plana
                else if (posArrest >= 50 && posArrest < 60) y -= 50;
            } else if (ritmo.includes("tachycardia") || ritmo.includes("VTach") || ritmo.includes("Flutter")) {
                let posTaq = (x + offsetOnda) % 70;
                if (posTaq >= 25 && posTaq < 35) y -= 50;
            } else if (ritmo.includes("bradycardia") || ritmo.includes("Idioventricular") || ritmo.includes("Block")) {
                let posBrad = (x + offsetOnda) % 260;
                if (posBrad >= 60 && posBrad < 70) y -= 48;
            } else {
                // Ritmo Estándar / Sinusal
                let posSin = (x + offsetOnda) % 170;
                if (posSin > 20 && posSin < 35) y -= 8;
                else if (posSin >= 50 && posSin < 60) y -= 55;
                else if (posSin >= 60 && posSin < 65) y += 10;
                else if (posSin > 90 && posSin < 120) y -= 12;
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
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += tamanoCuadro) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
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
    if (tipo === "patologias") {
        document.getElementById("modal-patologias-info")?.classList.remove("hidden");
    } else {
        alert(`Sección de ${tipo}`);
    }
}

function cerrarModalInfoPatologias() {
    document.getElementById("modal-patologias-info")?.classList.add("hidden");
}
