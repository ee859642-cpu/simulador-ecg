// URL base de la API FastAPI
const API_URL = "https://simulador-ecg.onrender.com";
// Identificador del usuario/estudiante
const JUGADOR_ID = "medico_estudiante_1";

// Estado local de la aplicación
let casoActualId = 1;
let canvas, ctx;
let animacionId = null;
let offsetOnda = 0;

// Configuración de electrodos requeridos
const ELECTRODOS_REQUERIDOS = ["V1", "V2", "V3", "V4", "V5", "V6"];
let electrodosColocados = new Set();

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("ecg-canvas");
    if (canvas) {
        ctx = canvas.getContext("2d");
        ajustarTamanoCanvas();
        window.addEventListener("resize", ajustarTamanoCanvas);
    }

    inicializarDragAndDrop();
    escucharEventos();
});

function ajustarTamanoCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}

// Configuración del arrastre y colocación de electrodos
function inicializarDragAndDrop() {
    const electrodos = document.querySelectorAll(".electrodo");
    const zonasDrop = document.querySelectorAll(".zona-drop");

    electrodos.forEach(el => {
        // Asegurar que sea arrastrable por HTML5
        el.setAttribute("draggable", "true");

        el.addEventListener("dragstart", (e) => {
            const lead = e.target.dataset.lead || e.target.innerText.trim();
            e.dataTransfer.setData("text/plain", lead);
        });

        // Opción alternativa: soporte por clic para facilitar el uso
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
            
            if (zona.dataset.lead === lead || zona.innerText.includes(lead)) {
                colocarElectrodo(lead);
            }
        });

        zona.addEventListener("click", () => {
            const lead = zona.dataset.lead;
            if (lead) colocarElectrodo(lead);
        });
    });
}

function colocarElectrodo(lead) {
    if (!ELECTRODOS_REQUERIDOS.includes(lead)) return;

    const zona = document.querySelector(`.zona-drop[data-lead="${lead}"]`);
    const elOrigen = document.querySelector(`.electrodo[data-lead="${lead}"]`);

    if (zona) {
        zona.classList.add("ocupada");
        zona.innerText = `✓ ${lead}`;
    }

    if (elOrigen) {
        elOrigen.style.visibility = "hidden";
    }

    electrodosColocados.add(lead);
    verificarElectrodosCompletos();
}

function verificarElectrodosCompletos() {
    if (electrodosColocados.size === ELECTRODOS_REQUERIDOS.length) {
        const btnCargar = document.getElementById("btn-cargar-paciente");
        if (btnCargar) btnCargar.disabled = false;
    }
}

function escucharEventos() {
    const btnCargar = document.getElementById("btn-cargar-paciente");
    const btnConfiar = document.getElementById("btn-confiar-ia");
    const btnCuestionar = document.getElementById("btn-cuestionar-ia");

    if (btnCargar) btnCargar.addEventListener("click", cargarSiguienteCaso);
    if (btnConfiar) btnConfiar.addEventListener("click", () => tomarDecision(true));
    if (btnCuestionar) btnCuestionar.addEventListener("click", () => tomarDecision(false));
}

// Carga de datos desde la API
async function cargarSiguienteCaso() {
    try {
        const respuesta = await fetch(`${API_URL}/obtener_caso/${casoActualId}`);
        if (!respuesta.ok) throw new Error("Error al conectar con la API");

        const datos = await respuesta.json();
        actualizarInterfaz(datos);

        // Rotar entre los 3 casos base
        casoActualId = (casoActualId % 3) + 1;
    } catch (error) {
        console.error("Error cargando paciente:", error);
        alert("No se pudo conectar con el servidor backend (FastAPI). Revisa que esté en ejecución.");
    }
}

// Actualización de los componentes de pantalla
function actualizarInterfaz(datos) {
    const elId = document.getElementById("paciente-id");
    const elEdad = document.getElementById("paciente-edad");
    const elBpm = document.getElementById("bpm-display");
    const elIaPred = document.getElementById("ia-prediccion");
    const elIaConf = document.getElementById("ia-confianza");
    const btnConfiar = document.getElementById("btn-confiar-ia");
    const btnCuestionar = document.getElementById("btn-cuestionar-ia");

    if (elId) elId.innerText = `ID: ${datos.paciente}`;
    if (elEdad) elEdad.innerText = `Edad: ${datos.edad} años`;
    if (elBpm) elBpm.innerText = `BPM: ${datos.frecuencia_cardiaca_bpm}`;
    if (elIaPred) elIaPred.innerText = datos.ia_sugerencia;
    if (elIaConf) elIaConf.innerText = `Confianza: ${datos.ia_confianza_porcentaje}%`;

    if (btnConfiar) btnConfiar.disabled = false;
    if (btnCuestionar) btnCuestionar.disabled = false;

    // Renderizar trazado ECG según la patología
    iniciarTrazadoECG(datos.ritmo_patologia_real);
}

// Renderizado del Canvas para el Monitor ECG
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

            } else if (ritmo === "Sinus Bradycardia") {
                let posBrad = (x + offsetOnda) % 260;
                if (posBrad > 20 && posBrad < 40) y -= Math.sin((posBrad - 20) * Math.PI / 20) * 7;
                else if (posBrad >= 55 && posBrad < 60) y += 5;
                else if (posBrad >= 60 && posBrad < 70) y -= 50;
                else if (posBrad >= 70 && posBrad < 75) y += 10;
                else if (posBrad > 100 && posBrad < 140) y -= Math.sin((posBrad - 100) * Math.PI / 40) * 12;

            } else if (ritmo === "VFib") {
                let ruido1 = Math.sin((x + offsetOnda) * 0.1) * 22;
                let ruido2 = Math.cos((x * 0.3) + offsetOnda) * 15;
                let ruido3 = (Math.random() - 0.5) * 18;
                y = yBase + ruido1 + ruido2 + ruido3;
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

// Evaluación de la decisión tomada
async function tomarDecision(confiaEnIa) {
    const casoEvaluado = (casoActualId === 1) ? 3 : casoActualId - 1;

    try {
        const respuesta = await fetch(`${API_URL}/evaluar_decision/?jugador_id=${JUGADOR_ID}&caso_id=${casoEvaluado}&confia_en_ia=${confiaEnIa}`, {
            method: "POST"
        });

        const resultado = await respuesta.json();
        
        const elDep = document.getElementById("dependencia-porcentaje");
        if (elDep) elDep.innerText = `${Math.round(resultado.indice_dependencia_acumulado * 100)}%`;

        mostrarModalResultado(resultado);

    } catch (error) {
        console.error("Error evaluando decisión:", error);
    }
}

// Modal personalizado de retroalimentación
function mostrarModalResultado(res) {
    const modal = document.getElementById("modal-resultado");
    const titulo = document.getElementById("modal-titulo");
    const estadoBadge = document.getElementById("modal-estado");
    const mensaje = document.getElementById("modal-mensaje");
    const diagReal = document.getElementById("modal-diagnostico-real");
    const impacto = document.getElementById("modal-impacto");

    if (!modal) return;

    if (res.resultado === "CORRECTO") {
        if (estadoBadge) {
            estadoBadge.innerText = "CORRECTO";
            estadoBadge.className = "modal-badge badge-exito";
        }
        if (titulo) titulo.innerText = "¡Diagnóstico Correcto!";
    } else {
        if (estadoBadge) {
            estadoBadge.innerText = "INCORRECTO";
            estadoBadge.className = "modal-badge badge-error";
        }
        if (titulo) titulo.innerText = "¡Error Clínico Detectado!";
    }

    if (mensaje) mensaje.innerText = res.mensaje;
    if (diagReal) diagReal.innerText = res.diagnostico_correcto;
    if (impacto) impacto.innerText = `${Math.round(res.indice_dependencia_acumulado * 100)}%`;

    modal.classList.remove("oculto");

    const btnCerrar = document.getElementById("btn-cerrar-modal");
    if (btnCerrar) {
        btnCerrar.onclick = () => {
            modal.classList.add("oculto");
        };
    }
}
