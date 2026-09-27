// ==================== BASE DE DATOS DE RITMOS (27 RITMOS CON BPM EXACTOS) ====================
const RITMOS_ECG = [
    { id: "sr", name: "Sinus rhythm", rate: 72, qrs: "Normal", p: "Presente", st: "Isoeléctrico", treat: "Ninguno (Ritmo Fisiológico Normal)", status: "Fisiológico", type: "sinusal" },
    { id: "sb", name: "Sinus bradycardia", rate: 54, qrs: "Normal", p: "Presente", st: "Isoeléctrico", treat: "Observación / Atropina si sintomático", status: "Sintomático", type: "sinusal" },
    { id: "st", name: "Sinus Tachycardia", rate: 138, qrs: "Normal", p: "Presente", st: "Isoeléctrico", treat: "Tratar causa subyacente (Fiebre, Dolor, Anemia)", status: "Secundario", type: "sinusal" },
    { id: "sa", name: "Sinus Arhythmia", rate: 78, qrs: "Normal", p: "Presente", st: "Isoeléctrico", treat: "Ninguno (Variación fásica respiratoria normal)", status: "Benigno", type: "sinusal" },
    { id: "s_block", name: "Sinus exits block", rate: 48, qrs: "Normal", p: "Pausas/Ausente", st: "Isoeléctrico", treat: "Evaluación clínica / Marcapasos si sintomático", status: "Sintomático", type: "sinusal" },
    { id: "s_arrest", name: "Sinus arrest", rate: 54, qrs: "Normal", p: "Pausa prolongada", st: "Isoeléctrico", treat: "Evaluación médica / Marcapasos", status: "Sintomático", type: "sinusal" },
    { id: "pac", name: "NSR with PAC(PJC) NSR with premature atrial", rate: 84, qrs: "Estrecho", p: "Prematura/Anormal", st: "Isoeléctrico", treat: "Tranquilizar al paciente / Evitar estimulantes", status: "Benigno", type: "auricular" },
    { id: "svt", name: "Supraventricular tachycardia", rate: 180, qrs: "Estrecho", p: "Oculta o retrograda", st: "Infradesnivel en crisis", treat: "Maniobras vagales / Adenosina IV", status: "Urgencia", type: "auricular" },
    { id: "afib", name: "Atrial Fibrillallation", rate: 90, qrs: "Estrecho", p: "Ausente (Ondas f caóticas)", st: "Variable", treat: "Control de Frecuencia + Anticoagulación", status: "Patológico", type: "auricular" },
    { id: "aflutter", name: "Atrial Flutter", rate: 75, qrs: "Estrecho", p: "Dientes de Sierra (Ondas F)", st: "Variable", treat: "Control de frecuencia / Cardioversión / Ablación", status: "Patológico", type: "auricular" },
    { id: "paced_a", name: "Paced Atrial rhythm", rate: 60, qrs: "Estrecho", p: "Spike de Marcapasos", st: "Isoeléctrico", treat: "Monitoreo de Marcapasos", status: "Controlado", type: "auricular" },
    { id: "avb1", name: "NSR with 1 AVB(NSR with first degree AV Block)", rate: 74, qrs: "Estrecho", p: "PR Prolongado (>0.20s)", st: "Isoeléctrico", treat: "Observación (Monitorización)", status: "Benigno", type: "bloqueo" },
    { id: "avb2_1", name: "2 AVB type I", rate: 48, qrs: "Estrecho", p: "PR se alarga progresivamente", st: "Isoeléctrico", treat: "Observación / Revertir causas", status: "Generalmente Benigno", type: "bloqueo" },
    { id: "avb2_2", name: "2 AVB type II", rate: 60, qrs: "Ancho/Estrecho", p: "PR constante con P bloqueada", st: "Isoeléctrico", treat: "Marcapasos Temporal / Definitivo", status: "Peligroso", type: "bloqueo" },
    { id: "avb2_21", name: "2 AVB 2:1", rate: 38, qrs: "Ancho/Estrecho", p: "Conducción 2:1", st: "Isoeléctrico", treat: "Marcapasos Temporal / Definitivo", status: "Peligroso", type: "bloqueo" },
    { id: "avb3", name: "3 AV Block", rate: 36, qrs: "Ancho (Escape Ventricular)", p: "Disociada por completo", st: "Isoeléctrico", treat: "Marcapasos de Emergencia + Isoproterenol", status: "Emergencia", type: "bloqueo" },
    { id: "pjc", name: "NSR with PJC(Premature Junctional Complex)", rate: 84, qrs: "Estrecho", p: "Invertida/Oculta", st: "Isoeléctrico", treat: "Observación / Evitar estimulantes", status: "Benigno", type: "nodal" },
    { id: "j_rhythm", name: "Junctional Rhythm", rate: 48, qrs: "Estrecho", p: "Invertida/Oculta", st: "Isoeléctrico", treat: "Tratar causa subyacente / Atropina si sintomático", status: "Pasivo", type: "nodal" },
    { id: "acc_junct", name: "Accelerated Junctional", rate: 82, qrs: "Estrecho", p: "Invertida/Oculta", st: "Isoeléctrico", treat: "Monitorización / Evaluar toxicidad digitálica", status: "Patológico", type: "nodal" },
    { id: "j_tach", name: "Junctional Tachycardia", rate: 186, qrs: "Estrecho", p: "Invertida/Oculta", st: "Isoeléctrico", treat: "Betabloqueantes / Antiarrítmicos", status: "Urgencia", type: "nodal" },
    { id: "wandering", name: "Wandering Pacemaker", rate: 78, qrs: "Estrecho", p: "Variables en forma", st: "Isoeléctrico", treat: "Tratamiento conservador", status: "Benigno", type: "auricular" },
    { id: "pvc", name: "NSR with PVC(Sinus Rhythm with Premature ventricular complex)", rate: 68, qrs: "Ancho y aberrante", p: "Ausente en PVC", st: "Oposición T-QRS", treat: "Betabloqueantes si sintomático", status: "Variable", type: "ventricular" },
    { id: "idiov", name: "Idioventricular rhythm", rate: 36, qrs: "Ancho", p: "Ausente/Disociada", st: "Alterado", treat: "Marcapasos / Atropina / Soporte Vital", status: "Emergencia", type: "ventricular" },
    { id: "acc_idiov", name: "Accelerated dioventricular rhythm", rate: 84, qrs: "Ancho", p: "Ausente/Disociada", st: "Alterado", treat: "Observación (Ritmo de reperfusión)", status: "Post-Reperfusión", type: "ventricular" },
    { id: "vt_mono", name: "Ventricular tachycardia(VTach)", rate: 210, qrs: "Ancho idéntico", p: "Disociación AV", st: "Alterado", treat: "Cardioversión eléctrica / Amiodarona", status: "Emergencia", type: "ventricular" },
    { id: "vfib", name: "Ventricular fibrillation", rate: 0, qrs: "Ausente / Caótico", p: "Ausente", st: "Ausente", treat: "Desfibrilación inmediata + RCP de alta calidad", status: "Paro Cardíaco", type: "ventricular" },
    { id: "paced_v", name: "Paced Ventricula", rate: 80, qrs: "Ancho (Spike previo)", p: "Variable", st: "Alterado secundario", treat: "Monitoreo de Marcapasos Ventricular", status: "Controlado", type: "ventricular" }
];

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
        patologia: "Atrial Fibrillallation",
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
        patologia: "Ventricular tachycardia(VTach)",
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
        patologia: "Ventricular tachycardia(VTach)",
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

    const modalN1 = document.getElementById('modal-nivel1-intro');
    if (modalN1) modalN1.classList.remove('hidden');

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
    const electrodos = document.querySelectorAll('.electrode-circle');
    const zonasDrop = document.querySelectorAll('.dropzone-overlay');

    electrodos.forEach(el => {
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', el.dataset.lead);
            el.style.opacity = '0.5';
        });

        el.addEventListener('dragend', () => {
            el.style.opacity = '1';
        });
    });

    zonasDrop.forEach(zona => {
        zona.addEventListener('dragover', (e) => {
            e.preventDefault();
            zona.style.transform = 'translate(-50%, -50%) scale(1.2)';
        });

        zona.addEventListener('dragleave', () => {
            zona.style.transform = 'translate(-50%, -50%) scale(1.0)';
        });

        zona.addEventListener('drop', (e) => {
            e.preventDefault();
            zona.style.transform = 'translate(-50%, -50%) scale(1.0)';
            
            const leadDragged = e.dataTransfer.getData('text/plain');
            const targetZone = zona.dataset.target;

            if (leadDragged === targetZone) {
                if (zona.classList.contains('placed')) return;

                zona.classList.add('placed');
                zona.innerText = '✓';

                const originalEl = document.querySelector(`.electrode-circle[data-lead="${leadDragged}"]`);
                if (originalEl) {
                    originalEl.style.opacity = '0.25';
                    originalEl.style.cursor = 'not-allowed';
                    originalEl.setAttribute('draggable', 'false');
                }

                electrodosColocados++;

                const scoreBadge = document.getElementById('score-badge');
                if (scoreBadge) {
                    scoreBadge.textContent = `🎯 Nivel 1: ${electrodosColocados} / 6`;
                }

                if (electrodosColocados === 6) {
                    setTimeout(() => {
                        const modalN2 = document.getElementById('modal-nivel2');
                        if (modalN2) modalN2.classList.remove('hidden');
                    }, 400);
                }
            } else {
                zona.style.borderColor = '#ef4444';
                setTimeout(() => {
                    if (!zona.classList.contains('placed')) {
                        zona.style.borderColor = '#10b981';
                    }
                }, 800);
            }
        });
    });
}

// ==================== LÓGICA DEL NIVEL 2: ANÁLISIS DE ECG ====================
function comenzarNivel2() {
    nivelActual = 2;
    aciertosNivel2 = 0;

    const modalN2 = document.getElementById('modal-nivel2');
    if (modalN2) modalN2.classList.add('hidden');

    document.getElementById('level-badge').innerText = 'NIVEL 2';
    document.getElementById('level-title').innerText = 'Análisis de Señales e Interpretación de ECG';

    const scoreBadge = document.getElementById('score-badge');
    scoreBadge.classList.remove('hidden');
    scoreBadge.innerText = `🎯 Aciertos: ${aciertosNivel2} / ${MAX_ACIERTOS_NIVEL2}`;

    document.getElementById('ai-panel').classList.remove('hidden');

    cargarSiguienteCasoNivel2();
}

function cargarSiguienteCasoNivel2() {
    const indiceAleatorio = Math.floor(Math.random() * RITMOS_ECG.length);
    casoActualN2 = RITMOS_ECG[indiceAleatorio];

    const patientInfo = document.getElementById('patient-info');
    if (patientInfo) {
        patientInfo.innerText = `Paciente: ID PAC-${Math.floor(Math.random() * 899 + 100)} (${Math.floor(Math.random() * 50 + 25)} años)`;
    }

    // Actualiza el elemento de BPM en la interfaz inferior respetando el ID "bpm-display"
    const bpmDisplay = document.getElementById('bpm-display');
    if (bpmDisplay) {
        bpmDisplay.innerText = casoActualN2.rate;
    }

    const aciertoIA = Math.random() < 0.85;
    const sugerenciaIA = aciertoIA ? casoActualN2.name : RITMOS_ECG[Math.floor(Math.random() * RITMOS_ECG.length)].name;
    const confianzaIA = Math.floor(Math.random() * 15 + 83);

    document.getElementById('ai-diagnosis-text').innerText = sugerenciaIA;
    document.getElementById('ai-confidence-text').innerText = `Confianza: ${confianzaIA}%`;
    document.getElementById('ai-diagnosis-text').dataset.sugerencia = sugerenciaIA;

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
        document.getElementById('res-status-badge').style.background = "#10b981";
        document.getElementById('res-status-badge').style.color = "#000";

        if (provieneDeIA) {
            indiceSesgoIA = Math.min(100, indiceSesgoIA + 10);
        }
    } else {
        document.getElementById('res-status-title').innerText = "Diagnóstico Incorrecto ⚠️";
        document.getElementById('res-status-badge').innerText = "INCORRECTO";
        document.getElementById('res-status-badge').style.background = "#ef4444";
        document.getElementById('res-status-badge').style.color = "#FFF";

        if (!provieneDeIA) {
            indiceSesgoIA = Math.max(0, indiceSesgoIA - 5);
        }
    }

    document.getElementById('score-badge').innerText = `🎯 Aciertos: ${aciertosNivel2} / ${MAX_ACIERTOS_NIVEL2}`;
    document.getElementById('bias-display').innerText = `Índice Dependencia IA: ${indiceSesgoIA}%`;
    document.getElementById('bias-info-footer').innerText = `Índice Dependencia IA: ${indiceSesgoIA}%`;

    document.getElementById('res-real-diag').innerText = casoActualN2.name;
    document.getElementById('res-treatment-text').innerHTML = `<strong>Conducta / Tratamiento Recomendado:</strong><br>${casoActualN2.treat}`;

    modalRes.classList.remove('hidden');
}

function siguienteCasoNivel2() {
    document.getElementById('modal-resultado').classList.add('hidden');

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

    const modalN3Intro = document.getElementById('modal-nivel3-intro');
    if (modalN3Intro) modalN3Intro.classList.add('hidden');

    document.getElementById('level-badge').innerText = 'NIVEL 3';
    document.getElementById('level-title').innerText = 'Rompecabezas y Tratamiento Fisiológico';
    document.getElementById('score-badge').classList.add('hidden');
    document.getElementById('ai-panel').classList.add('hidden');

    document.getElementById('electrode-placement-panel').classList.add('hidden');
    document.getElementById('puzzle-ecg-panel').classList.remove('hidden');

    cargarCasoNivel3(casoActualN3);
}

function cargarCasoNivel3(index) {
    const caso = CASOS_NIVEL3[index];
    ordenSeleccionadoN3 = [null, null, null, null];

    const titleElem = document.getElementById('n3-patient-title');
    const descElem = document.getElementById('n3-patient-desc');
    const treatSec = document.getElementById('n3-treatment-section');

    if (titleElem) titleElem.innerText = `CASO CLÍNICO ${index + 1} / 3: ${caso.patologia}`;
    if (descElem) descElem.innerText = caso.paciente;
    if (treatSec) treatSec.classList.add('hidden');

    const slots = document.querySelectorAll('.puzzle-slot');
    slots.forEach(slot => {
        slot.innerHTML = `<span class="slot-number">${parseInt(slot.dataset.slot) + 1}</span>`;
        slot.classList.remove('filled');
    });

    const containerPiezas = document.getElementById('puzzle-pieces-container');
    if (containerPiezas) {
        containerPiezas.innerHTML = '';
        let piezasMezcladas = [...caso.piezas].sort(() => Math.random() - 0.5);

        piezasMezcladas.forEach(p => {
            const div = document.createElement('div');
            div.className = 'puzzle-piece';
            div.style.background = '#1e293b';
            div.style.border = '1px solid #334155';
            div.style.padding = '10px';
            div.style.borderRadius = '8px';
            div.style.cursor = 'pointer';
            div.innerHTML = `${p.svg}<p style="font-size:0.75rem; color:#94a3b8; text-align:center;">${p.label}</p>`;
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
                btn.className = 'btn-ai-confirm';
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

        let yOffset = calcularEcuacionOnda(x, tipoRitmo, canvas.height);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#10b981';
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
    const cycle = (x % 140) / 140;

    switch (tipo) {
        case 'afib':
            return (Math.sin(x * 0.3) * 0.1 + (Math.random() - 0.5) * 0.15) * scale + (cycle > 0.45 && cycle < 0.5 ? (Math.random() > 0.5 ? 0.8 : -0.2) : 0) * scale;
        case 'aflutter':
            return (Math.sin(x * 0.2) * 0.25 + (cycle > 0.48 && cycle < 0.52 ? 0.9 : 0)) * scale;
        case 'vt_mono':
            return Math.sin(x * 0.08) * scale * 0.95;
        case 'vfib':
            return (Math.sin(x * 0.12) * 0.5 + Math.cos(x * 0.25) * 0.4 + (Math.random() - 0.5) * 0.3) * scale;
        case 'sb':
            const cycleSlow = (x % 240) / 240;
            if (cycleSlow > 0.1 && cycleSlow < 0.18) return Math.sin((cycleSlow - 0.1) * Math.PI / 0.08) * 0.15 * scale;
            if (cycleSlow > 0.38 && cycleSlow < 0.42) return (cycleSlow < 0.4 ? -0.15 : 0.9) * scale;
            return 0;
        case 'st':
            const cycleFast = (x % 80) / 80;
            if (cycleFast > 0.38 && cycleFast < 0.44) return 0.85 * scale;
            return 0;
        default:
            if (cycle > 0.15 && cycle < 0.25) return Math.sin((cycle - 0.15) * Math.PI / 0.1) * 0.15 * scale;
            if (cycle > 0.38 && cycle < 0.40) return -0.15 * scale;
            if (cycle >= 0.40 && cycle < 0.43) return 0.95 * scale;
            if (cycle >= 0.43 && cycle < 0.45) return -0.25 * scale;
            if (cycle > 0.55 && cycle < 0.70) return Math.sin((cycle - 0.55) * Math.PI / 0.15) * 0.25 * scale;
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
    let html = '<table class="patologias-table" style="width:100%; text-align:left; border-collapse:collapse;"><thead><tr style="border-bottom:1px solid #334155;"><th>Ritmo</th><th>BPM</th><th>Complejo QRS</th><th>Onda P</th><th>Tratamiento</th></tr></thead><tbody>';
    RITMOS_ECG.forEach(r => {
        html += `<tr style="border-bottom:1px solid #1e293b;"><td><strong style="color:#38bdf8;">${r.name}</strong></td><td>${r.rate}</td><td>${r.qrs}</td><td>${r.p}</td><td>${r.treat}</td></tr>`;
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
