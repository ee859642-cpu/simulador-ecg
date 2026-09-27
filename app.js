// ==================== CONFIGURACIÓN DE FIREBASE ====================
const firebaseConfig = {
    apiKey: "AIzaSyDemoKeyUniversityECG2026",
    authDomain: "simulador-ecg-biomedica.firebaseapp.com",
    projectId: "simulador-ecg-biomedica",
    storageBucket: "simulador-ecg-biomedica.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

let db = null;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} catch (e) {
    console.warn("Firebase no inicializado. Usando modo de almacenamiento local.");
}

// ==================== ESTADO GLOBAL DE LA APLICACIÓN ====================
let datosJugador = {
    nombre: "",
    genero: "masculino",
    avatar: "👨‍⚕️"
};

let tiempoInicioJuego = null;
let timerInterval = null;
let tiempoTotalSegundos = 0;

let nivelMaximoDesbloqueado = 1;
let nivelActual = 1;
let aciertosNivel2 = 0;
const MAX_ACIERTOS_NIVEL2 = 3;
let electrodosColocados = 0;
let casoActualN2 = null;

let indiceSesgoIA = 0;
let contadorAciertosIA = 0;
let animacionCanvasId = null;

// ==================== SINTETIZADOR DE SONIDOS ====================
class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playButtonClick() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    playSuccess() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    playError() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    playDrop() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}

const audioFX = new SoundManager();

// ==================== BASE DE DATOS DE 27 RITMOS ECG ====================
const RITMOS_ECG = [
    { id: "sr", name: "Normal Sinus Rhythm", rate: 72, qrs: "Normal (<120ms)", p: "Presente, regular", treat: "Ninguno (Ritmo Fisiológico Normal)" },
    { id: "sb", name: "Sinus Bradycardia", rate: 48, qrs: "Normal", p: "Presente", treat: "Observación / Atropina si presenta síntomas" },
    { id: "st", name: "Sinus Tachycardia", rate: 135, qrs: "Normal", p: "Presente", treat: "Tratar la causa subyacente (fiebre, dolor, deshidratación)" },
    { id: "sa", name: "Sinus Arrhythmia", rate: 75, qrs: "Normal", p: "Presente", treat: "Ninguno (Variación fásica respiratoria normal)" },
    { id: "sinus_arrest", name: "Sinus Arrest / Pause", rate: 50, qrs: "Normal", p: "Ausente en pausa", treat: "Evaluar fármacos / Considerar marcapasos" },
    { id: "pac", name: "Premature Atrial Contraction (PAC)", rate: 80, qrs: "Normal", p: "Prematura / Anómala", treat: "Monitoreo / Evitar estimulantes" },
    { id: "svt", name: "Supraventricular Tachycardia (SVT)", rate: 180, qrs: "Estrecho", p: "Oculta / Retrógrada", treat: "Maniobras vagales / Adenosina IV" },
    { id: "afib", name: "Atrial Fibrillation (AFib)", rate: 110, qrs: "Estrecho Irregular", p: "Ondas f caóticas", treat: "Control de frecuencia + Anticoagulación" },
    { id: "aflutter", name: "Atrial Flutter", rate: 150, qrs: "Estrecho", p: "Ondas F en diente de sierra", treat: "Control de frecuencia / Ablación" },
    { id: "mat", name: "Multifocal Atrial Tachycardia (MAT)", rate: 125, qrs: "Estrecho", p: "≥3 morfologías distintas", treat: "Tratar enfermedad pulmonar (EPOC)" },
    { id: "junctional", name: "Junctional Escape Rhythm", rate: 45, qrs: "Estrecho", p: "Ausente / Invertida", treat: "Atropina o marcapasos si sintomático" },
    { id: "avb1", name: "1st Degree AV Block", rate: 65, qrs: "Normal", p: "PR prolongado (>200ms)", treat: "Observación y monitoreo" },
    { id: "avb2_1", name: "2nd Degree AV Block (Mobitz I)", rate: 58, qrs: "Normal", p: "PR se alarga progresivamente", treat: "Observación / Suspender frenadores AV" },
    { id: "avb2_2", name: "2nd Degree AV Block (Mobitz II)", rate: 42, qrs: "Ancho/Normal", p: "PR constante con P bloqueada", treat: "Marcapasos de emergencia" },
    { id: "avb3", name: "3rd Degree Complete AV Block", rate: 35, qrs: "Ancho", p: "Disociación AV completa", treat: "Marcapasos definitivo" },
    { id: "rbbb", name: "Right Bundle Branch Block (RBBB)", rate: 70, qrs: "Ancho (rsR' en V1)", p: "Normal", treat: "Evaluación clínica general" },
    { id: "pvc_mono", name: "Monomorphic PVC", rate: 75, qrs: "Ancho y mella", p: "Ausente en PVC", treat: "Observación si es asintomático" },
    { id: "pvc_poly", name: "Polymorphic PVC", rate: 82, qrs: "Ancho heterogéneo", p: "Ausente", treat: "Corregir electrolitos (K+, Mg2+)" },
    { id: "vt_mono", name: "Monomorphic Ventricular Tachycardia", rate: 190, qrs: "Muy ancho", p: "Disociada / Oculta", treat: "Cardioversión eléctrica / Amiodarona" },
    { id: "vt_poly", name: "Polymorphic V-Tach (Torsades)", rate: 220, qrs: "Huso / Variable", p: "No visible", treat: "Sulfato de Magnesio IV / Desfibrilación" },
    { id: "vfib", name: "Ventricular Fibrillation (V-Fib)", rate: 0, qrs: "Caótico sin QRS", p: "Ausente", treat: "¡EMERGENCIA! Desfibrilación + RCP" },
    { id: "idioventricular", name: "Accelerated Idioventricular Rhythm", rate: 70, qrs: "Ancho", p: "Ausente", treat: "Monitoreo tras reperfusión en IAM" },
    { id: "st_elevation", name: "ST-Elevation Myocardial Infarction", rate: 85, qrs: "Elevación ST", p: "Normal", treat: "¡CÓDIGO INFARTO! Angioplastia" },
    { id: "st_depression", name: "ST-Depression (Ischemia)", rate: 90, qrs: "Infradesnivel ST", p: "Normal", treat: "Antiagregantes + Nitratos" },
    { id: "asystole", name: "Asystole", rate: 0, qrs: "Línea plana", p: "Ausente", treat: "RCP + Adrenalina (NO DESFIBRILABLE)" },
    { id: "pea", name: "Pulseless Electrical Activity (PEA)", rate: 60, qrs: "Variable", p: "Variable", treat: "RCP + Adrenalina + Tratar causa 5H/5T" },
    { id: "pacemaker", name: "Paced Ventricular Rhythm", rate: 70, qrs: "Espiga + QRS ancho", p: "Variable", treat: "Verificar captura del marcapasos" }
];

// ==================== CASOS NIVEL 3 ====================
const CASOS_NIVEL3 = [
    {
        id: 1,
        paciente: "Paciente masculino de 68 años presenta mareo, palpitaciones irregulares y astenia.",
        patologia: "Atrial Fibrillation (AFib)",
        piezas: [
            { id: 0, label: "Ondas f caóticas", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q10,15 20,25 T40,20 T60,25 T80,18 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 1, label: "Complejo QRS #1", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L20,20 L25,35 L30,5 L35,25 L40,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 2, label: "Pausa R-R Irregular", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q15,23 30,17 T60,22 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 3, label: "Complejo QRS #2", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L50,20 L55,35 L60,5 L65,25 L70,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' }
        ]
    }
];

let ordenSeleccionadoN3 = [null, null, null, null];

// ==================== EVENTOS Y FLUJO INICIAL ====================
window.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        audioFX.init();
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            audioFX.playButtonClick();
        }
    });

    inicializarDragAndDropNivel1();
    poblarSelectDiagnosticos();
    poblarTablaPatologiasInfo();
    ajustarTamanioCanvas();
    window.addEventListener('resize', ajustarTamanioCanvas);
});

function mostrarPantallaRegistro() {
    audioFX.playDrop();
    document.getElementById('screen-welcome').classList.add('hidden');
    document.getElementById('screen-register').classList.remove('hidden');
}

function seleccionarGenero(genero) {
    audioFX.playDrop();
    datosJugador.genero = genero;
    datosJugador.avatar = (genero === 'masculino') ? '👨‍⚕️' : '👩‍⚕️';

    document.getElementById('btn-gender-m').classList.toggle('active', genero === 'masculino');
    document.getElementById('btn-gender-f').classList.toggle('active', genero === 'femenino');
}

function confirmarRegistroYComenzar() {
    const inputNombre = document.getElementById('player-name-input').value.trim();
    if (!inputNombre) {
        audioFX.playError();
        alert("Ingresa tu nombre o código para registrar tu progreso.");
        return;
    }

    datosJugador.nombre = inputNombre;
    document.getElementById('hud-avatar').innerText = datosJugador.avatar;
    document.getElementById('hud-username').innerText = datosJugador.nombre;

    tiempoInicioJuego = new Date();
    timerInterval = setInterval(actualizarCronometro, 1000);

    audioFX.playSuccess();
    document.getElementById('screen-register').classList.add('hidden');
    document.getElementById('screen-level-map').classList.remove('hidden');
    actualizarInterfazMapa();
}

function actualizarCronometro() {
    if (!tiempoInicioJuego) return;
    const ahora = new Date();
    tiempoTotalSegundos = Math.floor((ahora - tiempoInicioJuego) / 1000);

    const min = String(Math.floor(tiempoTotalSegundos / 60)).padStart(2, '0');
    const seg = String(tiempoTotalSegundos % 60).padStart(2, '0');
    document.getElementById('hud-timer').innerText = `⏱️ ${min}:${seg}`;
}

// ==================== MAPA DE NIVELES ====================
function seleccionarNivelDesdeMapa(nivel) {
    if (nivel > nivelMaximoDesbloqueado) {
        audioFX.playError();
        alert("🔒 Completa la fase anterior para desbloquear esta nivel.");
        return;
    }

    audioFX.playDrop();
    document.getElementById('screen-level-map').classList.add('hidden');
    document.getElementById('screen-gameplay').classList.remove('hidden');

    if (nivel === 1) iniciarNivel1();
    else if (nivel === 2) comenzarNivel2();
    else if (nivel === 3) comenzarNivel3();
}

function volverAlMapa() {
    audioFX.playDrop();
    detenerAnimacionCanvas();
    document.getElementById('screen-gameplay').classList.add('hidden');
    document.getElementById('screen-level-map').classList.remove('hidden');
    actualizarInterfazMapa();
}

function actualizarInterfazMapa() {
    for (let i = 1; i <= 3; i++) {
        const btnNode = document.getElementById(`node-level-${i}`);
        if (btnNode) {
            if (i <= nivelMaximoDesbloqueado) {
                btnNode.classList.remove('locked');
                btnNode.classList.add('unlocked');
            } else {
                btnNode.classList.add('locked');
                btnNode.classList.remove('unlocked');
            }
        }
    }
}

// ==================== NIVEL 1: DRAG & DROP ====================
function iniciarNivel1() {
    nivelActual = 1;
    electrodosColocados = 0;
    document.getElementById('hud-level-badge').innerText = 'NIVEL 1';
    document.getElementById('electrode-placement-panel').classList.remove('hidden');
    document.getElementById('ai-panel').classList.add('hidden');
    document.getElementById('puzzle-ecg-panel').classList.add('hidden');
}

function inicializarDragAndDropNivel1() {
    const electrodos = document.querySelectorAll('.electrode-circle');
    const zonasDrop = document.querySelectorAll('.dropzone-overlay');

    electrodos.forEach(el => {
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', el.dataset.lead);
        });
    });

    zonasDrop.forEach(zona => {
        zona.addEventListener('dragover', (e) => e.preventDefault());
        zona.addEventListener('drop', (e) => {
            e.preventDefault();
            const leadDragged = e.dataTransfer.getData('text/plain');
            if (leadDragged === zona.dataset.target) {
                if (zona.classList.contains('placed')) return;
                audioFX.playDrop();
                zona.classList.add('placed');
                zona.innerText = '✓';
                electrodosColocados++;

                const elArrastrado = document.querySelector(`.electrode-circle[data-lead="${leadDragged}"]`);
                if (elArrastrado) elArrastrado.style.visibility = 'hidden';

                if (electrodosColocados === 6) {
                    audioFX.playSuccess();
                    nivelMaximoDesbloqueado = Math.max(nivelMaximoDesbloqueado, 2);
                    setTimeout(() => {
                        alert("🎉 ¡Nivel 1 completado con éxito!");
                        volverAlMapa();
                    }, 400);
                }
            } else {
                audioFX.playError();
            }
        });
    });
}

// ==================== NIVEL 2: DIBUJO MATEMÁTICO ECG Y SESGO DE IA ====================
function comenzarNivel2() {
    nivelActual = 2;
    aciertosNivel2 = 0;
    document.getElementById('hud-level-badge').innerText = 'NIVEL 2';
    document.getElementById('electrode-placement-panel').classList.add('hidden');
    document.getElementById('puzzle-ecg-panel').classList.add('hidden');
    document.getElementById('ai-panel').classList.remove('hidden');
    cargarSiguienteCasoNivel2();
}

function cargarSiguienteCasoNivel2() {
    const idx = Math.floor(Math.random() * RITMOS_ECG.length);
    casoActualN2 = RITMOS_ECG[idx];

    // Algoritmo de Sesgo de la IA
    let nombreSugerido = casoActualN2.name;
    if (contadorAciertosIA >= 2 || indiceSesgoIA > 40) {
        // La IA falla a propósito para probar la autonomía del biomédico
        const casoFalso = RITMOS_ECG[(idx + 3) % RITMOS_ECG.length];
        nombreSugerido = casoFalso.name;
    }

    document.getElementById('ai-diagnosis-text').innerText = nombreSugerido;
    document.getElementById('bpm-display').innerText = `BPM: ${casoActualN2.rate}`;
    iniciarAnimacionECG(casoActualN2.id);
}

function calcularOndaECG(tipo, x, scale) {
    const cycle = (x % 120) / 120;
    switch (tipo) {
        case 'vfib':
            return (Math.sin(x * 0.12) * 0.5 + Math.cos(x * 0.25) * 0.4 + (Math.random() - 0.5) * 0.3) * scale;
        case 'vt_mono':
            return Math.sin(x * 0.08) * scale * 0.95;
        case 'aflutter':
            return (Math.sin(x * 0.2) * 0.25 + (cycle > 0.48 && cycle < 0.52 ? 0.9 : 0)) * scale;
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

function iniciarAnimacionECG(tipo) {
    detenerAnimacionCanvas();
    const canvas = document.getElementById('ecg-wave');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let x = 0;

    function dibujar() {
        const h = canvas.height;
        const scale = h * 0.4;
        const centerY = h / 2;

        ctx.fillStyle = 'rgba(2, 18, 8, 0.2)';
        ctx.fillRect(x, 0, 6, h);

        const y = centerY - calcularOndaECG(tipo, x, scale);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 2, y);
        ctx.stroke();

        x = (x + 2) % canvas.width;
        animacionCanvasId = requestAnimationFrame(dibujar);
    }
    dibujar();
}

function tomarDecisionIA() {
    const sug = document.getElementById('ai-diagnosis-text').innerText;
    indiceSesgoIA = Math.min(100, indiceSesgoIA + 15);
    evaluarRespuestaNivel2(sug);
}

function abrirModalManual() {
    document.getElementById('modal-manual').classList.remove('hidden');
}

function cerrarModalManual() {
    document.getElementById('modal-manual').classList.add('hidden');
}

function evaluarDiagnosticoManual() {
    const sel = document.getElementById('select-diagnostico').value;
    cerrarModalManual();
    contadorAciertosIA = 0;
    indiceSesgoIA = Math.max(0, indiceSesgoIA - 20);
    evaluarRespuestaNivel2(sel);
}

function evaluarRespuestaNivel2(diagnostico) {
    if (diagnostico === casoActualN2.name) {
        audioFX.playSuccess();
        aciertosNivel2++;
        contadorAciertosIA++;
        document.getElementById('res-status-title').innerText = "¡Correcto! 🎉";
    } else {
        audioFX.playError();
        document.getElementById('res-status-title').innerText = "Incorrecto ⚠️";
    }

    document.getElementById('res-real-diag').innerText = casoActualN2.name;
    document.getElementById('res-treatment-text').innerText = casoActualN2.treat;
    document.getElementById('modal-resultado').classList.remove('hidden');
}

function siguienteCasoNivel2() {
    document.getElementById('modal-resultado').classList.add('hidden');
    if (aciertosNivel2 >= MAX_ACIERTOS_NIVEL2) {
        nivelMaximoDesbloqueado = Math.max(nivelMaximoDesbloqueado, 3);
        alert("🏆 ¡Nivel 2 completado! Se ha desbloqueado la Fase 3.");
        volverAlMapa();
    } else {
        cargarSiguienteCasoNivel2();
    }
}

// ==================== NIVEL 3: PUZZLE CLÍNICO ====================
function comenzarNivel3() {
    nivelActual = 3;
    document.getElementById('hud-level-badge').innerText = 'NIVEL 3';
    document.getElementById('electrode-placement-panel').classList.add('hidden');
    document.getElementById('ai-panel').classList.add('hidden');
    document.getElementById('puzzle-ecg-panel').classList.remove('hidden');
    cargarCasoNivel3(0);
}

function cargarCasoNivel3(index) {
    const caso = CASOS_NIVEL3[index];
    ordenSeleccionadoN3 = [null, null, null, null];
    document.getElementById('n3-patient-title').innerText = `CASO CLÍNICO: ${caso.patologia}`;
    document.getElementById('n3-patient-desc').innerText = caso.paciente;

    const container = document.getElementById('puzzle-pieces-container');
    container.innerHTML = '';
    caso.piezas.forEach(p => {
        const div = document.createElement('div');
        div.style.background = '#101929';
        div.style.padding = '10px';
        div.style.borderRadius = '8px';
        div.style.border = '1px solid #23334d';
        div.style.cursor = 'pointer';
        div.innerHTML = `${p.svg}<p style="font-size:0.75rem; text-align:center; margin-top:4px;">${p.label}</p>`;
        div.onclick = () => colocarPiezaN3(p, div);
        container.appendChild(div);
    });
}

function colocarPiezaN3(pieza, elem) {
    const slotLibre = ordenSeleccionadoN3.findIndex(v => v === null);
    if (slotLibre !== -1) {
        audioFX.playDrop();
        ordenSeleccionadoN3[slotLibre] = pieza.id;
        const slotDiv = document.querySelector(`.puzzle-slot[data-slot="${slotLibre}"]`);
        slotDiv.innerHTML = pieza.svg;
        elem.style.visibility = 'hidden';

        if (!ordenSeleccionadoN3.includes(null)) {
            audioFX.playSuccess();
            setTimeout(finalizarJuegoYMostrarCertificado, 800);
        }
    }
}

// ==================== FINALIZACIÓN Y TABLAS ====================
function finalizarJuegoYMostrarCertificado() {
    clearInterval(timerInterval);
    detenerAnimacionCanvas();

    document.getElementById('screen-gameplay').classList.add('hidden');
    document.getElementById('screen-congratulations').classList.remove('hidden');

    const min = String(Math.floor(tiempoTotalSegundos / 60)).padStart(2, '0');
    const seg = String(tiempoTotalSegundos % 60).padStart(2, '0');
    document.getElementById('final-time').innerText = `${min}:${seg}`;

    const titulo = (datosJugador.genero === 'femenino') 
        ? `¡Felicidades ${datosJugador.nombre}, eres toda una Biomédica! 🎓👩‍⚕️`
        : `¡Felicidades ${datosJugador.nombre}, eres todo un Biomédico! 🎓👨‍⚕️`;
    document.getElementById('congrats-title').innerText = titulo;

    guardarEstadisticas({
        nombre: datosJugador.nombre,
        genero: datosJugador.genero,
        avatar: datosJugador.avatar,
        tiempoSegundos: tiempoTotalSegundos,
        tiempoTexto: `${min}:${seg}`,
        sesgoIA: indiceSesgoIA,
        fecha: new Date().toISOString()
    });
}

function guardarEstadisticas(data) {
    const statusEl = document.getElementById('firebase-sync-status');
    if (db) {
        db.collection("ranking_jugadores").add(data)
            .then(() => { statusEl.innerText = "🟢 Registrado en la base de datos del docente."; })
            .catch(() => { statusEl.innerText = "🟡 Almacenado localmente."; });
    } else {
        let ranking = JSON.parse(localStorage.getItem('ecg_ranking') || '[]');
        ranking.push(data);
        localStorage.setItem('ecg_ranking', JSON.stringify(ranking));
        statusEl.innerText = "🟢 Guardado localmente en este dispositivo.";
    }
}

function abrirLeaderboard() {
    audioFX.playDrop();
    const tbody = document.getElementById('leaderboard-tbody');
    tbody.innerHTML = '<tr><td colspan="6">Cargando datos...</td></tr>';
    document.getElementById('modal-leaderboard').classList.remove('hidden');

    if (db) {
        db.collection("ranking_jugadores").orderBy("tiempoSegundos", "asc").limit(10).get()
            .then(snapshot => {
                let html = '';
                let i = 1;
                snapshot.forEach(doc => {
                    const row = doc.data();
                    html += `<tr><td>#${i++}</td><td>${row.nombre}</td><td>${row.avatar}</td><td>${row.tiempoTexto}</td><td>100%</td><td>${row.sesgoIA < 30 ? 'Alta' : 'Moderada'}</td></tr>`;
                });
                tbody.innerHTML = html || '<tr><td colspan="6">Sin partidas registradas aún.</td></tr>';
            });
    } else {
        let ranking = JSON.parse(localStorage.getItem('ecg_ranking') || '[]');
        ranking.sort((a, b) => a.tiempoSegundos - b.tiempoSegundos);
        let html = '';
        ranking.forEach((row, i) => {
            html += `<tr><td>#${i + 1}</td><td>${row.nombre}</td><td>${row.avatar}</td><td>${row.tiempoTexto}</td><td>100%</td><td>${row.sesgoIA < 30 ? 'Alta' : 'Moderada'}</td></tr>`;
        });
        tbody.innerHTML = html || '<tr><td colspan="6">Sin registros locales.</td></tr>';
    }
}

function cerrarLeaderboard() {
    document.getElementById('modal-leaderboard').classList.add('hidden');
}

function poblarSelectDiagnosticos() {
    const select = document.getElementById('select-diagnostico');
    if (!select) return;
    select.innerHTML = '';
    RITMOS_ECG.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.name;
        opt.innerText = r.name;
        select.appendChild(opt);
    });
}

function poblarTablaPatologiasInfo() {
    const container = document.getElementById('lista-patologias-container');
    if (!container) return;
    let html = '<table class="patologias-table"><thead><tr><th>Ritmo</th><th>BPM</th><th>Complejo QRS</th><th>Onda P</th><th>Manejo Clínico</th></tr></thead><tbody>';
    RITMOS_ECG.forEach(r => {
        html += `<tr><td><strong>${r.name}</strong></td><td>${r.rate}</td><td>${r.qrs}</td><td>${r.p}</td><td>${r.treat}</td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function abrirModal(tipo) {
    if (tipo === 'patologias') document.getElementById('modal-patologias-info').classList.remove('hidden');
    else if (tipo === 'bias') alert(`ℹ️ Índice de Dependencia de IA: ${indiceSesgoIA}%\n\n• Si confías a ciegas en la IA, comenzará a equivocarse a propósito.\n• El diagnóstico manual restablece su precisión.`);
}

function cerrarModalInfoPatologias() {
    document.getElementById('modal-patologias-info').classList.add('hidden');
}

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

function toggleAudioGlobal() {
    const muted = audioFX.toggleMute();
    document.getElementById('btn-audio-toggle').innerText = muted ? "🔇 Audio: OFF" : "🔊 Audio: ON";
}

function reiniciarJuegoCompleto() {
    window.location.reload();
}
