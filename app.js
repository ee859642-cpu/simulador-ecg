const API_URL = "https://simulador-ecg.onrender.com";

// BASE DE DATOS OFICIAL DE 27 RITMOS CON BPM Y TRATAMIENTO CLÍNICO
const RITMOS_DOCENTE = {
    "Sinus rhythm": { 
        bpm: 72, 
        desc: "Ritmo sinusal normal. Frecuencia dentro del rango fisiológico estándar.",
        tratamiento: "No requiere tratamiento. Monitorización continua y control de signos vitales."
    },
    "Sinus bradycardia": { 
        bpm: 54, 
        desc: "Bradicardia sinusal. Frecuencia cardíaca por debajo de 60 BPM.",
        tratamiento: "Si es asintomática, solo observación. Si presenta hipotensión o mareo: Atropina IV (0.5 - 1 mg) o marcapasos transcutáneo."
    },
    "Sinus Tachycardia": { 
        bpm: 138, 
        desc: "Taquicardia sinusal. Frecuencia cardíaca elevada por encima de 100 BPM.",
        tratamiento: "Tratar la causa subyacente (fiebre, deshidratación, dolor, ansiedad, anemia). No se indican antiarrítmicos de primera línea."
    },
    "Sinus Arhythmia": { 
        bpm: 78, 
        desc: "Arritmia sinusal. Variación fisiológica del ritmo coordinado con la respiración.",
        tratamiento: "Variante benigna normal (común en jóvenes). No requiere tratamiento médico."
    },
    "Sinus exits block": { 
        bpm: 48, 
        desc: "Bloqueo de salida sinusal. Fallo de conducción del impulso desde el nodo SA.",
        tratamiento: "Evaluar fármacos bradicardizantes (Betabloqueantes, Digoxina). Si genera síntomas graves, considerar marcapasos permanente."
    },
    "Sinus arrest": { 
        bpm: 54, 
        desc: "Paro sinusal. Pausa prolongada en la actividad del nodo sinusal.",
        tratamiento: "Sintomático: Atropina IV temporal. En pausas sinusales prolongadas y recurrentes: implantación de Marcapasos definitivo."
    },
    "NSR with PAC(PJC) NSR with premature atrial": { 
        bpm: 84, 
        desc: "Ritmo sinusal normal con despolarizaciones auriculares prematuras (PAC).",
        tratamiento: "Generalmente benigno. Evitar estimulantes (cafeína, alcohol, tabaco). Si genera palpitaciones molestas: Betabloqueantes a dosis bajas."
    },
    "Supraventricular tachycardia": { 
        bpm: 180, 
        desc: "Taquicardia supraventricular (TSV). Ritmo rápido originado por encima de los ventrículos.",
        tratamiento: "Maniobras vagales (Valsalva). Si persiste y está estable: Adenosina IV rápida (6 mg -> 12 mg). Si está inestable: Cardioversión eléctrica sincronizada."
    },
    "Atrial Fibrillallation": { 
        bpm: 90, 
        desc: "Fibrilación auricular. Actividad auricular desorganizada e irregular.",
        tratamiento: "Control de frecuencia (Betabloqueantes / Diltiazem), Anticoagulación según escala CHA2DS2-VASc y evaluación de Cardioversión."
    },
    "Atrial Flutter": { 
        bpm: 75, 
        desc: "Aleteo auricular. Circuito de reentrada auricular con ondas en 'diente de sierra'.",
        tratamiento: "Control de frecuencia, Anticoagulación profiláctica y Ablación por radiofrecuencia del istmo cavotricuspídeo como tratamiento definitivo."
    },
    "Paced Atrial rhythm": { 
        bpm: 60, 
        desc: "Ritmo auricular marcapaseado. Estimulación eléctrica auricular por dispositivo.",
        tratamiento: "Verificar adecuado funcionamiento y captura del marcapasos mediante telemetría. Sin intervención aguda si es normofuncionante."
    },
    "NSR with 1 AVB(NSR with firot degree AV Block)": { 
        bpm: 74, 
        desc: "Bloqueo AV de 1er grado (intervalo PR prolongado > 0.20s constante).",
        tratamiento: "Generalmente asintomático y benigno. Monitorización regular y ajuste de fármacos que prolonguen la conducción AV."
    },
    "2 AVB type I": { 
        bpm: 48, 
        desc: "Bloqueo AV de 2do grado Tipo I (Mobitz I / Wenckebach). Prolongación progresiva del intervalo PR hasta que una onda P no conduce.",
        tratamiento: "Asintomático: Observación. Sintomático: Atropina IV transitoria o suspensión de fármacos depresores del nodo AV."
    },
    "2 AVB type II": { 
        bpm: 60, 
        desc: "Bloqueo AV de 2do grado Tipo II (Mobitz II). Bloqueo inconstante e imprevisto de ondas P sin prolongación previa de PR.",
        tratamiento: "Alto riesgo de progresión a bloqueo completo. Requiere Marcapasos transitorio/definitivo. Atropina suele ser ineficaz."
    },
    "2 AVB 2:1": { 
        bpm: 38, 
        desc: "Bloqueo AV de 2do grado 2:1. Conducción de un complejo QRS por cada dos ondas P.",
        tratamiento: "Evaluación hemodinámica. Si cursa con bradicardia severa o hipotensión: Marcapasos percutáneo de urgencia e implantación definitiva."
    },
    "3 AVB Block": { 
        bpm: 36, 
        desc: "Bloqueo AV de 3er grado (Completo). Disociación auriculo-ventricular total (ondas P y QRS marchan a frecuencias independientes).",
        tratamiento: "Urgencia médica. Marcapasos transcutáneo inmediato / Isoproterenol o Dopamina como puente a Marcapasos definitivo."
    },
    "NSR with PJC(Premature Junctional Complex)": { 
        bpm: 84, 
        desc: "Ritmo sinusal normal con complejo prematuro de la unión (PJC).",
        tratamiento: "Tratamiento conservador. Corregir desequilibrios electrolíticos o toxicidad por Digoxina si aplica."
    },
    "Junctional Rhythm": { 
        bpm: 48, 
        desc: "Ritmo unccional o nodal. Escape originado en el nodo AV (QRS estrecho, ausencia de onda P o P invertida).",
        tratamiento: "Tratar la causa subyacente (isquemia, hiperpotasemia, fármacos). Atropina si hay compromiso hemodinámico."
    },
    "Accelerated Junctional": { 
        bpm: 82, 
        desc: "Ritmo unccional acelerado. Automatisco unccional aumentado (60-100 BPM).",
        tratamiento: "Identificar y revertir toxicidad por digitálicos, estados catecolaminérgicos o isquemia inferior."
    },
    "Junctional Tachycardia": { 
        bpm: 186, 
        desc: "Taquicardia unccional. Ritmo rápido originado en el tejido de la unión nodal.",
        tratamiento: "Tratamiento de la causa desencadenante. Antiarrítmicos (Amiodarona, Flecainida) o Betabloqueantes según indicación especializada."
    },
    "Wandering Pacemaker": { 
        bpm: 78, 
        desc: "Marcapasos auricular migratorio. Variación en la morfología de ondas P de un latido a otro.",
        tratamiento: "Afección benigna. Generalmente no requiere tratamiento directo; controlar enfermedad pulmonar subyacente (EPOC) si está presente."
    },
    "NSR with PVC(Sinus Rhythm with Premature ventricular complex)": { 
        bpm: 68, 
        desc: "Ritmo sinusal con complejo ventricular prematuro (extrasístole ventricular - QRS ancho y mellado).",
        tratamiento: "Si son frecuentes o sintomáticas: Betabloqueantes o Calcioantagonistas. Evaluar electrólitos (K+, Mg++)."
    },
    "Idioventricular rhythm": { 
        bpm: 36, 
        desc: "Ritmo idioventricular. Escape ventricular muy lento con QRS ancho y sin ondas P asociadas.",
        tratamiento: "Atropina (usualmente poco efectiva). Inotrópicos / Marcapasos de emergencia inmediatamente."
    },
    "Accelerated dioventricular rhythm": { 
        bpm: 84, 
        desc: "Ritmo idioventricular acelerado (RIVA). Ritmo ventricular de escape entre 50 y 100 BPM.",
        tratamiento: "Ritmo benigno de reperfusión post-IAM. Generalmente hemodinámicamente estable; no se recomienda supresión antiarrítmica agresiva."
    },
    "Ventricular tachycardia(VTach)": { 
        bpm: 210, 
        desc: "Taquicardia ventricular. Ritmo ventricular rápido de complejos QRS anchos en monomórficos.",
        tratamiento: "Con pulso y estable: Amiodarona IV (150 mg). Con pulso e inestable: Cardioversión eléctrica. Sin pulso: Desfibrilación e RCP inmediata."
    },
    "Ventricular fibrillation": { 
        bpm: 0, 
        desc: "Fibrilación ventricular. Actividad eléctrica caótica e inefectiva sin pulso palpable.",
        tratamiento: "¡PARO CARDIORRESPIRATORIO! Desfibrilación inmediata no sincronizada + RCP de alta calidad + Adrenalina 1mg cada 3-5 min."
    },
    "Paced Ventricula": { 
        bpm: 80, 
        desc: "Ritmo ventricular marcapaseado. Espiga de estimulación previa a un complejo QRS ancho.",
        tratamiento: "Monitoreo de la respuesta del marcapasos. Comprobar umbrales de captura y detección mediante evaluación técnica."
    }
};

let nivelActual = 1;
let aciertosNivel2 = 0;
const META_ACIERTOS_NIVEL2 = 10;

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

// MUESTRA EL DIAGNÓSTICO + TRATAMIENTO MÉDICO ESPECÍFICO
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

// MOTOR ECG CON TRAZADO VISUAL DIFERENCIADO
function iniciarTrazadoECG(ritmo) {
    if (!canvas || !ctx) return;
    if (animacionId) cancelAnimationFrame(animacionId);

    function dibujar() {
        ctx.fillStyle = "#030B12";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        dibujarCuadricula();

        // Color según severidad
        ctx.strokeStyle = (ritmo.includes("Ventricular fibrillation") || ritmo.includes("VTach") || ritmo.includes("3 AVB")) ? "#ef4444" : "#00FF66";
        ctx.lineWidth = 2;
        ctx.beginPath();

        let x = 0;
        let yBase = canvas.height / 2;

        while (x < canvas.width) {
            let y = yBase;

            // 1. Fibrilación Ventricular (Caos)
            if (ritmo === "Ventricular fibrillation") {
                y += (Math.random() - 0.5) * 60; 
            } 
            // 2. Bloqueo AV Completo (Disociación AV: Ondas P frecuentes + QRS anchos muy lentos)
            else if (ritmo === "3 AVB Block") {
                let pos = (x + offsetOnda) % 260;
                if (pos > 20 && pos < 30) y -= 12; // Onda P 1
                if (pos > 90 && pos < 100) y -= 12; // Onda P 2
                if (pos > 160 && pos < 170) y -= 12; // Onda P 3
                if (pos >= 200 && pos < 220) y -= (pos % 2 === 0 ? 55 : -25); // Complejo QRS Ancho de Escape
            }
            // 3. Ritmo Idioventricular (Sin Onda P, QRS muy ancho y lento)
            else if (ritmo === "Idioventricular rhythm") {
                let pos = (x + offsetOnda) % 260;
                if (pos >= 110 && pos < 140) y -= Math.sin((pos - 110) / 30 * Math.PI) * 50; // QRS Ancho
            }
            // 4. Aleteo Auricular (Ondas F en Diente de Sierra)
            else if (ritmo === "Atrial Flutter") {
                let pos = (x + offsetOnda) % 120;
                y += Math.sin(pos / 5) * 12; // Onda sierra constante
                if (pos >= 50 && pos < 58) y -= 50; // QRS
            }
            // 5. Taquicardia Ventricular (QRS anchos y rápidos continuos)
            else if (ritmo === "Ventricular tachycardia(VTach)") {
                let pos = (x + offsetOnda) % 45;
                y -= Math.sin(pos / 45 * Math.PI) * 55;
            }
            // 6. Marcapasos Ventricular (Espiga vertical seguida de QRS ancho)
            else if (ritmo === "Paced Ventricula") {
                let pos = (x + offsetOnda) % 150;
                if (pos >= 40 && pos < 43) y -= 65; // Espiga del marcapasos
                else if (pos >= 44 && pos < 65) y -= 40; // QRS Ancho marcapaseado
            }
            // 7. Ritmo Estándar
            else {
                let ciclo = ritmo.includes("tachycardia") || ritmo.includes("SVT") ? 80 : 170;
                let posSin = (x + offsetOnda) % ciclo;
                if (posSin > 20 && posSin < 35) y -= 8; // Onda P
                else if (posSin >= 50 && posSin < 60) y -= 55; // Onda QRS
                else if (posSin >= 60 && posSin < 65) y += 10;
                else if (posSin > 90 && posSin < 120) y -= 12; // Onda T
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
