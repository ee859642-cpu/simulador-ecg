// ==================== BASE DE DATOS DE RITMOS (27 RITMOS) ====================
const RITMOS_ECG = [
    { id: "sr", name: "Ritmo Sinusal Normal", rate: "60-100", qrs: "Normal", p: "Presente", st: "Isoeléctrico", treat: "Ninguno (Ritmo Fisiológico Normal)", status: "Fisiológico", type: "sinusal" },
    { id: "sb", name: "Bradicardia Sinusal", rate: "<60", qrs: "Normal", p: "Presente", st: "Isoeléctrico", treat: "Observación / Atropina si sintomático", status: "Sintomático", type: "sinusal" },
    { id: "st", name: "Taquicardia Sinusal", rate: ">100", qrs: "Normal", p: "Presente", st: "Isoeléctrico", treat: "Tratar causa subyacente (Fiebre, Dolor, Anemia)", status: "Secundario", type: "sinusal" },
    { id: "sa", name: "Arritmia Sinusal", rate: "Variable", qrs: "Normal", p: "Presente", st: "Isoeléctrico", treat: "Ninguno (Variación fásica respiratoria normal)", status: "Benigno", type: "sinusal" },
    { id: "pac", name: "Contracción Auricular Prematura (PAC)", rate: "Variable", qrs: "Estrecho", p: "Prematura/Anormal", st: "Isoeléctrico", treat: "Tranquilizar al paciente / Evitar estimulantes", status: "Benigno", type: "auricular" },
    { id: "svt", name: "Taquicardia Supraventricular (TSVP)", rate: "150-250", qrs: "Estrecho", p: "Oculta o retrograda", st: "Infradesnivel en crisis", treat: "Maniobras vagales / Adenosina IV", status: "Urgencia", type: "auricular" },
    { id: "aflutter", name: "Aleteo Auricular (Atrial Flutter)", rate: "250-350 (Auricular)", qrs: "Estrecho", p: "Dientes de Sierra (Ondas F)", st: "Variable", treat: "Control de frecuencia / Cardioversión / Ablación", status: "Patológico", type: "auricular" },
    { id: "afib", name: "Fibrilación Auricular (AFib)", rate: "Irregular", qrs: "Estrecho", p: "Ausente (Ondas f caóticas)", st: "Variable", treat: "Control de Frecuencia + Anticoagulación", status: "Patológico", type: "auricular" },
    { id: "mat", name: "Taquicardia Auricular Multifocal", rate: ">100", qrs: "Estrecho", p: "≥3 morfologías distintas", st: "Variable", treat: "Optimizar función pulmonar (Oxígeno, Verapamilo)", status: "Patológico", type: "auricular" },
    { id: "pvc", name: "Contracción Ventricular Prematura (PVC)", rate: "Variable", qrs: "Ancho y aberrante", p: "Ausente en PVC", st: "Oposición T-QRS", treat: "Betabloqueantes si sintomático", status: "Variable", type: "ventricular" },
    { id: "vt_mono", name: "Taquicardia Ventricular Monomórfica", rate: "140-220", qrs: "Ancho idéntico", p: "Disociación AV", st: "Alterado", treat: "Cardioversión eléctrica / Amiodarona", status: "Emergencia", type: "ventricular" },
    { id: "vt_poly", name: "Taquicardia Ventricular Polimórfica", rate: "150-250", qrs: "Ancho variable", p: "Indiscernible", st: "Alterado", treat: "Desfibrilación si inestable / Sulfato de Magnesio", status: "Emergencia", type: "ventricular" },
    { id: "torsades", name: "Torsades de Pointes", rate: "200-250", qrs: "En hélice/torsión", p: "Ausente", st: "QT Prolongado previo", treat: "Sulfato de Magnesio IV 2g", status: "Emergencia", type: "ventricular" },
    { id: "vfib", name: "Fibrilación Ventricular (VFib)", rate: "Caótico", qrs: "Ausente / Caótico", p: "Ausente", st: "Ausente", treat: "Desfibrilación inmediata + RCP de alta calidad", status: "Paro Cardíaco", type: "ventricular" },
    { id: "idioventricular", name: "Ritmo Idioventricular Acelerado", rate: "40-100", qrs: "Ancho", p: "Ausente/Disociada", st: "Alterado", treat: "Observación (Ritmo de reperfusión)", status: "Post-Reperfusión", type: "ventricular" },
    { id: "avb1", name: "Bloqueo AV de Primer Grado", rate: "Normal", qrs: "Estrecho", p: "PR Prolongado (>0.20s)", st: "Isoeléctrico", treat: "Observación (Monitorización)", status: "Benigno", type: "bloqueo" },
    { id: "avb2_1", name: "Bloqueo AV 2º Grado Mobitz I (Wenckebach)", rate: "Lento/Normal", qrs: "Estrecho", p: "PR se alarga progresivamente", st: "Isoeléctrico", treat: "Observación / Revertir causas", status: "Generalmente Benigno", type: "bloqueo" },
    { id: "avb2_2", name: "Bloqueo AV 2º Grado Mobitz II", rate: "Lento", qrs: "Ancho/Estrecho", p: "PR constante con P bloqueada", st: "Isoeléctrico", treat: "Marcapasos Temporal / Definitivo", status: "Peligroso", type: "bloqueo" },
    { id: "avb3", name: "Bloqueo AV de Tercer Grado (Completo)", rate: "20-40", qrs: "Ancho (Escape Ventricular)", p: "Disociada por completo", st: "Isoeléctrico", treat: "Marcapasos de Emergencia + Isoproterenol", status: "Emergencia", type: "bloqueo" },
    { id: "lbbb", name: "Bloqueo de Rama Izquierda (LBBB)", rate: "Normal", qrs: "Ancho (>0.12s) M en V5-V6", p: "Presente", st: "Depresión/Inversión T", treat: "Evaluar isquemia aguda / Marcapasos", status: "Patológico", type: "bloqueo" },
    { id: "rbbb", name: "Bloqueo de Rama Derecha (RBBB)", rate: "Normal", qrs: "Ancho (>0.12s) rsR' en V1", p: "Presente", st: "Isoeléctrico", treat: "Evaluar patología pulmonar o estructural", status: "Frecuente", type: "bloqueo" },
    { id: "stemi_ant", name: "STEMI Anteroseptal (Infarto Agudo)", rate: "Variable", qrs: "Q de necrosis", p: "Presente", st: "Elevación ST V1-V4", treat: "Angioplastia Primaria (ACTP) / Trombólisis", status: "Emergencia Médica", type: "isquemia" },
    { id: "stemi_inf", name: "STEMI Inferior", rate: "Tendencia a Bradicardia", qrs: "Normal/Q", p: "Presente", st: "Elevación ST en II, III, aVF", treat: "Angioplastia Primaria + Hidratación", status: "Emergencia Médica", type: "isquemia" },
    { id: "nstemi", name: "NSTEMI / Angina Inestable", rate: "Variable", qrs: "Normal", p: "Presente", st: "Infradesnivel ST / Inversión T", treat: "Antiagregación + Anticoagulación + Cateterismo", status: "Urgencia", type: "isquemia" },
    { id: "wpw", name: "Síndrome Wolff-Parkinson-White", rate: "Normal/Taquicárdico", qrs: "Ancho con Onda Delta", p: "PR Corto (<0.12s)", st: "Alterado", treat: "Ablación por radiofrecuencia", status: "Congénito", type: "preexitacion" },
    { id: "hyperkalemia", name: "Hiperpotasemia Severa", rate: "Lento", qrs: "Ancho picudo", p: "Aplanada/Ausente", st: "Ondas T Picudas", treat: "Gluconato de Calcio IV + Insulina/Glucosa", status: "Emergencia Metabólica", type: "metabolico" },
    { id: "long_qt", name: "Síndrome de QT Largo", rate: "Normal", qrs: "Normal", p: "Presente", st: "QTc Prolongado (>470ms)", treat: "Betabloqueantes / Evitar fármacos que alarguen QT", status: "Riesgo de Arritmia", type: "canalopatia" }
];

// POSICIONES CORRECTAS DE LOS ELECTRODOS (NIVEL 1)
const POSICIONES_CORRECTAS = {
    "V1": { top: 38, left: 47 },
    "V2": { top: 38, left: 53 },
    "V3": { top: 45, left: 50 },
    "V4": { top: 51, left: 45 },
    "V5": { top: 51, left: 53 },
    "V6": { top: 51, left: 60 }
};

// ==================== VARIABLES DE ESTADO GLOBAL ====================
let nivelActual = 1;
let aciertosNivel2 = 0;
const MAX_ACIERTOS_NIVEL2 = 10;
let electrodosColocados = 0;
let casoActualN2 = null;
let indiceSesgoIA = 0;
let animacionCanvasId = null;

// ==================== CASOS CLINICOS NIVEL 3 ====================
const CASOS_NIVEL3 = [
    {
        id: 1,
        paciente: "Paciente masculino de 68 años con palpitaciones, mareos y pulso irregularmente irregular.",
        patologia: "Fibrilación Auricular (AFib)",
        piezas: [
            { id: 0, label: "Inicio: Ondas f caóticas sin onda P", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q10,15 20,25 T40,20 T60,25 T80,18 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 1, label: "QRS Angosto Irregular #1", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L20,20 L25,35 L30,5 L35,25 L40,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 2, label: "Intervalo R-R Irregular y Ausencia de P", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q15,23 30,17 T60,22 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 3, label: "QRS Angosto Irregular #2", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L50,20 L55,35 L60,5 L65,25 L70,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' }
        ],
        tratamientoCorrecto: 1,
        opcionesTratamiento: [
            "Cardioversión eléctrica inmediata sin anticoagulación previa",
            "Control de frecuencia cardíaca (Betabloqueantes / Diltiazem) y Anticoagulación",
            "Administración de Atropina 1mg IV en bolo"
        ]
    },
    {
        id: 2,
        paciente: "Paciente femenina de 55 años con dolor torácico opresivo de 2 horas de evolución e irradiado a brazo izquierdo.",
        patologia: "STEMI Anteroseptal (Infarto Agudo)",
        piezas: [
            { id: 0, label: "Onda P y Segmento PR Normal", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q15,12 30,20 L50,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 1, label: "QRS Prominente", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L20,20 L25,35 L30,0 L35,15 L100,15" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 2, label: "Elevación Supradesnivel del Segmento ST", svg: '<svg viewBox="0 0 100 40"><path d="M0,15 L40,15 C60,15 70,30 100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 3, label: "Onda T Invertida / Isoeléctrica Final", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q25,30 50,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' }
        ],
        tratamientoCorrecto: 0,
        opcionesTratamiento: [
            "Reperfusión inmediata: Angioplastia Coronaria Percutánea (ACTP) o Trombólisis",
            "Observación ambulatoria y alta con analgésicos",
            "Maniobras vagales y Adenosina 6mg IV"
        ]
    },
    {
        id: 3,
        paciente: "Paciente masculino de 60 años con antecedente de miocardiopatía que presenta taquicardia sostenida y presíncope.",
        patologia: "Taquicardia Ventricular Monomórfica",
        piezas: [
            { id: 0, label: "Onda Ancha QRS Monomórfica #1", svg: '<svg viewBox="0 0 100 40"><path d="M0,30 Q25,0 50,30 T100,30" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 1, label: "Onda Ancha QRS Monomórfica #2", svg: '<svg viewBox="0 0 100 40"><path d="M0,30 Q25,0 50,30 T100,30" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 2, label: "Onda Ancha QRS Monomórfica #3", svg: '<svg viewBox="0 0 100 40"><path d="M0,30 Q25,0 50,30 T100,30" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 3, label: "Onda Ancha QRS Monomórfica #4", svg: '<svg viewBox="0 0 100 40"><path d="M0,30 Q25,0 50,30 T100,30" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' }
        ],
        tratamientoCorrecto: 2,
        opcionesTratamiento: [
            "Compresiones torácicas inmediatas (RCP únicamente)",
            "Aspirina 300mg VO y observación",
            "Amiodarona IV (si está estable) o Cardioversión Eléctrica Sincronizada"
        ]
    }
];

let casoActualN3 = 0;
let ordenSeleccionadoN3 = [null, null, null, null];

// ==================== INICIALIZACIÓN DE LA APLICACIÓN ====================
window.addEventListener('DOMContentLoaded', () => {
    inicializarDragAndDropNivel1();
    poblarSelectDiagnosticos();
    poblarTablaPatologiasInfo();
    ajustarTamanioCanvas();

    // 1. Mostrar modal inicial de instrucciones del Nivel 1
    const modalN1 = document.getElementById('modal-nivel1-intro');
    if (modalN1) modalN1.classList.remove('hidden');

    // Ocultar panel de IA de inicio
    const aiPanel = document.getElementById('ai-panel');
    if (aiPanel) aiPanel.classList.add('hidden');

    window.addEventListener('resize', ajustarTamanioCanvas);
});

function cerrarModalNivel1() {
    const modalN1 = document.getElementById('modal-nivel1-intro');
    if (modalN1) modalN1.classList.add('hidden');
}

// ==================== LÓGICA DEL NIVEL 1: ELECTRODOS ====================
function inicializarDragAndDropNivel1() {
    const electrodos = document.querySelectorAll('.electrode');
    const zonasDrop = document.querySelectorAll('.dropzone');

    electrodos.forEach(el => {
        el.setAttribute('draggable', true);
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', el.dataset.lead);
        });
    });

    zonasDrop.forEach(zona => {
        zona.addEventListener('dragover', (e) => e.preventDefault());
        zona.addEventListener('drop', (e) => {
            e.preventDefault();
            const leadDragged = e.dataTransfer.getData('text/plain');
            const targetZone = zona.dataset.target;

            if (leadDragged === targetZone) {
                zona.classList.add('placed');
                zona.innerText = leadDragged;

                const originalEl = document.querySelector(`.electrode[data-lead="${leadDragged}"]`);
                if (originalEl) originalEl.style.visibility = 'hidden';

                electrodosColocados++;

                // Al colocar los 6 electrodos, avanzar a Nivel 2
                if (electrodosColocados === 6) {
                    setTimeout(() => {
                        const modalN2 = document.getElementById('modal-nivel2');
                        if (modalN2) modalN2.classList.remove('hidden');
                    }, 500);
                }
            } else {
                alert(`⚠️ Posición incorrecta. ${leadDragged} no corresponde a esa ubicación anatómica.`);
            }
        });
    });
}

function reiniciarNivel1() {
    electrodosColocados = 0;
    const zonasDrop = document.querySelectorAll('.dropzone');
    zonasDrop.forEach(zona => {
        zona.classList.remove('placed');
        zona.innerText = '';
    });

    const electrodos = document.querySelectorAll('.electrode');
    electrodos.forEach(el => el.style.visibility = 'visible');

    if (nivelActual === 1) {
        document.getElementById('patient-info').innerText = 'Paciente: Selecciona los electrodos para iniciar';
        document.getElementById('bpm-display').innerText = 'BPM: --';
        detenerAnimacionCanvas();
    }
}

// ==================== LÓGICA DEL NIVEL 2: ANÁLISIS DE ECG ====================
function comenzarNivel2() {
    nivelActual = 2;
    aciertosNivel2 = 0;

    // Actualizar Encabezado
    const modalN2 = document.getElementById('modal-nivel2');
    if (modalN2) modalN2.classList.add('hidden');

    document.getElementById('level-badge').innerText = 'NIVEL 2';
    document.getElementById('level-title').innerText = 'Análisis de Señales e Interpretación de ECG';

    const scoreBadge = document.getElementById('score-badge');
    scoreBadge.classList.remove('hidden');
    scoreBadge.innerText = `🎯 Aciertos: ${aciertosNivel2} / ${MAX_ACIERTOS_NIVEL2}`;

    document.getElementById('ai-panel').classList.remove('hidden');

    // Cargar primer paciente Nivel 2
    cargarSiguienteCasoNivel2();
}

function cargarSiguienteCasoNivel2() {
    // Seleccionar ritmo aleatorio
    const indiceAleatorio = Math.floor(Math.random() * RITMOS_ECG.length);
    casoActualN2 = RITMOS_ECG[indiceAleatorio];

    // Actualizar Interfaz del Paciente
    document.getElementById('patient-info').innerText = `Paciente: ID PAC-${Math.floor(Math.random() * 899 + 100)} (${Math.floor(Math.random() * 50 + 25)} años)`;
    document.getElementById('bpm-display').innerText = `BPM: ${casoActualN2.rate}`;

    // Simulación del Asistente de IA (con 85% de precisión)
    const aciertoIA = Math.random() < 0.85;
    const sugerenciaIA = aciertoIA ? casoActualN2.name : RITMOS_ECG[Math.floor(Math.random() * RITMOS_ECG.length)].name;
    const confianzaIA = Math.floor(Math.random() * 15 + 83);

    document.getElementById('ai-diagnosis-text').innerText = sugerenciaIA;
    document.getElementById('ai-confidence-text').innerText = `Confianza: ${confianzaIA}%`;
    document.getElementById('ai-diagnosis-text').dataset.sugerencia = sugerenciaIA;

    // Renderizar trazado en Canvas específico para la patología
    iniciarAnimacionECG(casoActualN2.id);
}

function tomarDecisionIA() {
    const sugerencia = document.getElementById('ai-diagnosis-text').dataset.sugerencia;
    evaluarRespuestaNivel2(sugerencia, true);
}

function abrirModalManual() {
    document.getElementById('modal-manual').classList.remove('hidden');
}

function cerrarModalManual() {
    document.getElementById('modal-manual').classList.add('hidden');
}

function evaluarDiagnosticoManual() {
    const select = document.getElementById('select-diagnostico');
    const seleccion = select.value;
    cerrarModalManual();
    evaluarRespuestaNivel2(seleccion, false);
}

function evaluarRespuestaNivel2(diagnosticoPropuesto, provieneDeIA) {
    const esCorrecto = (diagnosticoPropuesto === casoActualN2.name);
    const modalRes = document.getElementById('modal-resultado');

    if (esCorrecto) {
        aciertosNivel2++;
        document.getElementById('res-status-title').innerText = "¡Diagnóstico Correcto! 🎉";
        document.getElementById('res-status-badge').innerText = "CORRECTO";
        document.getElementById('res-status-badge').style.background = "#00FF66";
        document.getElementById('res-status-badge').style.color = "#000";

        if (provieneDeIA) {
            indiceSesgoIA = Math.min(100, indiceSesgoIA + 10);
        }
    } else {
        document.getElementById('res-status-title').innerText = "Diagnóstico Incorrecto ⚠️";
        document.getElementById('res-status-badge').innerText = "INCORRECTO";
        document.getElementById('res-status-badge').style.background = "#FF0055";
        document.getElementById('res-status-badge').style.color = "#FFF";

        if (!provieneDeIA) {
            indiceSesgoIA = Math.max(0, indiceSesgoIA - 5);
        }
    }

    // Actualizar marcadores de sesgo y aciertos
    document.getElementById('score-badge').innerText = `🎯 Aciertos: ${aciertosNivel2} / ${MAX_ACIERTOS_NIVEL2}`;
    document.getElementById('bias-display').innerText = `Índice Dependencia IA: ${indiceSesgoIA}%`;
    document.getElementById('bias-info-footer').innerText = `Índice Dependencia IA: ${indiceSesgoIA}%`;

    document.getElementById('res-real-diag').innerText = casoActualN2.name;
    document.getElementById('res-treatment-text').innerHTML = `<strong>Conducta / Tratamiento Recomendado:</strong><br>${casoActualN2.treat}`;

    modalRes.classList.remove('hidden');
}

function siguienteCasoNivel2() {
    document.getElementById('modal-resultado').classList.add('hidden');

    // VALIDACIÓN PASE A NIVEL 3 EXACTAMENTE A LOS 10 ACIERTOS
    if (aciertosNivel2 >= MAX_ACIERTOS_NIVEL2) {
        setTimeout(() => {
            const modalN3Intro = document.getElementById('modal-nivel3-intro');
            if (modalN3Intro) modalN3Intro.classList.remove('hidden');
        }, 300);
    } else {
        cargarSiguienteCasoNivel2();
    }
}

// ==================== LÓGICA DEL NIVEL 3: ROMPECABEZAS & TRATAMIENTO ====================
function comenzarNivel3() {
    nivelActual = 3;
    casoActualN3 = 0;

    // Actualizar Encabezado
    const modalN3Intro = document.getElementById('modal-nivel3-intro');
    if (modalN3Intro) modalN3Intro.classList.add('hidden');

    document.getElementById('level-badge').innerText = 'NIVEL 3';
    document.getElementById('level-title').innerText = 'Rompecabezas y Tratamiento Fisiológico';
    document.getElementById('score-badge').classList.add('hidden');
    document.getElementById('ai-panel').classList.add('hidden');

    // Cambiar vista de paneles
    document.getElementById('electrode-placement-panel').classList.add('hidden');
    document.getElementById('puzzle-ecg-panel').classList.remove('hidden');

    cargarCasoNivel3(casoActualN3);
}

function cargarCasoNivel3(index) {
    const caso = CASOS_NIVEL3[index];
    ordenSeleccionadoN3 = [null, null, null, null];

    // Resetear UI preservando el diseño
    const titleElem = document.getElementById('n3-patient-title');
    const descElem = document.getElementById('n3-patient-desc');
    const treatSec = document.getElementById('n3-treatment-section');

    if (titleElem) titleElem.innerText = `CASO CLÍNICO ${index + 1} / 3: ${caso.patologia}`;
    if (descElem) descElem.innerText = caso.paciente;
    if (treatSec) treatSec.classList.add('hidden');

    // Limpiar slots de armado
    const slots = document.querySelectorAll('.puzzle-slot');
    slots.forEach(slot => {
        slot.innerHTML = `<span class="slot-number">${parseInt(slot.dataset.slot) + 1}</span>`;
        slot.classList.remove('filled');
    });

    // Cargar piezas desordenadas
    const containerPiezas = document.getElementById('puzzle-pieces-container');
    if (containerPiezas) {
        containerPiezas.innerHTML = '';
        let piezasMezcladas = [...caso.piezas].sort(() => Math.random() - 0.5);

        piezasMezcladas.forEach(p => {
            const div = document.createElement('div');
            div.className = 'puzzle-piece';
            div.innerHTML = `${p.svg}<p>${p.label}</p>`;
            div.onclick = () => colocarPiezaN3(p, div);
            containerPiezas.appendChild(div);
        });
    }
}

function colocarPiezaN3(pieza, elementoHTML) {
    const slotLibre = ordenSeleccionadoN3.findIndex(val => val === null);

    if (slotLibre !== -1) {
        ordenSeleccionadoN3[slotLibre] = pieza.id;

        const slotDiv = document.querySelector(`.puzzle-slot[data-slot="${slotLibre}"]`);
        if (slotDiv) {
            slotDiv.innerHTML = `${pieza.svg}`;
            slotDiv.classList.add('filled');
        }

        elementoHTML.style.visibility = 'hidden';

        if (!ordenSeleccionadoN3.includes(null)) {
            validarEnsambleN3();
        }
    }
}

function validarEnsambleN3() {
    const caso = CASOS_NIVEL3[casoActualN3];
    const esCorrecto = ordenSeleccionadoN3.every((val, index) => val === index);

    if (esCorrecto) {
        const section = document.getElementById('n3-treatment-section');
        const containerOpciones = document.getElementById('n3-treatment-options');
        
        if (containerOpciones) {
            containerOpciones.innerHTML = '';
            caso.opcionesTratamiento.forEach((opc, i) => {
                const btn = document.createElement('button');
                btn.className = 'btn-primary';
                btn.style.margin = "5px 0";
                btn.style.width = "100%";
                btn.innerText = opc;
                btn.onclick = () => evaluarTratamientoN3(i);
                containerOpciones.appendChild(btn);
            });
        }

        if (section) section.classList.remove('hidden');
    } else {
        alert("⚠️ El orden de la señal electrocardiográfica es incorrecto. Inténtalo de nuevo.");
        cargarCasoNivel3(casoActualN3);
    }
}

function evaluarTratamientoN3(opcionSeleccionada) {
    const caso = CASOS_NIVEL3[casoActualN3];

    if (opcionSeleccionada === caso.tratamientoCorrecto) {
        casoActualN3++;
        if (casoActualN3 < CASOS_NIVEL3.length) {
            alert(`✅ ¡Excelente! Has resuelto el caso de ${caso.patologia}. Pasamos al siguiente caso.`);
            cargarCasoNivel3(casoActualN3);
        } else {
            document.getElementById('modal-juego-completado').classList.remove('hidden');
        }
    } else {
        alert("❌ Respuesta incorrecta. Revisa el diagnóstico y selecciona la conducta indicada.");
    }
}

function reiniciarDesdeNivel1() {
    location.reload();
}

// ==================== GENERADOR MATEMÁTICO DE ONDAS ECG (CANVAS) ====================
function ajustarTamanioCanvas() {
    const canvas = document.getElementById('ecg-wave');
    if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
}

function detenerAnimacionCanvas() {
    if (animacionCanvasId) {
        cancelAnimationFrame(animacionCanvasId);
        animacionCanvasId = null;
    }
}

function iniciarAnimacionECG(tipoRitmo) {
    detenerAnimacionCanvas();
    const canvas = document.getElementById('ecg-wave');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let x = 0;
    const centerY = canvas.height / 2;
    const speed = 2.5;

    function dibujarFrame() {
        // Redibujar fondo con cuadrícula verde médica
        ctx.fillStyle = '#051109';
        ctx.fillRect(x, 0, speed + 2, canvas.height);

        ctx.strokeStyle = 'rgba(0, 255, 102, 0.15)';
        ctx.lineWidth = 0.5;
        for (let y = 0; y < canvas.height; y += 15) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + speed + 2, y);
            ctx.stroke();
        }

        // Calcular amplitud según el tipo de ritmo
        let yOffset = calcularEcuacionOnda(x, tipoRitmo, canvas.height);

        ctx.strokeStyle = '#00FF66';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00FF66';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(x, centerY);
        ctx.lineTo(x + speed, centerY - yOffset);
        ctx.stroke();

        ctx.shadowBlur = 0;

        x += speed;
        if (x >= canvas.width) x = 0;

        animacionCanvasId = requestAnimationFrame(dibujarFrame);
    }

    dibujarFrame();
}

function calcularEcuacionOnda(x, tipo, height) {
    const scale = height * 0.35;
    const cycle = (x % 140) / 140; // Ciclo continuo

    switch (tipo) {
        case 'afib': // Fibrilación Auricular: Sin onda P, base caótica
            return (Math.sin(x * 0.3) * 0.1 + (Math.random() - 0.5) * 0.15) * scale + (cycle > 0.45 && cycle < 0.5 ? (Math.random() > 0.5 ? 0.8 : -0.2) : 0) * scale;
        
        case 'aflutter': // Aleteo Auricular: Dientes de sierra
            return (Math.sin(x * 0.2) * 0.25 + (cycle > 0.48 && cycle < 0.52 ? 0.9 : 0)) * scale;

        case 'vt_mono': // Taquicardia Ventricular Monomórfica: QRS ancho y alto
            return Math.sin(x * 0.08) * scale * 0.95;

        case 'vfib': // Fibrilación Ventricular: Caos absoluto
            return (Math.sin(x * 0.12) * 0.5 + Math.cos(x * 0.25) * 0.4 + (Math.random() - 0.5) * 0.3) * scale;

        case 'stemi_ant': // STEMI: Elevación marcada del segmento ST
            if (cycle > 0.35 && cycle < 0.4) return 0.9 * scale; // R
            if (cycle >= 0.4 && cycle < 0.7) return 0.45 * scale; // ST elevado
            return 0;

        case 'sb': // Bradicardia Sinusal: Ritmo lento dilatado
            const cycleSlow = (x % 240) / 240;
            if (cycleSlow > 0.1 && cycleSlow < 0.18) return Math.sin((cycleSlow - 0.1) * Math.PI / 0.08) * 0.15 * scale;
            if (cycleSlow > 0.38 && cycleSlow < 0.42) return (cycleSlow < 0.4 ? -0.15 : 0.9) * scale;
            return 0;

        case 'st': // Taquicardia Sinusal: Ritmo acelerado
            const cycleFast = (x % 80) / 80;
            if (cycleFast > 0.38 && cycleFast < 0.44) return 0.85 * scale;
            return 0;

        default: // Ritmo Sinusal Normal
            if (cycle > 0.15 && cycle < 0.25) return Math.sin((cycle - 0.15) * Math.PI / 0.1) * 0.15 * scale; // Onda P
            if (cycle > 0.38 && cycle < 0.40) return -0.15 * scale; // Q
            if (cycle >= 0.40 && cycle < 0.43) return 0.95 * scale;  // R
            if (cycle >= 0.43 && cycle < 0.45) return -0.25 * scale; // S
            if (cycle > 0.55 && cycle < 0.70) return Math.sin((cycle - 0.55) * Math.PI / 0.15) * 0.25 * scale; // Onda T
            return 0;
    }
}

// ==================== UTILIDADES DE MODALES Y TABLAS ====================
function poblarSelectDiagnosticos() {
    const select = document.getElementById('select-diagnostico');
    if (!select) return;
    select.innerHTML = '';
    RITMOS_ECG.forEach(ritmo => {
        const opt = document.createElement('option');
        opt.value = ritmo.name;
        opt.innerText = ritmo.name;
        select.appendChild(opt);
    });
}

function poblarTablaPatologiasInfo() {
    const container = document.getElementById('lista-patologias-container');
    if (!container) return;
    let html = '<table class="patologias-table"><thead><tr><th>Ritmo</th><th>BPM</th><th>Complejo QRS</th><th>Onda P</th><th>Tratamiento</th></tr></thead><tbody>';
    RITMOS_ECG.forEach(r => {
        html += `<tr><td><strong>${r.name}</strong></td><td>${r.rate}</td><td>${r.qrs}</td><td>${r.p}</td><td>${r.treat}</td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function abrirModal(tipo) {
    if (tipo === 'patologias') {
        document.getElementById('modal-patologias-info').classList.remove('hidden');
    } else if (tipo === 'ajustes' || tipo === 'bias') {
        alert(`ℹ️ Índice de Dependencia de IA actual: ${indiceSesgoIA}%\nEl modelo asistente tiene una precisión base del 85%.`);
    }
}

function cerrarModalInfoPatologias() {
    document.getElementById('modal-patologias-info').classList.add('hidden');
}
