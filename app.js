// ==================== CONFIGURACIÓN DE FIREBASE ====================
// Reemplaza estas credenciales con las de tu proyecto de Firebase cuando lo desees
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
    console.warn("Firebase no inicializado. Se utilizará almacenamiento local para los registros.");
}

// ==================== ESTADO GLOBAL DEL JUGADOR Y CRONÓMETRO ====================
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
let animacionCanvasId = null;

// ==================== SINTETIZADOR DE SONIDOS (WEB AUDIO API) ====================
class SoundManager {
    constructor() {
        this.ctx = null;
        this.bgOsc = null;
        this.bgGain = null;
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

    startBgMusic() {
        if (!this.ctx || this.bgOsc) return;
        this.bgOsc = this.ctx.createOscillator();
        this.bgGain = this.ctx.createGain();

        this.bgOsc.type = 'sine';
        this.bgOsc.frequency.setValueAtTime(110, this.ctx.currentTime);
        this.bgGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

        this.bgOsc.connect(this.bgGain);
        this.bgGain.connect(this.ctx.destination);

        this.bgOsc.start();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.bgGain) {
            this.bgGain.gain.setValueAtTime(this.isMuted ? 0 : 0.02, this.ctx.currentTime);
        }
        return this.isMuted;
    }
}

const audioFX = new SoundManager();

// ==================== BASE DE DATOS COMPLETA DE 27 RITMOS ECG ====================
const RITMOS_ECG = [
    // --- Ritmos Sinusales Normales y Variantes (1 - 5) ---
    { id: "sr", name: "Normal Sinus Rhythm", rate: 72, treat: "Ninguno (Ritmo Fisiológico Normal)" },
    { id: "sb", name: "Sinus Bradycardia", rate: 48, treat: "Observación / Atropina si presenta síntomas" },
    { id: "st", name: "Sinus Tachycardia", rate: 135, treat: "Tratar la causa subyacente (fiebre, dolor, deshidratación)" },
    { id: "sa", name: "Sinus Arrhythmia", rate: 75, treat: "Ninguno (Variación fásica respiratoria normal)" },
    { id: "sinus_arrest", name: "Sinus Arrest / Pause", rate: 50, treat: "Evaluar fármacos / Considerar marcapasos si es recurrente" },

    // --- Arritmias Auriculares / Supraventriculares (6 - 11) ---
    { id: "pac", name: "Premature Atrial Contraction (PAC)", rate: 80, treat: "Monitoreo / Evitar estimulantes (cafeína, estrés)" },
    { id: "svt", name: "Supraventricular Tachycardia (SVT)", rate: 180, treat: "Maniobras vagales / Adenosina IV" },
    { id: "afib", name: "Atrial Fibrillation (AFib)", rate: 110, treat: "Control de frecuencia (Betabloqueantes) + Anticoagulación" },
    { id: "aflutter", name: "Atrial Flutter", rate: 150, treat: "Control de frecuencia / Cardioversión / Ablación" },
    { id: "mat", name: "Multifocal Atrial Tachycardia (MAT)", rate: 125, treat: "Tratar enfermedad pulmonar (EPOC) / Bloqueadores de canales de calcio" },
    { id: "junctional", name: "Junctional Escape Rhythm", rate: 45, treat: "Monitoreo / Atropina o marcapasos si hay compromiso hemodinámico" },

    // --- Bloqueos Atrioventriculares - AV (12 - 16) ---
    { id: "avb1", name: "1st Degree AV Block", rate: 65, treat: "Observación / Monitoreo continuo (intervalo PR prolongado)" },
    { id: "avb2_1", name: "2nd Degree AV Block (Mobitz I / Wenckebach)", rate: 58, treat: "Observación / Suspender fármacos que frenen el nodo AV" },
    { id: "avb2_2", name: "2nd Degree AV Block (Mobitz II)", rate: 42, treat: "Marcapasos temporal / Transitorio -> Marcapasos definitivo" },
    { id: "avb3", name: "3rd Degree Complete AV Block", rate: 35, treat: "Marcapasos de emergencia (Transcutáneo / Definitivo)" },
    { id: "rbbb", name: "Right Bundle Branch Block (RBBB)", rate: 70, treat: "Evaluación clínica / Generalmente no requiere tratamiento específico" },

    // --- Arritmias Ventriculares (17 - 22) ---
    { id: "pvc_mono", name: "Monomorphic PVC", rate: 75, treat: "Observación si es asintomático / Betabloqueantes si es muy frecuente" },
    { id: "pvc_poly", name: "Polymorphic PVC", rate: 82, treat: "Corregir electrolitos (K+, Mg2+) / Evaluar isquemia" },
    { id: "vt_mono", name: "Monomorphic Ventricular Tachycardia (V-Tach)", rate: 190, treat: "Cardioversión eléctrica si hay pulso / Amiodarona" },
    { id: "vt_poly", name: "Polymorphic V-Tach (Torsades de Pointes)", rate: 220, treat: "Sulfato de Magnesio IV / Desfibrilación si no hay pulso" },
    { id: "vfib", name: "Ventricular Fibrillation (V-Fib)", rate: 0, treat: "¡EMERGENCIA! Desfibrilación inmediata + RCP de alta calidad" },
    { id: "idioventricular", name: "Accelerated Idioventricular Rhythm (AIVR)", rate: 70, treat: "Monitoreo / Suele ser benigno tras reperfusión en IAM" },

    // --- Condición Isquémica, Alteraciones de Paro y Marcapasos (23 - 27) ---
    { id: "st_elevation", name: "ST-Elevation Myocardial Infarction (STEMI)", rate: 85, treat: "¡CÓDIGO INFARTO! Angioplastia primaria / Trombólisis" },
    { id: "st_depression", name: "ST-Depression (Ischemia)", rate: 90, treat: "Antiagregantes, Nitratos, Antianginosos / Cateterismo" },
    { id: "asystole", name: "Asystole", rate: 0, treat: "RCP + Adrenalina 1mg IV cada 3-5 min (NO DESFIBRILABLE)" },
    { id: "pea", name: "Pulseless Electrical Activity (PEA)", rate: 60, treat: "RCP + Adrenalina + Tratar causas reversibles (5Ts y 5Hs)" },
    { id: "pacemaker", name: "Paced Ventricular Rhythm", rate: 70, treat: "Verificar captura y funcionamiento del marcapasos" }
];

// ==================== CASOS CLÍNICOS NIVEL 3 ====================
const CASOS_NIVEL3 = [
    {
        id: 1,
        paciente: "Paciente masculino de 68 años con palpitaciones y pulso irregular.",
        patologia: "Atrial Fibrillation (AFib)",
        piezas: [
            { id: 0, label: "Ondas f caóticas iniciales", hint: "Línea de base irregular", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q10,15 20,25 T40,20 T60,25 T80,18 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 1, label: "Despolarización Ventricular #1", hint: "QRS Angosto", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L20,20 L25,35 L30,5 L35,25 L40,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 2, label: "Pausa Inter-R-R Irregular", hint: "Intervalo R-R variable", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q15,23 30,17 T60,22 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 3, label: "Despolarización Ventricular #2", hint: "Segundo QRS", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L50,20 L55,35 L60,5 L65,25 L70,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' }
        ],
        tratamientoCorrecto: 1,
        opcionesTratamiento: [
            "Cardioversión eléctrica inmediata sin anticoagulación",
            "Control de frecuencia cardíaca (Betabloqueantes) y Anticoagulación",
            "Atropina 1mg IV en bolo"
        ]
    }
];

let ordenSeleccionadoN3 = [null, null, null, null];

// ==================== INICIALIZACIÓN Y FLUJO DE REGISTRO ====================
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
    audioFX.init();
    audioFX.startBgMusic();
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
        alert("Por favor, ingresa tu nombre o código antes de continuar.");
        return;
    }

    datosJugador.nombre = inputNombre;

    // Actualizar HUD
    document.getElementById('hud-avatar').innerText = datosJugador.avatar;
    document.getElementById('hud-username').innerText = datosJugador.nombre;
    document.getElementById('hud-bar').classList.remove('hidden');

    // Iniciar Cronómetro Global
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
        alert("🔒 Debes completar los niveles anteriores para desbloquear esta fase.");
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

// ==================== PANTALLA FINAL Y BANCO DE DATOS FIREBASE ====================
function finalizarJuegoYMostrarCertificado() {
    clearInterval(timerInterval);
    detenerAnimacionCanvas();

    document.getElementById('screen-gameplay').classList.add('hidden');
    document.getElementById('screen-level-map').classList.add('hidden');
    document.getElementById('screen-congratulations').classList.remove('hidden');

    const min = String(Math.floor(tiempoTotalSegundos / 60)).padStart(2, '0');
    const seg = String(tiempoTotalSegundos % 60).padStart(2, '0');
    const textoTiempo = `${min}:${seg}`;

    document.getElementById('final-avatar-display').innerText = datosJugador.avatar;
    document.getElementById('final-time').innerText = textoTiempo;

    // Mensaje dinámico adaptado al género del jugador
    const titulo = (datosJugador.genero === 'femenino') 
        ? `¡Felicidades ${datosJugador.nombre}, eres toda una Biomédica! 🎓👩‍⚕️`
        : `¡Felicidades ${datosJugador.nombre}, eres todo un Biomédico! 🎓👨‍⚕️`;
    
    document.getElementById('congrats-title').innerText = titulo;

    // Guardar estadísticas para la computadora principal
    guardarEstadisticasEnServidor({
        nombre: datosJugador.nombre,
        genero: datosJugador.genero,
        avatar: datosJugador.avatar,
        tiempoSegundos: tiempoTotalSegundos,
        tiempoTexto: textoTiempo,
        sesgoIA: indiceSesgoIA,
        fecha: new Date().toISOString()
    });
}

function guardarEstadisticasEnServidor(data) {
    const statusEl = document.getElementById('firebase-sync-status');
    if (db) {
        db.collection("ranking_jugadores").add(data)
            .then(() => {
                if (statusEl) statusEl.innerText = "🟢 ¡Resultados guardados en la base de datos del docente!";
            })
            .catch(err => {
                console.error("Error al guardar en Firebase:", err);
                if (statusEl) statusEl.innerText = "🟡 Resultados guardados localmente.";
            });
    } else {
        let registros = JSON.parse(localStorage.getItem('ecg_ranking') || '[]');
        registros.push(data);
        localStorage.setItem('ecg_ranking', JSON.stringify(registros));
        if (statusEl) statusEl.innerText = "🟢 Registrado en la memoria local del dispositivo.";
    }
}

function abrirLeaderboard() {
    audioFX.playDrop();
    const tbody = document.getElementById('leaderboard-tbody');
    tbody.innerHTML = '<tr><td colspan="6">Cargando datos...</td></tr>';

    document.getElementById('modal-leaderboard').classList.remove('hidden');

    if (db) {
        db.collection("ranking_jugadores")
            .orderBy("tiempoSegundos", "asc")
            .limit(10)
            .get()
            .then(querySnapshot => {
                let html = '';
                let index = 1;
                querySnapshot.forEach(doc => {
                    const row = doc.data();
                    html += `<tr>
                        <td><strong>#${index++}</strong></td>
                        <td>${row.nombre}</td>
                        <td>${row.avatar}</td>
                        <td>${row.tiempoTexto}</td>
                        <td>100%</td>
                        <td>${row.sesgoIA < 30 ? 'Alta' : 'Moderada'}</td>
                    </tr>`;
                });
                tbody.innerHTML = html || '<tr><td colspan="6">Aún no hay registros guardados.</td></tr>';
            });
    } else {
        let registros = JSON.parse(localStorage.getItem('ecg_ranking') || '[]');
        registros.sort((a, b) => a.tiempoSegundos - b.tiempoSegundos);
        let html = '';
        registros.forEach((row, i) => {
            html += `<tr>
                <td><strong>#${i + 1}</strong></td>
                <td>${row.nombre}</td>
                <td>${row.avatar}</td>
                <td>${row.tiempoTexto}</td>
                <td>100%</td>
                <td>${row.sesgoIA < 30 ? 'Alta' : 'Moderada'}</td>
            </tr>`;
        });
        tbody.innerHTML = html || '<tr><td colspan="6">No hay partidas registradas localmente.</td></tr>';
    }
}

function cerrarLeaderboard() {
    document.getElementById('modal-leaderboard').classList.add('hidden');
}

function reiniciarJuegoCompleto() {
    window.location.reload();
}

// ==================== NIVEL 1: DRAG & DROP ELECTRODOS ====================
function iniciarNivel1() {
    nivelActual = 1;
    electrodosColocados = 0;
    document.getElementById('level-badge').innerText = 'NIVEL 1';
    document.getElementById('level-title').innerText = 'Colocación de Electrodos y Derivaciones';
    document.getElementById('electrode-placement-panel').classList.remove('hidden');
    document.getElementById('puzzle-ecg-panel').classList.add('hidden');
    document.getElementById('ai-panel').classList.add('hidden');
}

function inicializarDragAndDropNivel1() {
    const electrodos = document.querySelectorAll('.electrode-circle');
    const zonasDrop = document.querySelectorAll('.dropzone-overlay');

    electrodos.forEach(el => {
        el.addEventListener('dragstart', (e) => {
            audioFX.init();
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
                        alert("🎉 ¡Nivel 1 completado! Se ha desbloqueado el Nivel 2.");
                        volverAlMapa();
                    }, 400);
                }
            } else {
                audioFX.playError();
            }
        });
    });
}

// ==================== NIVEL 2: ANÁLISIS E IA MÉDICA ====================
function comenzarNivel2() {
    nivelActual = 2;
    aciertosNivel2 = 0;
    document.getElementById('level-badge').innerText = 'NIVEL 2';
    document.getElementById('level-title').innerText = 'Análisis e IA Médica';
    document.getElementById('electrode-placement-panel').classList.add('hidden');
    document.getElementById('puzzle-ecg-panel').classList.add('hidden');
    document.getElementById('ai-panel').classList.remove('hidden');
    cargarSiguienteCasoNivel2();
}

function cargarSiguienteCasoNivel2() {
    const idx = Math.floor(Math.random() * RITMOS_ECG.length);
    casoActualN2 = RITMOS_ECG[idx];
    document.getElementById('ai-diagnosis-text').innerText = casoActualN2.name;
    document.getElementById('bpm-display').innerText = `BPM: ${casoActualN2.rate}`;
    iniciarAnimacionECG(casoActualN2.id);
}

function tomarDecisionIA() {
    evaluarRespuestaNivel2(casoActualN2.name, true);
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
    evaluarRespuestaNivel2(sel, false);
}

function evaluarRespuestaNivel2(diagnostico, provieneDeIA) {
    if (diagnostico === casoActualN2.name) {
        audioFX.playSuccess();
        aciertosNivel2++;
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
        audioFX.playSuccess();
        nivelMaximoDesbloqueado = Math.max(nivelMaximoDesbloqueado, 3);
        alert("🏆 ¡Nivel 2 completado! Desbloqueaste el Nivel 3.");
        volverAlMapa();
    } else {
        cargarSiguienteCasoNivel2();
    }
}

// ==================== NIVEL 3: PUZZLE CLÍNICO ====================
function comenzarNivel3() {
    nivelActual = 3;
    document.getElementById('level-badge').innerText = 'NIVEL 3';
    document.getElementById('level-title').innerText = 'Rompecabezas Clínico';
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
        div.className = 'puzzle-piece-item';
        div.style.background = '#1e293b';
        div.style.padding = '10px';
        div.style.borderRadius = '8px';
        div.style.cursor = 'pointer';
        div.style.border = '1px solid #334155';
        div.innerHTML = `${p.svg}<p style="font-size:0.75rem; text-align:center; margin-top:5px;">${p.label}</p>`;
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
            setTimeout(() => {
                finalizarJuegoYMostrarCertificado();
            }, 800);
        }
    }
}

// ==================== RENDERIZADO ECG Y MODALES DE INFORMACIÓN ====================
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

function iniciarAnimacionECG(tipo) {
    detenerAnimacionCanvas();
    const canvas = document.getElementById('ecg-wave');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let x = 0;

    function dibujar() {
        ctx.fillStyle = '#051109';
        ctx.fillRect(x, 0, 4, canvas.height);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height / 2);
        ctx.lineTo(x + 2, canvas.height / 2 - (Math.sin(x * 0.1) * 20));
        ctx.stroke();
        x = (x + 2) % canvas.width;
        animacionCanvasId = requestAnimationFrame(dibujar);
    }
    dibujar();
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
    let html = '<table style="width:100%; text-align:left; border-collapse:collapse;">';
    html += '<thead><tr style="border-bottom:2px solid #38bdf8;"><th>Nombre de Ritmo / Patología</th><th>Manejo y Conducta Clínica</th></tr></thead><tbody>';
    RITMOS_ECG.forEach(r => {
        html += `<tr style="border-bottom:1px solid #334155;"><td style="padding:8px;"><strong>${r.name}</strong></td><td style="padding:8px;">${r.treat}</td></tr>`;
    });
    html += 'tbody></table>';
    container.innerHTML = html;
}

function abrirModal(tipo) {
    if (tipo === 'patologias') document.getElementById('modal-patologias-info').classList.remove('hidden');
}

function cerrarModalInfoPatologias() {
    document.getElementById('modal-patologias-info').classList.add('hidden');
}

function toggleAudioGlobal() {
    const muted = audioFX.toggleMute();
    document.getElementById('btn-audio-toggle').innerText = muted ? "🔇 Audio: OFF" : "🔊 Audio: ON";
}
