const API_URL = "https://simulador-ecg.onrender.com";

// BASE DE DATOS OFICIAL DE 27 RITMOS CON BPM Y TRATAMIENTOS
const RITMOS_DOCENTE = {
    "Sinus rhythm": { bpm: 72, desc: "Ritmo sinusal normal. Frecuencia dentro del rango fisiológico estándar.", tratamiento: "No requiere tratamiento. Monitorización continua y control de signos vitales." },
    "Sinus bradycardia": { bpm: 54, desc: "Bradicardia sinusal. Frecuencia cardíaca por debajo de 60 BPM.", tratamiento: "Si es asintomática, solo observación. Si presenta hipotensión: Atropina IV (0.5 - 1 mg)." },
    "Sinus Tachycardia": { bpm: 138, desc: "Taquicardia sinusal. Frecuencia cardíaca elevada por encima de 100 BPM.", tratamiento: "Tratar la causa subyacente (fiebre, deshidratación, dolor, ansiedad)." },
    "Sinus Arhythmia": { bpm: 78, desc: "Arritmia sinusal. Variación fisiológica respiratoria.", tratamiento: "Variante benigna normal. No requiere tratamiento médico." },
    "Sinus exits block": { bpm: 48, desc: "Bloqueo de salida sinusal. Fallo de conducción del impulso desde el nodo SA.", tratamiento: "Evaluar retiro de fármacos bradicardizantes / Marcapasos en casos graves." },
    "Sinus arrest": { bpm: 54, desc: "Paro sinusal. Pausa prolongada en la actividad del nodo sinusal.", tratamiento: "Atropina IV temporal / Marcapasos definitivo." },
    "NSR with PAC(PJC) NSR with premature atrial": { bpm: 84, desc: "Ritmo sinusal normal con despolarizaciones auriculares prematuras (PAC).", tratamiento: "Generalmente benigno. Evitar estimulantes / Betabloqueantes a dosis bajas." },
    "Supraventricular tachycardia": { bpm: 180, desc: "Taquicardia supraventricular (TSV).", tratamiento: "Maniobras vagales -> Adenosina IV rápida (6 mg -> 12 mg)." },
    "Atrial Fibrillallation": { bpm: 90, desc: "Fibrilación auricular. Actividad auricular desorganizada e irregular.", tratamiento: "Control de frecuencia (Betabloqueantes/Diltiazem) y Anticoagulación." },
    "Atrial Flutter": { bpm: 75, desc: "Aleteo auricular. Circuito de reentrada con ondas en 'diente de sierra'.", tratamiento: "Control de frecuencia, Anticoagulación y Ablación por radiofrecuencia." },
    "Paced Atrial rhythm": { bpm: 60, desc: "Ritmo auricular marcapaseado.", tratamiento: "Verificar adecuado funcionamiento del marcapasos mediante telemetría." },
    "NSR with 1 AVB(NSR with firot degree AV Block)": { bpm: 74, desc: "Bloqueo AV de 1er grado (intervalo PR prolongado > 0.20s constante).", tratamiento: "Asintomático y benigno. Monitorización regular." },
    "2 AVB type I": { bpm: 48, desc: "Bloqueo AV de 2do grado Tipo I (Wenckebach). Prolongación progresiva de PR.", tratamiento: "Asintomático: Observación. Sintomático: Atropina IV." },
    "2 AVB type II": { bpm: 60, desc: "Bloqueo AV de 2do grado Tipo II (Mobitz II).", tratamiento: "Marcapasos transitorio/definitivo (Alto riesgo de bloqueo completo)." },
    "2 AVB 2:1": { bpm: 38, desc: "Bloqueo AV de 2do grado 2:1.", tratamiento: "Marcapasos de urgencia si cursa con bradicardia severa." },
    "3 AVB Block": { bpm: 36, desc: "Bloqueo AV de 3er grado (Completo). Disociación A-V total.", tratamiento: "Urgencia: Marcapasos transcutáneo inmediato / Isoproterenol." },
    "NSR with PJC(Premature Junctional Complex)": { bpm: 84, desc: "Ritmo sinusal normal con complejo prematuro de la unión (PJC).", tratamiento: "Tratamiento conservador. Corregir electrólitos." },
    "Junctional Rhythm": { bpm: 48, desc: "Ritmo unccional o nodal.", tratamiento: "Tratar causa subyacente. Atropina si hay compromiso hemodinámico." },
    "Accelerated Junctional": { bpm: 82, desc: "Ritmo unccional acelerado.", tratamiento: "Revertir toxicidad por digitálicos o isquemia inferior." },
    "Junctional Tachycardia": { bpm: 186, desc: "Taquicardia unccional.", tratamiento: "Antiarrítmicos (Amiodarona/Flecainida) o Betabloqueantes." },
    "Wandering Pacemaker": { bpm: 78, desc: "Marcapasos auricular migratorio.", tratamiento: "Benigno. Controlar patología pulmonar subyacente (EPOC) si aplica." },
    "NSR with PVC(Sinus Rhythm with Premature ventricular complex)": { bpm: 68, desc: "Ritmo sinusal con extrasístole ventricular.", tratamiento: "Betabloqueantes si son frecuentes / Corregir electrólitos." },
    "Idioventricular rhythm": { bpm: 36, desc: "Ritmo idioventricular. Escape ventricular muy lento.", tratamiento: "Inotrópicos / Marcapasos de emergencia inmediatamente." },
    "Accelerated dioventricular rhythm": { bpm: 84, desc: "Ritmo idioventricular acelerado (RIVA).", tratamiento: "Generalmente hemodinámicamente estable. Observación." },
    "Ventricular tachycardia(VTach)": { bpm: 210, desc: "Taquicardia ventricular.", tratamiento: "Estable: Amiodarona IV. Inestable: Cardioversión / Sin pulso: Desfibrilación." },
    "Ventricular fibrillation": { bpm: 0, desc: "Fibrilación ventricular. Caos eléctrico sin pulso.", tratamiento: "¡PARO CARDIOCIRCULATORIO! Desfibrilación inmediata + RCP + Adrenalina." },
    "Paced Ventricula": { bpm: 80, desc: "Ritmo ventricular marcapaseado.", tratamiento: "Comprobar umbrales de captura mediante evaluación técnica." }
};

// ESTADOS GLOBALES DE LA APLICACIÓN
let nivelActual = 1;
let aciertosNivel2 = 0;
const META_ACIERTOS_NIVEL2 = 10;

let aciertosNivel3 = 0;
const META_ACIERTOS_NIVEL3 = 5;

let confiasSeguidasIA = 0;
let aciertosManualesSeguidos = 0;
let indiceDependenciaIA = 0;

let canvas, ctx;
let animacionId = null;
let offsetOnda = 0;
let datosCasoActual = null;

// VARIABLES NIVEL 3 (ROMPECABEZAS)
let piezasRompecabezasActuales = [];
let piezasColocadas = [];
let casoNivel3Actual = null;

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
        if (nivelActual === 2) {
            scoreBadge.innerText = `🎯 Nivel 2: ${aciertosNivel2} / ${META_ACIERTOS_NIVEL2}`;
        } else if (nivelActual === 3) {
            scoreBadge.innerText = `🧩 Reconstrucciones: ${aciertosNivel3} / ${META_ACIERTOS_NIVEL3}`;
        }
        scoreBadge.classList.remove("hidden");
    }
}

function actualizarDisplayDependencia() {
    const biasDisp = document.getElementById("bias-display");
    if (biasDisp) {
        biasDisp.innerText = `Índice Dependencia IA: ${indiceDependenciaIA}%`;
    }
}

// ==================== NIVEL 1 ====================
function comenzarNivel1() {
    nivelActual = 1;
    document.getElementById("modal-nivel1")?.classList.add("hidden");
    document.getElementById("ai-panel")?.classList.add("hidden");
    document.getElementById("score-badge")?.classList.add("hidden");
    document.getElementById("puzzle-ecg-panel")?.classList.add("hidden");
}

function verificarElectrodosCompletos() {
    if (electrodosColocados.size === ELECTRODOS_REQUERIDOS.length) {
        setTimeout(() => {
            document.getElementById("modal-nivel2")?.classList.remove("hidden");
        }, 300);
    }
}

// ==================== NIVEL 2 ====================
async function comenzarNivel2() {
    nivelActual = 2;
    actualizarBannerNivel(2, "Análisis de Señales e Interpretación de ECG");
    actualizarContadorAciertos();
    actualizarDisplayDependencia();
    
    document.getElementById("modal-nivel2")?.classList.add("hidden");
    document.getElementById("monitor-panel")?.classList.remove("hidden");
    document.getElementById("ai-panel")?.classList.remove("hidden");
    document.getElementById("puzzle-ecg-panel")?.classList.add("hidden");

    generarNuevoCasoAleatorio();
}

function generarNuevoCasoAleatorio() {
    const listaKeys = Object.keys(RITMOS_DOCENTE);
    const ritmoReal = listaKeys[Math.floor(Math.random() * listaKeys.length)];
    const infoRitmo = RITMOS_DOCENTE[ritmoReal];

    let prediccionIA = ritmoReal;
    let confianza = Math.floor(Math.random() * 6) + 93;

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

    const info = RITMOS_DOCENTE[ritmoReal];

    if (realDiag) realDiag.innerText = ritmoReal;
    if (treatment && info) {
        treatment.innerHTML = `
            <p><strong>Descripción:</strong> ${info.desc}</p>
            <br>
            <p style="color:#38bdf8;"><strong>💊 Tratamiento Clínico Indicado:</strong> ${info.tratamiento}</p>
        `;
    }

    document.getElementById("modal-resultado")?.classList.remove("hidden");
}

// AL COMPLETAR LOS 10 ACIERTOS DEL NIVEL 2 SE MUESTRA LA VENTANA DEL NIVEL 3
function siguienteCasoNivel2() {
    document.getElementById("modal-resultado")?.classList.add("hidden");

    if (aciertosNivel2 >= META_ACIERTOS_NIVEL2) {
        document.getElementById("modal-nivel3-intro")?.classList.remove("hidden");
    } else {
        generarNuevoCasoAleatorio();
    }
}

// ==================== NIVEL 3: RECONSTRUCCIÓN DE ONDA & TRATAMIENTO GUIADO ====================
function comenzarNivel3() {
    nivelActual = 3;
    actualizarBannerNivel(3, "Reconstrucción del Monitor & Análisis Clínico Guiado");
    actualizarContadorAciertos();

    document.getElementById("modal-nivel3-intro")?.classList.add("hidden");
    document.getElementById("ai-panel")?.classList.add("hidden");
    document.getElementById("puzzle-ecg-panel")?.classList.remove("hidden");

    generarCasoNivel3();
}

function generarCasoNivel3() {
    const listaKeys = Object.keys(RITMOS_DOCENTE);
    const ritmoReal = listaKeys[Math.floor(Math.random() * listaKeys.length)];
    const infoRitmo = RITMOS_DOCENTE[ritmoReal];

    casoNivel3Actual = {
        paciente: `CRIT-${Math.floor(Math.random() * 900 + 100)}`,
        ritmoReal: ritmoReal,
        info: infoRitmo
    };

    piezasColocadas = [];
    prepararRompecabezasECG(ritmoReal);
    actualizarInterfazNivel3();
}

function prepararRompecabezasECG(ritmo) {
    let pieza1 = { id: "p1", tipo: "auricular", nombre: ritmo.includes("Block") ? "Onda P Disociada" : (ritmo.includes("Flutter") ? "Ondas en Diente de Sierra (F)" : "Onda P Sinusal") };
    let pieza2 = { id: "p2", tipo: "ventricular", nombre: (ritmo.includes("Ventricular") || ritmo.includes("3 AVB")) ? "QRS Ancho / Muesca" : "QRS Estrecho Normal" };
    let pieza3 = { id: "p3", tipo: "ritmo", nombre: ritmo.includes("tachycardia") ? "Frecuencia Rápida (>100 BPM)" : (ritmo.includes("bradycardia") || ritmo.includes("Block") ? "Frecuencia Lenta (<60 BPM)" : "Frecuencia Normal") };

    piezasRompecabezasActuales = [pieza1, pieza2, pieza3].sort(() => Math.random() - 0.5);
}

function actualizarInterfazNivel3() {
    const infoHeader = document.getElementById("patient-info");
    if (infoHeader) infoHeader.innerText = `🧩 RECONSTRUCCIÓN EN CRISIS | Paciente: ${casoNivel3Actual.paciente}`;

    const containerPiezas = document.getElementById("puzzle-pieces-container");
    const containerDrop = document.getElementById("puzzle-drop-container");

    if (containerPiezas) {
        containerPiezas.innerHTML = "";
        piezasRompecabezasActuales.forEach(pieza => {
            const btnPieza = document.createElement("div");
            btnPieza.className = "puzzle-piece";
            btnPieza.innerText = pieza.nombre;
            btnPieza.onclick = () => seleccionarPiezaPuzzle(pieza);
            containerPiezas.appendChild(btnPieza);
        });
    }

    if (containerDrop) {
        containerDrop.innerHTML = "<p class='placeholder-text'>Selecciona las 3 características electrofisiológicas para ensamblar la onda...</p>";
    }

    iniciarTrazadoRuidoECG();
}

function seleccionarPiezaPuzzle(pieza) {
    if (piezasColocadas.find(p => p.id === pieza.id)) return;

    piezasColocadas.push(pieza);
    const containerDrop = document.getElementById("puzzle-drop-container");

    if (containerDrop) {
        if (piezasColocadas.length === 1) containerDrop.innerHTML = "";
        const tag = document.createElement("span");
        tag.className = "puzzle-tag";
        tag.innerText = `✓ ${pieza.nombre}`;
        containerDrop.appendChild(tag);
    }

    if (piezasColocadas.length === 3) {
        evaluarRompecabezasECG();
    }
}

function evaluarRompecabezasECG() {
    aciertosNivel3++;
    actualizarContadorAciertos();

    // Activar la señal limpia del ECG al ensamblar correctamente
    iniciarTrazadoECG(casoNivel3Actual.ritmoReal);

    setTimeout(() => {
        mostrarSugerenciasTratamientoNivel3();
    }, 1200);
}

function mostrarSugerenciasTratamientoNivel3() {
    const containerSugerencias = document.getElementById("puzzle-ecg-panel");
    const info = casoNivel3Actual.info;

    if (containerSugerencias) {
        containerSugerencias.innerHTML = `
            <div class="treatment-suggestion-card">
                <h3>💡 Diagnóstico Reconstruido: <span style="color:#00FF66;">${casoNivel3Actual.ritmoReal}</span></h3>
                <p><strong>Fisiopatología:</strong> ${info.desc}</p>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0;">
                <h4>🩺 Recomendación Terapéutica Sugerida por el Simulador:</h4>
                <div class="suggestion-box">
                    <p>👉 <strong>Conducta Indicada:</strong> ${info.tratamiento}</p>
                </div>
                <button class="btn-primary" style="margin-top:15px;" onclick="siguienteCasoNivel3()">
                    ${aciertosNivel3 >= META_ACIERTOS_NIVEL3 ? "Finalizar Simulación" : "Siguiente Caso de Emergencia"}
                </button>
            </div>
        `;
    }
}

function siguienteCasoNivel3() {
    if (aciertosNivel3 >= META_ACIERTOS_NIVEL3) {
        document.getElementById("modal-juego-completado")?.classList.remove("hidden");
    } else {
        const container = document.getElementById("puzzle-ecg-panel");
        if (container) {
            container.innerHTML = `
                <h3>🧩 Rompecabezas Fisiológico: Reconstruye la Onda ECG</h3>
                <div id="puzzle-drop-container" class="puzzle-dropzone"></div>
                <div id="puzzle-pieces-container" class="puzzle-grid"></div>
            `;
        }
        generarCasoNivel3();
    }
}

// ==================== REINICIO Y RENDERIZADO ====================
function reiniciarDesdeNivel1() {
    aciertosNivel2 = 0;
    aciertosNivel3 = 0;
    confiasSeguidasIA = 0;
    aciertosManualesSeguidos = 0;
    indiceDependenciaIA = 0;

    actualizarContadorAciertos();
    actualizarDisplayDependencia();
    reiniciarElectrodos();

    document.getElementById("monitor-panel")?.classList.add("hidden");
    document.getElementById("ai-panel")?.classList.add("hidden");
    document.getElementById("puzzle-ecg-panel")?.classList.add("hidden");
    document.getElementById("modal-juego-completado")?.classList.add("hidden");

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

// MOTOR ECG RUIDO
function iniciarTrazadoRuidoECG() {
    if (!canvas || !ctx) return;
    if (animacionId) cancelAnimationFrame(animacionId);

    function dibujarRuido() {
        ctx.fillStyle = "#030B12";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dibujarCuadricula();

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 1;
        ctx.beginPath();

        let x = 0;
        let yBase = canvas.height / 2;

        while (x < canvas.width) {
            let y = yBase + (Math.random() - 0.5) * 8;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += 3;
        }

        ctx.stroke();
        animacionId = requestAnimationFrame(dibujarRuido);
    }
    dibujarRuido();
}

// MOTOR ECG REAL
function iniciarTrazadoECG(ritmo) {
    if (!canvas || !ctx) return;
    if (animacionId) cancelAnimationFrame(animacionId);

    function dibujar() {
        ctx.fillStyle = "#030B12";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dibujarCuadricula();

        ctx.strokeStyle = (ritmo.includes("Ventricular fibrillation") || ritmo.includes("VTach") || ritmo.includes("3 AVB")) ? "#ef4444" : "#00FF66";
        ctx.lineWidth = 2;
        ctx.beginPath();

        let x = 0;
        let yBase = canvas.height / 2;

        while (x < canvas.width) {
            let y = yBase;

            if (ritmo === "Ventricular fibrillation") {
                y += (Math.random() - 0.5) * 60; 
            } 
            else if (ritmo === "3 AVB Block") {
                let pos = (x + offsetOnda) % 260;
                if (pos > 20 && pos < 30) y -= 12;
                if (pos > 90 && pos < 100) y -= 12;
                if (pos > 160 && pos < 170) y -= 12;
                if (pos >= 200 && pos < 220) y -= (pos % 2 === 0 ? 55 : -25);
            }
            else if (ritmo === "Idioventricular rhythm") {
                let pos = (x + offsetOnda) % 260;
                if (pos >= 110 && pos < 140) y -= Math.sin((pos - 110) / 30 * Math.PI) * 50;
            }
            else if (ritmo === "Atrial Flutter") {
                let pos = (x + offsetOnda) % 120;
                y += Math.sin(pos / 5) * 12;
                if (pos >= 50 && pos < 58) y -= 50;
            }
            else if (ritmo === "Ventricular tachycardia(VTach)") {
                let pos = (x + offsetOnda) % 45;
                y -= Math.sin(pos / 45 * Math.PI) * 55;
            }
            else if (ritmo === "Paced Ventricula") {
                let pos = (x + offsetOnda) % 150;
                if (pos >= 40 && pos < 43) y -= 65;
                else if (pos >= 44 && pos < 65) y -= 40;
            }
            else {
                let ciclo = ritmo.includes("tachycardia") || ritmo.includes("SVT") ? 80 : 170;
                let posSin = (x + offsetOnda) % ciclo;
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
