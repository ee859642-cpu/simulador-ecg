from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Motor ECG - IA y Sesgo de Automatización")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ESTADO_JUGADORES = {}

CASOS_CLINICOS = {
    1: {
        "paciente_id": "PAC-001",
        "edad": 56,
        "diagnostico_real": "Sinus Rhythm",
        "bpm": 72,
        "ritmo_clave": "Sinus Rhythm",
        "ia_prediccion": "Sinus Rhythm",
        "ia_confianza": 0.95,
        "es_trampa": False
    },
    2: {
        "paciente_id": "PAC-002",
        "edad": 19,
        "diagnostico_real": "Sinus Bradycardia",
        "bpm": 54,  # Ajustado a 54 BPM (Fisiología de Bradicardia Sinusal < 60 BPM)
        "ritmo_clave": "Sinus Bradycardia",
        "ia_prediccion": "Sinus Bradycardia",
        "ia_confianza": 0.88,
        "es_trampa": False
    },
    3: {
        "paciente_id": "PAC-003",
        "edad": 62,
        "diagnostico_real": "VFib",
        "bpm": 0,  # Fibrilación Ventricular: 0 BPM (Actividad caótica sin gasto cardiaco)
        "ritmo_clave": "VFib",
        "ia_prediccion": "Sinus Tachycardia",
        "ia_confianza": 0.98,
        "es_trampa": True,
        "advertencia": "¡Error crítico de IA! La IA diagnosticó Taquicardia Sinusal, pero el paciente estaba en Fibrilación Ventricular (0 BPM). Al confiar ciegamente caíste en el Sesgo de Automatización."
    }
}

@app.get("/")
def inicio():
    return {"mensaje": "Servidor activo."}

def obtener_perfil_jugador(jugador_id: str):
    if jugador_id not in ESTADO_JUGADORES:
        ESTADO_JUGADORES[jugador_id] = {
            "indice_dependencia": 0.0,
            "casos_resueltos": 0
        }
    return ESTADO_JUGADORES[jugador_id]

@app.get("/obtener_caso/{caso_id}")
def obtener_caso(caso_id: int):
    caso = CASOS_CLINICOS.get(caso_id, CASOS_CLINICOS[1])
    return {
        "paciente": caso["paciente_id"],
        "edad": caso["edad"],
        "frecuencia_cardiaca_bpm": caso["bpm"],
        "ritmo_patologia_real": caso["ritmo_clave"],
        "ia_sugerencia": caso["ia_prediccion"],
        "ia_confianza_porcentaje": int(caso["ia_confianza"] * 100),
        "es_caso_trampa": caso["es_trampa"]
    }

@app.post("/evaluar_decision/")
def evaluar_decision(jugador_id: str, caso_id: int, confia_en_ia: bool):
    perfil = obtener_perfil_jugador(jugador_id)
    caso = CASOS_CLINICOS.get(caso_id, CASOS_CLINICOS[1])
    
    perfil["casos_resueltos"] += 1

    if confia_en_ia and caso["es_trampa"]:
        perfil["indice_dependencia"] = min(1.0, perfil["indice_dependencia"] + 0.35)
        return {
            "resultado": "INCORRECTO",
            "mensaje": caso.get("advertencia"),
            "diagnostico_correcto": caso["diagnostico_real"],
            "indice_dependencia_acumulado": round(perfil["indice_dependencia"], 2)
        }

    elif not confia_en_ia and caso["es_trampa"]:
        perfil["indice_dependencia"] = max(0.0, perfil["indice_dependencia"] - 0.20)
        return {
            "resultado": "CORRECTO",
            "mensaje": "¡Excelente juicio clínico! Notaste que la onda era una Fibrilación Ventricular (0 BPM) y rechazaste la sugerencia errónea de la IA.",
            "diagnostico_correcto": caso["diagnostico_real"],
            "indice_dependencia_acumulado": round(perfil["indice_dependencia"], 2)
        }

    else:
        return {
            "resultado": "CORRECTO",
            "mensaje": "Diagnóstico y decisión acertados.",
            "diagnostico_correcto": caso["diagnostico_real"],
            "indice_dependencia_acumulado": round(perfil["indice_dependencia"], 2)
        }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)