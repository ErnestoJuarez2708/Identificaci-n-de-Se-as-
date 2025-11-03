# 🧠 Proyecto de Reconocimiento de Lengua de Señas (ASL)

Este proyecto implementa un sistema de **reconocimiento de señas del alfabeto en ASL (American Sign Language)** mediante un modelo de visión artificial en **Python** y una interfaz web desarrollada en **React + TypeScript + TailwindCSS**.

---

## 📁 Estructura del Proyecto

📂 Proyecto-ASL/
│
├── frontend/
│ └── asl_agent/ # Aplicación web (React + TS + Tailwind)
│
├── gold_dataset/ # Datos de referencia (para validación o ejemplos)
│
├── api.py # API principal (servidor Flask / FastAPI)
├── agent.py # Lógica del agente de predicción
├── tools.py # Utilidades del modelo
├── asl_model.h5 # Modelo entrenado (Keras / TensorFlow)
│
├── pyproject.toml # Configuración del entorno uv
├── uv.lock # Lockfile del entorno uv
├── .gitignore
├── .python-version
└── README.md

---

## ⚙️ Requisitos Previos

Asegúrate de tener instalados:

- **Python 3.10+**
- **uv** (gestor de entornos ultrarrápido)  
  👉 Instálalo con:
  ```bash
  pip install uv
Node.js 18+

Git

Visual Studio Code (recomendado)

🐍 Configuración del Backend (API)
Instalar dependencias con uv

Desde la raíz del proyecto:

uv sync

Esto instalará automáticamente todas las dependencias definidas en pyproject.toml.

Ejecutar la API

uv run python api.py

Si la API inicia correctamente, verás algo como:

* Running on http://127.0.0.1:5000

⚠️ Deja esta terminal abierta, ya que el frontend se comunicará con este backend.

💻 Configuración del Frontend
Moverte al directorio del frontend

cd frontend/asl_agent

Instalar dependencias

npm install

Levantar el entorno de desarrollo

npm run dev
Esto iniciará el servidor local, normalmente en:

http://localhost:5173
Verificar conexión con la API

En el archivo de configuración del frontend (por ejemplo .env o src/config.ts), asegúrate de tener la URL correcta:

VITE_API_URL=http://127.0.0.1:5000
🧠 Flujo del Sistema

El frontend captura o carga una imagen de una seña.

Envía la imagen a la API (api.py) mediante una petición HTTP.

La API usa el modelo (asl_model.h5) junto con utilidades en agent.py y tools.py para predecir la letra.

Devuelve un JSON con la predicción, la confianza y el feedback generado:

json
Copiar código
{
  "pred_letter": "W",
  "confidence": 0.6975,
  "feedback": "Asegúrate de extender el dedo anular..."
}
El frontend muestra estos datos de manera visual y ordenada.
