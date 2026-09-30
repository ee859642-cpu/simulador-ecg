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
const MAX_ELECTRODOS_NIVEL1 = 10; // 6 precordiales + 4 periféricos
let electrodosColocados = 0;
let casoActualN2 = null;

let usoSeguidoIA = 0;
let analisisManualesSeguidos = 0;
let indiceSesgoIA = 0;

let animacionCanvasId = null;

let jugadorNombre = '';
let jugadorGenero = '';
let horaInicioJuego = null;
let intentosNivel2 = 0;

let nivel1Terminado = false;
let nivel2Terminado = false;
let nivel3Terminado = false;

// ==================== SONIDO (WEB AUDIO API, SIN ARCHIVOS EXTERNOS) ====================
let audioCtx = null;
let latidoIntervalId = null;

function obtenerAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Los navegadores dejan el audio "suspendido" hasta que hay interacción: se reactiva siempre
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function reproducirClic() {
    try {
        const ctx = obtenerAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) { /* Audio no soportado */ }
}

function reproducirLatido() {
    try {
        const ctx = obtenerAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    } catch (e) { /* Audio no soportado */ }
}

function iniciarLatidoSonoro(bpm) {
    detenerLatidoSonoro();
    const intervaloMs = bpm > 0 ? (60000 / bpm) : 1200;
    reproducirLatido();
    latidoIntervalId = setInterval(reproducirLatido, intervaloMs);
}

function detenerLatidoSonoro() {
    if (latidoIntervalId) {
        clearInterval(latidoIntervalId);
        latidoIntervalId = null;
    }
}

function reproducirAlarma() {
    try {
        const ctx = obtenerAudioCtx();
        const frecuencias = [1200, 900];
        frecuencias.forEach((freq, i) => {
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.15);
            }, i * 180);
        });
    } catch (e) { /* Audio no soportado */ }
}

// CORREGIDO: los electrodos se ARRASTRAN, y un arrastre no dispara 'click'. Se usa 'pointerdown'
// (se dispara al tocar/presionar, también al iniciar un arrastre). El 'click' solo cubre el teclado.
const SELECTOR_SONIDO = 'button, .electrode-circle, .puzzle-piece';
document.addEventListener('pointerdown', (e) => {
    if (e.target.closest && e.target.closest(SELECTOR_SONIDO)) reproducirClic();
}, true);
document.addEventListener('click', (e) => {
    if (e.detail === 0 && e.target.closest && e.target.closest(SELECTOR_SONIDO)) reproducirClic(); // Enter/Espacio
});

function tono(freq, inicioS, durS, tipo = 'sine', vol = 0.15) {
    try {
        const ctx = obtenerAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = tipo;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + inicioS);
        gain.gain.setValueAtTime(vol, ctx.currentTime + inicioS);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + inicioS + durS);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + inicioS);
        osc.stop(ctx.currentTime + inicioS + durS);
    } catch (e) { /* Audio no soportado */ }
}
function reproducirAcierto() { tono(660, 0, 0.12); tono(990, 0.1, 0.18); }          // "ding" ascendente
function reproducirError() { tono(200, 0, 0.22, 'sawtooth', 0.12); }                 // zumbido grave


// ==================== MODO DOCENTE / EXPORTAR RESULTADOS A CSV ====================
function exportarResultadosCSV() {
    try {
        const datos = JSON.parse(localStorage.getItem('ecg_leaderboard') || '[]');
        if (datos.length === 0) {
            alert('ℹ️ Aún no hay resultados guardados para exportar.');
            return;
        }
        let csv = 'Nombre,Genero,TiempoMs,Precision,Autonomia,Fecha\n';
        datos.forEach(r => {
            csv += `${r.nombre},${r.genero},${r.tiempoMs},${r.precision},${r.autonomia},${r.fecha}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultados_ecg_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error('Error al exportar CSV:', e);
        alert('⚠️ No se pudo exportar el archivo CSV.');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'E') {
        exportarResultadosCSV();
    }
});

// ==================== PANTALLA DE BIENVENIDA Y MAPA DE NIVELES ====================
function iniciarJuegoDesdeSplash() {
    const modalSplash = document.getElementById('modal-splash');
    if (modalSplash) modalSplash.classList.add('hidden');

    const modalRegistro = document.getElementById('modal-registro');
    if (modalRegistro) modalRegistro.classList.remove('hidden');
}

function obtenerEstadoNivel(n) {
    if (n === 1) return nivel1Terminado ? 'completado' : 'actual';
    if (n === 2) {
        if (nivel2Terminado) return 'completado';
        return nivel1Terminado ? 'actual' : 'bloqueado';
    }
    if (n === 3) {
        if (nivel3Terminado) return 'completado';
        return nivel2Terminado ? 'actual' : 'bloqueado';
    }
    return 'bloqueado';
}

function renderizarMapaNiveles() {
    const contenedor = document.getElementById('mapa-contenedor');
    if (!contenedor) return;

    const infoNiveles = [
        { n: 1, titulo: 'Nivel 1', desc: 'Colocación de Electrodos' },
        { n: 2, titulo: 'Nivel 2', desc: 'Diagnóstico con IA' },
        { n: 3, titulo: 'Nivel 3', desc: 'Rompecabezas y Tratamiento' }
    ];

    contenedor.innerHTML = '';
    infoNiveles.forEach(info => {
        const estado = obtenerEstadoNivel(info.n);
        const icono = estado === 'completado' ? '✅' : (estado === 'bloqueado' ? '🔒' : '▶️');
        const btn = document.createElement('button');
        btn.className = `mapa-nodo mapa-nodo-${estado}`;
        btn.innerHTML = `<span class="mapa-nodo-icono">${icono}</span><strong>${info.titulo}</strong><span>${info.desc}</span>`;
        btn.onclick = () => seleccionarNodoMapa(info.n);
        contenedor.appendChild(btn);
    });
}

function abrirModalMapa() {
    renderizarMapaNiveles();
    const modalMapa = document.getElementById('modal-mapa-niveles');
    if (modalMapa) modalMapa.classList.remove('hidden');
}

function cerrarModalMapa() {
    const modalMapa = document.getElementById('modal-mapa-niveles');
    if (modalMapa) modalMapa.classList.add('hidden');
}

function seleccionarNodoMapa(n) {
    const estado = obtenerEstadoNivel(n);

    if (estado === 'bloqueado') {
        alert('🔒 Todavía no has desbloqueado este nivel. Completa el nivel anterior primero.');
        return;
    }

    cerrarModalMapa();

    if (estado === 'completado') {
        alert('✅ Ya completaste este nivel. ¡Buen trabajo!');
        return;
    }

    if (n === 1 && electrodosColocados === 0) {
        const modalN1 = document.getElementById('modal-nivel1-intro');
        if (modalN1) modalN1.classList.remove('hidden');
    }
}

// ==================== REGISTRO DE JUGADOR Y AVATAR ====================
function seleccionarGenero(genero, btnEl) {
    jugadorGenero = genero;
    document.querySelectorAll('.btn-genero').forEach(b => b.classList.remove('genero-selected'));
    btnEl.classList.add('genero-selected');
}

function registrarJugador() {
    const inputNombre = document.getElementById('input-nombre-jugador');
    const nombre = inputNombre ? inputNombre.value.trim() : '';

    if (!nombre) {
        alert('⚠️ Por favor escribe tu nombre para continuar.');
        return;
    }
    if (!jugadorGenero) {
        alert('⚠️ Por favor selecciona un género para asignar tu avatar.');
        return;
    }

    jugadorNombre = nombre;
    horaInicioJuego = Date.now();

    const avatarEmoji = jugadorGenero === 'femenino' ? '👩‍⚕️' : '🧑‍⚕️';
    const tituloAvatar = jugadorGenero === 'femenino' ? 'Biomédica' : 'Biomédico';

    const playerBadge = document.getElementById('player-badge');
    if (playerBadge) {
        playerBadge.innerText = `${avatarEmoji} ${jugadorNombre} (${tituloAvatar})`;
    }

    const modalRegistro = document.getElementById('modal-registro');
    if (modalRegistro) modalRegistro.classList.add('hidden');

    abrirModalMapa();
}

// ==================== ESTADÍSTICAS Y PANTALLA FINAL PERSONALIZADA ====================
function mostrarPantallaFinal() {
    detenerLatidoSonoro();

    const tiempoTotalMs = horaInicioJuego ? (Date.now() - horaInicioJuego) : 0;
    const minutos = Math.floor(tiempoTotalMs / 60000);
    const segundos = Math.floor((tiempoTotalMs % 60000) / 1000);
    const tiempoFormateado = `${minutos}m ${segundos}s`;

    const precisionNivel2 = intentosNivel2 > 0
        ? Math.round((aciertosNivel2 / intentosNivel2) * 100)
        : 100;

    const autonomiaIA = 100 - indiceSesgoIA;

    const avatarEmoji = jugadorGenero === 'femenino' ? '👩‍⚕️' : '🧑‍⚕️';
    const tituloAvatar = jugadorGenero === 'femenino' ? 'Biomédica' : 'Biomédico';
    const nombreMostrado = jugadorNombre || 'Estudiante';
    const terminacion = jugadorGenero === 'femenino' ? 'a' : 'o';

    const finalBadge = document.getElementById('final-player-badge');
    if (finalBadge) finalBadge.innerText = `${avatarEmoji} ${nombreMostrado}`;

    const finalTitulo = document.getElementById('final-congrats-title');
    if (finalTitulo) {
        finalTitulo.innerText = `🏆 ¡Felicidades ${nombreMostrado}, eres tod${terminacion} un${terminacion} ${tituloAvatar}!`;
    }

    // NUEVO: el mascote "presenta" el resultado con una frase que resume el desempeño
    const mascotFinalMsg = document.getElementById('mascot-final-msg');
    if (mascotFinalMsg) {
        mascotFinalMsg.innerText = `👋 ¡Turno finalizado, ${nombreMostrado}! Lograste ${precisionNivel2}% de precisión en ${tiempoFormateado}. Aquí tienes tu reporte completo:`;
    }

    const resultadoActual = {
        nombre: nombreMostrado,
        genero: jugadorGenero,
        tiempoMs: tiempoTotalMs,
        precision: precisionNivel2,
        autonomia: autonomiaIA,
        fecha: new Date().toISOString()
    };

    let insignias = '';
    if (precisionNivel2 === 100) insignias += '<span class="badge-logro">🎯 Precisión de Élite</span>';
    if (autonomiaIA >= 80) insignias += '<span class="badge-logro">🧠 Diagnosticador Autónomo</span>';

    const finalStats = document.getElementById('final-stats');
    if (finalStats) {
        finalStats.innerHTML = `
            <p>⏱ Tiempo total: <strong>${tiempoFormateado}</strong></p>
            <p>🎯 Precisión diagnóstica: <strong>${precisionNivel2}%</strong></p>
            <p>🧠 Autonomía frente al sesgo de la IA: <strong>${autonomiaIA}%</strong></p>
            <div class="badges-container" id="final-badges">${insignias}</div>
            <h4 style="margin-top:14px; color:#38bdf8;">🏆 Tabla de Clasificación</h4>
            <div id="leaderboard-box"><p style="opacity:.7;">⏳ Cargando clasificación...</p></div>
        `;
    }

    // Guarda el resultado (local + nube) y pinta la clasificación global
    guardarYObtenerRanking(resultadoActual).then(({ lista, global }) => {
        renderizarClasificacion(lista, resultadoActual, global);
    });
}

// ==================== TABLA DE CLASIFICACIÓN COMPARTIDA (FIREBASE REALTIME DATABASE) ====================
// 1) Crea un proyecto en https://console.firebase.google.com  ->  Build -> Realtime Database -> Create database
// 2) Pestaña "Rules" y pega:  { "rules": { "ranking": { ".read": true, ".write": true } } }
// 3) Copia la URL de la base (ej: https://ecg-juego-default-rtdb.firebaseio.com) aquí abajo.
// Si se deja vacío, la tabla funciona solo en este dispositivo (localStorage).
const FIREBASE_DB_URL = "";

const escaparHTML = (t) => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const formatoTiempo = (ms) => `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;

// Orden: mayor precisión primero; en empate, menor tiempo
function ordenarRanking(lista) {
    return [...lista].sort((a, b) =>
        (b.precision !== a.precision) ? (b.precision - a.precision) : (a.tiempoMs - b.tiempoMs));
}

async function guardarYObtenerRanking(resultado) {
    const local = guardarResultadoLocal(resultado);
    if (!FIREBASE_DB_URL) return { lista: local, global: false };
    try {
        const base = FIREBASE_DB_URL.replace(/\/$/, '');
        await fetch(`${base}/ranking.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resultado)
        });
        const resp = await fetch(`${base}/ranking.json`);
        const datos = await resp.json();
        const lista = datos ? Object.values(datos) : [];
        return { lista, global: true };
    } catch (e) {
        console.warn('Sin conexión a la nube, se usa la tabla local.', e);
        return { lista: local, global: false };
    }
}

function renderizarClasificacion(lista, actual, global) {
    const box = document.getElementById('leaderboard-box');
    if (!box) return;
    const orden = ordenarRanking(lista);
    const esActual = (r) => r.fecha === actual.fecha && r.nombre === actual.nombre;
    const pos = orden.findIndex(esActual) + 1;

    let filas = '';
    orden.slice(0, 10).forEach((r, i) => {
        const medalla = ['🥇', '🥈', '🥉'][i] || (i + 1);
        const av = r.genero === 'femenino' ? '👩‍⚕️' : '🧑‍⚕️';
        filas += `<tr class="${esActual(r) ? 'fila-jugador-actual' : ''}">
            <td>${medalla}</td><td>${av} ${escaparHTML(r.nombre)}</td>
            <td>${r.precision}%</td><td>${formatoTiempo(r.tiempoMs)}</td></tr>`;
    });
    // Si el jugador quedó fuera del Top 10, se muestra su fila al final
    if (pos > 10) {
        filas += `<tr><td colspan="4" style="text-align:center;">···</td></tr>
            <tr class="fila-jugador-actual"><td>${pos}</td><td>${escaparHTML(actual.nombre)}</td>
            <td>${actual.precision}%</td><td>${formatoTiempo(actual.tiempoMs)}</td></tr>`;
    }

    box.innerHTML = `
        <p>📍 Tu posición: <strong>#${pos}</strong> de ${orden.length} jugadores
        ${global ? '🌐' : '<span style="opacity:.7;">(solo este dispositivo)</span>'}</p>
        <table class="leaderboard-table">
            <thead><tr><th>#</th><th>Jugador</th><th>Precisión</th><th>Tiempo</th></tr></thead>
            <tbody>${filas}</tbody>
        </table>
        <button class="btn-header" style="margin-top:8px;" onclick="actualizarClasificacion()">🔄 Actualizar tabla</button>`;

    if (pos === 1) {
        const b = document.getElementById('final-badges');
        if (b) b.insertAdjacentHTML('beforeend', '<span class="badge-logro">🥇 Primer Lugar</span>');
    }
    window._ultimoResultado = actual;
}

// Botón para que los jugadores vean cómo quedaron los demás sin volver a guardar
async function actualizarClasificacion() {
    const actual = window._ultimoResultado;
    if (!actual) return;
    let lista = [], global = false;
    if (FIREBASE_DB_URL) {
        try {
            const r = await fetch(`${FIREBASE_DB_URL.replace(/\/$/, '')}/ranking.json`);
            const d = await r.json();
            lista = d ? Object.values(d) : [];
            global = true;
        } catch (e) { /* cae a local */ }
    }
    if (!global) lista = JSON.parse(localStorage.getItem('ecg_leaderboard') || '[]');
    renderizarClasificacion(lista, actual, global);
}

function guardarResultadoLocal(resultado) {
    let datosPrevios = [];
    try {
        const clave = 'ecg_leaderboard';
        datosPrevios = JSON.parse(localStorage.getItem(clave) || '[]');
        datosPrevios.push(resultado);
        localStorage.setItem(clave, JSON.stringify(datosPrevios));
    } catch (e) {
        console.warn('No se pudo guardar el resultado localmente.', e);
    }
    return datosPrevios;
}

// ==================== INICIALIZACIÓN DE LA APLICACIÓN ====================
window.addEventListener('DOMContentLoaded', () => {
    inicializarDragAndDropNivel1();
    inicializarDragAndDropNivel3();
    poblarSelectDiagnosticos();
    poblarTablaPatologiasInfo();
    ajustarTamanioCanvas();

    const modalSplash = document.getElementById('modal-splash');
    if (modalSplash) modalSplash.classList.remove('hidden');

    const aiPanel = document.getElementById('ai-panel');
    if (aiPanel) aiPanel.classList.add('hidden');

    window.addEventListener('resize', ajustarTamanioCanvas);
});

function cerrarModalNivel1() {
    const modalN1 = document.getElementById('modal-nivel1-intro');
    if (modalN1) modalN1.classList.add('hidden');
}

// ==================== LÓGICA DEL NIVEL 1: ELECTRODOS (PRECORDIALES + PERIFÉRICOS) ====================
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
                reproducirAcierto();

                const originalEl = document.querySelector(`.electrode-circle[data-lead="${leadDragged}"]`);
                if (originalEl) {
                    originalEl.style.opacity = '0.25';
                    originalEl.style.cursor = 'not-allowed';
                    originalEl.setAttribute('draggable', 'false');
                }

                electrodosColocados++;

                const scoreBadge = document.getElementById('score-badge');
                if (scoreBadge) {
                    scoreBadge.textContent = `🎯 Nivel 1: ${electrodosColocados} / ${MAX_ELECTRODOS_NIVEL1}`;
                }

                if (electrodosColocados === MAX_ELECTRODOS_NIVEL1) {
                    nivel1Terminado = true;
                    setTimeout(() => {
                        const modalN2 = document.getElementById('modal-nivel2');
                        if (modalN2) modalN2.classList.remove('hidden');
                    }, 400);
                }
            } else {
                reproducirError();
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

// ==================== LÓGICA DEL NIVEL 2: ANÁLISIS DE ECG Y COMPORTAMIENTO DE IA ====================
function comenzarNivel2() {
    nivelActual = 2;
    aciertosNivel2 = 0;
    intentosNivel2 = 0;
    usoSeguidoIA = 0;
    analisisManualesSeguidos = 0;
    indiceSesgoIA = 0;

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

    const bpmDisplay = document.getElementById('bpm-display');
    if (bpmDisplay) {
        bpmDisplay.innerText = `BPM: ${casoActualN2.rate}`;
    }

    let laIaSeConfunde = (usoSeguidoIA >= 2) || (indiceSesgoIA >= 40);

    let sugerenciaIA;
    let confianzaIA;

    if (laIaSeConfunde) {
        const ritmosIncorrectos = RITMOS_ECG.filter(r => r.name !== casoActualN2.name);
        sugerenciaIA = ritmosIncorrectos[Math.floor(Math.random() * ritmosIncorrectos.length)].name;
        confianzaIA = Math.floor(Math.random() * 15 + 80);
    } else {
        sugerenciaIA = casoActualN2.name;
        confianzaIA = Math.floor(Math.random() * 12 + 88);
    }

    const aiDiagText = document.getElementById('ai-diagnosis-text');
    aiDiagText.innerText = sugerenciaIA;
    aiDiagText.dataset.sugerencia = sugerenciaIA;

    const aiConfText = document.getElementById('ai-confidence-text');
    if (aiConfText) {
        aiConfText.innerText = "";
    }

    iniciarAnimacionECG(casoActualN2.id);
    iniciarLatidoSonoro(casoActualN2.rate);

    if (casoActualN2.status === 'Emergencia' || casoActualN2.status === 'Paro Cardíaco') {
        reproducirAlarma();
    }
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
    intentosNivel2++;

    const esCorrecto = (diagnosticoPropuesto === casoActualN2.name);
    const modalRes = document.getElementById('modal-resultado');

    if (provieneDeIA) {
        usoSeguidoIA++;
        analisisManualesSeguidos = 0;
        indiceSesgoIA = Math.min(100, indiceSesgoIA + 25);
    } else {
        analisisManualesSeguidos++;
        usoSeguidoIA = 0;
        indiceSesgoIA = Math.max(0, indiceSesgoIA - 30);
    }

    if (esCorrecto) { reproducirAcierto(); } else { reproducirError(); }

    if (esCorrecto) {
        aciertosNivel2++;
        document.getElementById('res-status-title').innerText = "¡Diagnóstico Correcto! 🎉";
        document.getElementById('res-status-badge').innerText = "CORRECTO";
        document.getElementById('res-status-badge').style.background = "#10b981";
        document.getElementById('res-status-badge').style.color = "#000";
    } else {
        document.getElementById('res-status-title').innerText = provieneDeIA ? "¡La IA te ha confundido! ⚠️" : "Diagnóstico Incorrecto ⚠️";
        document.getElementById('res-status-badge').innerText = "INCORRECTO";
        document.getElementById('res-status-badge').style.background = "#ef4444";
        document.getElementById('res-status-badge').style.color = "#FFF";
    }

    document.getElementById('score-badge').innerText = `🎯 Aciertos: ${aciertosNivel2} / ${MAX_ACIERTOS_NIVEL2}`;
    
    const txtBias = `Dependencia IA: ${indiceSesgoIA}%`;
    const biasDisplay = document.getElementById('bias-display');
    const biasFooter = document.getElementById('bias-info-footer');

    if (biasDisplay) biasDisplay.innerText = txtBias;
    if (biasFooter) biasFooter.innerText = txtBias;

    document.getElementById('res-real-diag').innerText = casoActualN2.name;
    document.getElementById('res-treatment-text').innerHTML = `<strong>Conducta / Tratamiento Recomendado:</strong><br>${casoActualN2.treat}`;

    modalRes.classList.remove('hidden');
}

function siguienteCasoNivel2() {
    document.getElementById('modal-resultado').classList.add('hidden');

    if (aciertosNivel2 >= MAX_ACIERTOS_NIVEL2) {
        nivel2Terminado = true;
        setTimeout(() => {
            const modalN3Intro = document.getElementById('modal-nivel3-intro');
            if (modalN3Intro) modalN3Intro.classList.remove('hidden');
        }, 300);
    } else {
        cargarSiguienteCasoNivel2();
    }
}

// ==================== LÓGICA DEL NIVEL 3: ROMPECABEZAS POR ARRASTRE & TRATAMIENTO ====================
function comenzarNivel3() {
    nivelActual = 3;
    casoActualN3 = 0;

    detenerLatidoSonoro();

    const modalN3Intro = document.getElementById('modal-nivel3-intro');
    if (modalN3Intro) modalN3Intro.classList.add('hidden');

    document.getElementById('level-badge').innerText = 'NIVEL 3';
    document.getElementById('level-title').innerText = 'Rompecabezas de Continuidad y Tratamiento';
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
    if (descElem) {
        descElem.innerHTML = `${caso.paciente}<br><small style="color:#38bdf8;">🧩 Arrastra cada pieza al recuadro correcto para fusionarla con el trazado.</small>`;
    }
    if (treatSec) treatSec.classList.add('hidden');

    const slots = document.querySelectorAll('.puzzle-slot');
    slots.forEach(slot => {
        slot.innerHTML = `<span class="slot-number">${parseInt(slot.dataset.slot) + 1}</span>`;
        slot.classList.remove('filled', 'drag-over');
    });

    const containerPiezas = document.getElementById('puzzle-pieces-container');
    if (containerPiezas) {
        containerPiezas.innerHTML = '';
        let piezasMezcladas = [...caso.piezas].sort(() => Math.random() - 0.5);

        piezasMezcladas.forEach(p => {
            const div = document.createElement('div');
            div.className = 'puzzle-piece';
            div.draggable = true;
            div.dataset.pieceId = p.id;
            div.style.background = '#1e293b';
            div.style.border = '1px solid #334155';
            div.style.padding = '10px';
            div.style.borderRadius = '8px';
            div.innerHTML = `${p.svg}
                <p style="font-size:0.75rem; color:#f8fafc; text-align:center; font-weight:bold; margin-top:4px;">${p.label}</p>
                <p style="font-size:0.65rem; color:#38bdf8; text-align:center;">${p.hint}</p>`;

            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', String(p.id));
                div.style.opacity = '0.4';
            });
            div.addEventListener('dragend', () => {
                div.style.opacity = '1';
            });

            containerPiezas.appendChild(div);
        });
    }
}

function inicializarDragAndDropNivel3() {
    const slots = document.querySelectorAll('.puzzle-slot');

    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!slot.classList.contains('filled')) {
                slot.classList.add('drag-over');
            }
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');

            if (slot.classList.contains('filled')) return;

            const piezaId = parseInt(e.dataTransfer.getData('text/plain'));
            const caso = CASOS_NIVEL3[casoActualN3];
            const pieza = caso.piezas.find(p => p.id === piezaId);
            if (!pieza) return;

            const slotIndex = parseInt(slot.dataset.slot);
            ordenSeleccionadoN3[slotIndex] = pieza.id;

            slot.innerHTML = pieza.svg;
            slot.classList.add('filled');

            const piezaEnBandeja = document.querySelector(`.puzzle-piece[data-piece-id="${piezaId}"]`);
            if (piezaEnBandeja) piezaEnBandeja.style.visibility = 'hidden';

            if (!ordenSeleccionadoN3.includes(null)) {
                validarEnsambleN3();
            }
        });
    });
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
        alert("⚠️ La continuidad eléctrica o del ciclo fisiológico es incorrecta. Revisa los conectores y la forma de la señal.");
        cargarCasoNivel3(casoActualN3);
    }
}

function evaluarTratamientoN3(opcionSeleccionada) {
    const caso = CASOS_NIVEL3[casoActualN3];

    if (opcionSeleccionada === caso.tratamientoCorrecto) {
        casoActualN3++;
        if (casoActualN3 < CASOS_NIVEL3.length) {
            alert(`✅ ¡Excelente! Has completado la reconstrucción y conducta clínica para ${caso.patologia}. Pasamos al siguiente caso.`);
            cargarCasoNivel3(casoActualN3);
        } else {
            nivel3Terminado = true;
            mostrarPantallaFinal();
            document.getElementById('modal-juego-completado').classList.remove('hidden');
        }
    } else {
        alert("❌ Respuesta incorrecta. Revisa la patología y selecciona la conducta apropiada.");
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

// ==================== ANIMACIÓN DEL TRAZO ECG ====================
// CORRECCIÓN 1: el trazo ahora une cada punto con el ANTERIOR (antes partía siempre de la
// línea base, por eso se veían "picos rellenos") y se submuestrea para que los complejos
// estrechos y los spikes de marcapasos no se pierdan entre frames.
function iniciarAnimacionECG(tipoRitmo) {
    detenerAnimacionCanvas();
    const canvas = document.getElementById('ecg-wave');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = 0;
    const centerY = canvas.height / 2;
    const speed = 2.5;
    const SUBPASOS = 5; // 0.5 px por muestra
    let prevX = 0;
    let prevY = centerY - calcularEcuacionOnda(0, tipoRitmo, canvas.height);

    function dibujarFrame() {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        for (let i = 1; i <= SUBPASOS; i++) {
            const xs = x + (speed * i) / SUBPASOS;
            const ys = centerY - calcularEcuacionOnda(xs, tipoRitmo, canvas.height);
            ctx.lineTo(xs, ys);
            prevX = xs;
            prevY = ys;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        x += speed;

        // Borra una franja pequeña por delante del trazo (efecto monitor de barrido)
        ctx.clearRect(x + 1, 0, 14, canvas.height);

        if (x >= canvas.width) {
            x = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            prevX = 0;
            prevY = centerY - calcularEcuacionOnda(0, tipoRitmo, canvas.height);
        }

        animacionCanvasId = requestAnimationFrame(dibujarFrame);
    }

    dibujarFrame();
}

// ==================== GENERADOR DE ONDAS ECG POR MORFOLOGÍA (P-Q-R-S-T) ====================
// CORRECCIÓN 2: cada latido se construye como suma de gaussianas (P, Q, R, S, T, spike),
// con amplitud POSITIVA o NEGATIVA. Así existen las deflexiones por debajo de la línea base
// (S, QS, T invertida, QRS ancho negativo, etc.).
// Escala horizontal: 150 px = 1 segundo  ->  longitud de un ciclo (px) = 9000 / BPM.
const PX_POR_SEG = 150;
const LARGO_TRAZO = 4500;              // px de patrón precalculado (cubre pantallas anchas)
const cacheRitmosECG = {};

const gauss = (t, mu, sigma, amp) => amp * Math.exp(-((t - mu) * (t - mu)) / (2 * sigma * sigma));
const cicloPx = (bpm) => (60 / bpm) * PX_POR_SEG;

// Devuelve las componentes [centro, sigma, amplitud] de un latido, relativas al pico R (t = 0)
function morfologia(o = {}) {
    const d = Object.assign({
        pa: 0.14, pr: 26, ps: 4.2,           // onda P (amplitud, distancia a R, ancho)
        qa: -0.12, ra: 1.0, sa: -0.25, rw: 2.0, // complejo QRS
        ta: 0.30, tt: 40, tw: 9,             // onda T (amplitud, posición, ancho)
        extra: []
    }, o);
    const c = [];
    if (d.pa) c.push([-d.pr, d.ps, d.pa]);
    if (d.qa) c.push([-d.rw * 2.4, d.rw * 0.7, d.qa]);
    c.push([0, d.rw, d.ra]);
    if (d.sa) c.push([d.rw * 2.4, d.rw * 0.9, d.sa]);
    if (d.ta) c.push([d.tt, d.tw, d.ta]);
    return c.concat(d.extra);
}

// Preajustes de QRS ancho (origen ventricular): QRS ancho + T discordante (invertida)
const ANCHO = { qa: 0, sa: 0, pa: 0, rw: 6.5, ra: 1.0, ta: -0.40, tt: 50, tw: 12 };

function crearRitmo(tipo) {
    const latidos = []; // {pos, comps}
    const latido = (pos, o) => latidos.push({ pos, comps: morfologia(o) });
    const soloP = (pos, amp = 0.14) => latidos.push({ pos, comps: [[0, 4.2, amp]] });
    let extra = null;

    // Genera latidos con intervalos dados (array que se repite) hasta cubrir el trazo
    const secuencia = (intervalos, inicio, fn) => {
        let pos = inicio, k = 0;
        while (pos < LARGO_TRAZO) {
            fn(pos, k);
            pos += intervalos[k % intervalos.length];
            k++;
        }
    };

    switch (tipo) {
        // ---------- SINUSAL ----------
        case 'sb': {
            const L = cicloPx(54);
            secuencia([L], 50, (p) => latido(p, { pr: 30, tt: 46, tw: 10 }));
            break;
        }
        case 'st': {
            const L = cicloPx(138);
            secuencia([L], 30, (p) => latido(p, { pr: 19, pa: 0.12, ps: 3.2, tt: 27, tw: 6.5, ta: 0.26 }));
            break;
        }
        case 'sa': {
            const L = cicloPx(78);
            const ints = []; for (let i = 0; i < 40; i++) ints.push(L + Math.sin(i * 0.75) * L * 0.28);
            secuencia(ints, 50, (p) => latido(p));
            break;
        }
        case 's_block': { // bloqueo de salida: desaparece un ciclo completo (P-QRS-T) periódicamente
            const L = cicloPx(75);
            secuencia([L], 50, (p, k) => { if (k % 4 !== 3) latido(p); });
            break;
        }
        case 's_arrest': { // pausa prolongada, NO múltiplo del ciclo base
            const L = cicloPx(70);
            secuencia([L, L, L, L, L * 2.9], 50, (p) => latido(p));
            break;
        }
        case 'pac': { // PAC: latido prematuro con P invertida/distinta
            const L = cicloPx(84);
            secuencia([L, L, L * 0.68, L * 1.3], 50, (p, k) => {
                if (k % 4 === 2) latido(p, { pa: -0.10, pr: 17, ta: 0.34, tt: 38 });
                else latido(p);
            });
            break;
        }

        // ---------- AURICULAR ----------
        case 'svt': {
            const L = cicloPx(180);
            secuencia([L], 30, (p) => latido(p, { pa: 0, sa: -0.3, rw: 1.7, ta: 0.14, tt: 21, tw: 5.5,
                extra: [[10, 6, -0.12]] })); // leve infradesnivel del ST
            break;
        }
        case 'afib': { // R-R irregularmente irregular, sin P, línea base fibrilatoria
            const ints = []; for (let i = 0; i < 60; i++) ints.push(62 + 62 * (0.5 + 0.5 * Math.sin(i * 2.399 + Math.sin(i * 1.7) * 2)));
            secuencia(ints, 60, (p) => latido(p, { pa: 0, ta: 0.14, tt: 34, tw: 8 }));
            extra = (x) => 0.055 * Math.sin(x * 0.47) + 0.045 * Math.sin(x * 0.91 + 1.3) + 0.03 * Math.sin(x * 1.63 + 0.4);
            break;
        }
        case 'aflutter': { // ondas F en "dientes de sierra", conducción 4:1
            const L = cicloPx(75);
            secuencia([L], 50, (p) => latido(p, { pa: 0, ta: 0, sa: -0.15 }));
            extra = (x) => {
                const f = (x % 30) / 30;
                return f < 0.85 ? 0.12 - 0.32 * (f / 0.85) : -0.20 + 0.32 * ((f - 0.85) / 0.15);
            };
            break;
        }
        case 'paced_a': { // spike de marcapasos -> P -> QRS normal
            const L = cicloPx(60);
            secuencia([L], 60, (p) => latido(p, { pr: 24, pa: 0.16, extra: [[-38, 0.7, 0.65], [-37, 0.7, -0.12]] }));
            break;
        }
        case 'wandering': { // P de morfología y PR variables
            const L = cicloPx(78);
            const pas = [0.16, 0.09, -0.06, 0.13, 0.05, -0.09];
            const prs = [28, 22, 15, 26, 18, 13];
            secuencia([L * 1.0, L * 0.94, L * 1.06, L * 0.97, L * 1.04, L], 50, (p, k) =>
                latido(p, { pa: pas[k % 6], pr: prs[k % 6] }));
            break;
        }

        // ---------- BLOQUEOS AV ----------
        case 'avb1': {
            const L = cicloPx(74);
            secuencia([L], 70, (p) => latido(p, { pr: 46, pa: 0.15 }));
            break;
        }
        case 'avb2_1': { // Wenckebach: PR se alarga hasta que una P no conduce
            const PP = 100, prs = [24, 38, 54, null];
            secuencia([PP], 40, (p, k) => {
                const pr = prs[k % 4];
                soloP(p);
                if (pr) latido(p + pr, { pa: 0 });
            });
            break;
        }
        case 'avb2_2': { // Mobitz II: PR constante, una P bloqueada de cada 3
            const PP = 95;
            secuencia([PP], 40, (p, k) => {
                soloP(p);
                if (k % 3 !== 2) latido(p + 30, { pa: 0, rw: 3, qa: -0.08, ta: 0.25 });
            });
            break;
        }
        case 'avb2_21': { // conducción 2:1 (P-P constante, una P sí y otra no)
            const PP = 118;
            secuencia([PP], 40, (p, k) => {
                soloP(p);
                if (k % 2 === 0) latido(p + 30, { pa: 0, rw: 3 });
            });
            break;
        }
        case 'avb3': { // disociación AV completa + escape ventricular ancho
            secuencia([75], 20, (p) => soloP(p));
            secuencia([cicloPx(36)], 100, (p) => latido(p, ANCHO));
            break;
        }

        // ---------- NODAL ----------
        case 'pjc': {
            const L = cicloPx(84);
            secuencia([L, L, L * 0.7, L * 1.3], 50, (p, k) => {
                if (k % 4 === 2) latido(p, { pa: 0, extra: [[15, 4, -0.10]] }); // P retrógrada tras QRS
                else latido(p);
            });
            break;
        }
        case 'j_rhythm': {
            const L = cicloPx(48);
            secuencia([L], 60, (p) => latido(p, { pa: 0, extra: [[14, 4, -0.10]] }));
            break;
        }
        case 'acc_junct': {
            const L = cicloPx(82);
            secuencia([L], 50, (p) => latido(p, { pa: -0.10, pr: 13, ps: 3.5 }));
            break;
        }
        case 'j_tach': {
            const L = cicloPx(186);
            secuencia([L], 30, (p) => latido(p, { pa: 0, rw: 1.6, ta: 0.14, tt: 19, tw: 5, extra: [[10, 4, -0.08]] }));
            break;
        }

        // ---------- VENTRICULAR ----------
        case 'pvc': {
            const L = cicloPx(68);
            secuencia([L, L, L * 0.6, L * 1.4], 50, (p, k) => {
                if (k % 4 === 2) latido(p, Object.assign({}, ANCHO, { ra: 1.25, rw: 7.5, ta: -0.5, tt: 56, tw: 14 }));
                else latido(p);
            });
            break;
        }
        case 'idiov': {
            secuencia([cicloPx(36)], 90, (p) => latido(p, Object.assign({}, ANCHO, { ra: 0.9, rw: 7, tt: 58, tw: 14 })));
            break;
        }
        case 'acc_idiov': {
            secuencia([cicloPx(84)], 60, (p) => latido(p, Object.assign({}, ANCHO, { ra: 0.9, rw: 6, tt: 46, tw: 11 })));
            break;
        }
        case 'vt_mono': { // QRS anchos monomorfos, casi sinusoidales
            const L = cicloPx(210);
            secuencia([L], 20, (p) => latido(p, { pa: 0, qa: 0, sa: 0, ta: 0, rw: 8, ra: 1.0,
                extra: [[L * 0.5, 8, -0.85]] }));
            break;
        }
        case 'vfib': { // caos sin QRS identificable
            extra = (x) => {
                const env = 0.55 + 0.45 * Math.sin(x * 0.011 + 1);
                return env * (0.45 * Math.sin(x * 0.12) + 0.35 * Math.cos(x * 0.25 + 0.6)
                    + 0.25 * Math.sin(x * 0.41 + 2.1) + 0.15 * Math.sin(x * 0.77));
            };
            break;
        }
        case 'paced_v': { // spike -> QRS ancho NEGATIVO -> T positiva (discordante)
            const L = cicloPx(80);
            secuencia([L], 60, (p) => latido(p, {
                pa: 0, qa: 0, sa: 0,
                ra: -1.0, rw: 5.5,                 // deflexión profunda HACIA ABAJO
                ta: 0.42, tt: 38, tw: 12,          // T positiva, ancha
                extra: [[-11, 0.7, 0.55], [-10, 0.6, -0.12]] // spike de marcapasos
            }));
            break;
        }

        // ---------- RITMO SINUSAL NORMAL ('sr') ----------
        default: {
            const L = cicloPx(72);
            secuencia([L], 50, (p) => latido(p));
        }
    }
    latidos.sort((a, b) => a.pos - b.pos);
    return { latidos, extra };
}

function calcularEcuacionOnda(x, tipo, height) {
    const scale = height * 0.35;
    if (!cacheRitmosECG[tipo]) cacheRitmosECG[tipo] = crearRitmo(tipo);
    const { latidos, extra } = cacheRitmosECG[tipo];

    let y = 0;
    for (let i = 0; i < latidos.length; i++) {
        const t = x - latidos[i].pos;
        if (t < -90) break;          // latidos ordenados: los siguientes quedan más lejos
        if (t > 110) continue;
        const c = latidos[i].comps;
        for (let j = 0; j < c.length; j++) y += gauss(t, c[j][0], c[j][1], c[j][2]);
    }
    if (extra) y += extra(x);

    // Limita para que nunca se salga del canvas (ni por arriba ni por abajo)
    y = Math.max(-1.35, Math.min(1.35, y));
    return y * scale;
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
        alert(`ℹ️ Índice de Dependencia de IA actual: ${indiceSesgoIA}%\n\n• Si confías excesivamente en la IA (2 o más aciertos continuos o >40% de dependencia), la IA comenzará a equivocarse a propósito.\n• Si realizas diagnósticos manuales durante 3 a 4 casos, la IA recobrará la lucidez.`);
    }
}

function cerrarModalInfoPatologias() {
    document.getElementById('modal-patologias-info').classList.add('hidden');
}

// ==================== CASOS CLÍNICOS NIVEL 3 (SVG AJUSTADOS A LA MORFOLOGÍA DEL PDF DE REFERENCIA) ====================
const CASOS_NIVEL3 = [
    {
        id: 1,
        paciente: "Paciente masculino de 68 años con palpitaciones, mareos y pulso irregularmente irregular.",
        patologia: "Atrial Fibrillallation",
        piezas: [
            { id: 0, label: "Inicio: Línea de base fibrilatoria (ondas f), sin QRS aún", hint: "Conector: Borde Izquierdo", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q8,17 16,22 Q24,17 32,21 Q40,16 48,23 Q56,17 64,20 Q72,18 80,22 Q88,17 96,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 1, label: "QRS irregular #1 sobre línea fibrilatoria", hint: "Conector: Empalme con línea fibrilatoria previa", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q8,17 16,21 L22,20 L26,7 L30,33 L34,20 Q42,18 50,22 Q58,17 66,20 Q74,18 82,21 Q90,17 96,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 2, label: "Pausa Inter-R-R irregular con QRS temprano", hint: "Conector: Salida de QRS anterior", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L6,20 L10,8 L14,32 L18,20 Q26,17 34,22 Q42,16 50,21 Q58,18 66,22 Q74,17 82,20 Q90,18 96,21 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 3, label: "QRS irregular #2 (cierre del ciclo)", hint: "Conector: Borde Derecho / Salida", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q8,18 16,21 Q24,17 32,20 Q40,18 48,22 L52,20 L56,8 L60,32 L64,20 Q72,17 80,21 Q88,18 96,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' }
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
        patologia: "Infarto Agudo de Miocardio (Supradesnivel ST)",
        piezas: [
            { id: 0, label: "Onda P y Segmento PR Isoeléctrico", hint: "Conector: Borde Izquierdo", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q15,12 30,20 L50,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 1, label: "Complejo QRS con ascenso agudo", hint: "Conector: Empalme PR", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 L20,20 L25,35 L30,0 L35,15 L100,15" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 2, label: "Elevación Supradesnivel del Segmento ST", hint: "Conector: Salida de QRS elevado", svg: '<svg viewBox="0 0 100 40"><path d="M0,15 L40,15 C60,15 70,30 100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 3, label: "Onda T Terminal / Retorno a línea de base", hint: "Conector: Borde Derecho / Final", svg: '<svg viewBox="0 0 100 40"><path d="M0,20 Q25,30 50,20 L100,20" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' }
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
        paciente: "Paciente masculino de 60 años con antecedente de miocardiopatía que presenta taquicardia sostenida de QRS ancho y presíncope.",
        patologia: "Ventricular tachycardia(VTach)",
        piezas: [
            { id: 0, label: "Inicio: Complejo Ancho Monomórfico #1", hint: "Conector: Borde Izquierdo", svg: '<svg viewBox="0 0 100 40"><path d="M0,30 Q15,-8 30,30 Q45,58 60,30 L100,30" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 1, label: "Ciclo Intermedio: Complejo Ancho Monomórfico #2", hint: "Conector: Continuidad #1-#2", svg: '<svg viewBox="0 0 100 40"><path d="M0,30 Q15,-8 30,30 Q45,58 60,30 L100,30" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 2, label: "Ciclo Intermedio: Complejo Ancho Monomórfico #3", hint: "Conector: Continuidad #2-#3", svg: '<svg viewBox="0 0 100 40"><path d="M0,30 Q15,-8 30,30 Q45,58 60,30 L100,30" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' },
            { id: 3, label: "Final del Trazado: Complejo Ancho Monomórfico #4", hint: "Conector: Borde Derecho / Final", svg: '<svg viewBox="0 0 100 40"><path d="M0,30 Q15,-8 30,30 Q45,58 60,30 L100,30" stroke="#00ff66" fill="none" stroke-width="2"/></svg>' }
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
