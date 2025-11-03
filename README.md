# Guía para Levantar Proyecto de Reconocimiento de Señales en VS Code

## Identificación de Señas

### Requisitos previos

- **Python 3.x:** Instalar Python (se recomienda Python 3.8 o superior). Por ejemplo, puede crearse un entorno virtual con:
  ```bash
  python -m venv venv
  .\venv\Scripts\activate
  ```

- **Git:** Para clonar el repositorio (por ejemplo Git para Windows).

- **Bibliotecas Python:** OpenCV (paquete `opencv-python`), NumPy (`numpy`), y otras según el proyecto (por ejemplo `mediapipe`, `matplotlib`, etc.). Se instalan fácilmente con `pip`, por ejemplo:
  ```bash
  pip install opencv-python
  pip install numpy
  ```

- **Visual Studio Code (VSCode):** Editor de código en Windows (se recomienda Windows 10 o 11).

---

### Extensiones recomendadas de VSCode

- **Python (Microsoft):** Extensión oficial para desarrollo en Python. Soporta IntelliSense, depuración y notebooks Jupyter. Instale la extensión **"Python"** de Microsoft (`ms-python.python`).
- **Jupyter:** Si hay cuadernos (`.ipynb`), instale la extensión de Jupyter (`ms-toolsai.jupyter`) para ejecutarlos en VSCode.
- **Pylance (opcional):** Motor de análisis de código Python.

---

### Clonar el repositorio

1. Abra VSCode o una terminal y ejecute:
   ```bash
   git clone https://github.com/ErnestoJuarez2708/Identificaci-n-de-Se-as-.git
   ```

2. Vaya a la carpeta clonada:
   ```bash
   cd Identificaci-n-de-Se-as-
   ```

3. Abra esta carpeta en VSCode (`File > Open Folder`) o con la terminal:
   ```bash
   code .
   ```

---

### Instalar dependencias

- Si existe un archivo `requirements.txt`, instale todo con:
  ```bash
  pip install -r requirements.txt
  ```

- En caso contrario, instale manualmente las librerías necesarias:
  ```bash
  pip install --upgrade pip           # (actualiza pip)
  pip install opencv-python numpy mediapipe matplotlib
  ```

(Opcional) Crear y activar un entorno virtual ayuda a aislar dependencias:
```bash
python -m venv venv
.\venv\Scripts\activate
```

---

### Ejecutar el proyecto

- **Script principal:** Ubique el archivo Python principal (por ejemplo `main.py` o similar) y ejecútelo con Python:
  ```bash
  python main.py
  ```
  También puede presionar **F5** en VSCode para depuración.

- **Cuadernos Jupyter:** Si hay archivos `.ipynb`, ábralos en VSCode usando la extensión Jupyter y ejecute las celdas interactivamente.

- **Webcam/datos:** Algunos proyectos de señales usan la cámara; asegúrese de tenerla conectada si se requiere captura en tiempo real.

---

### Notas adicionales y problemas comunes

- **Ambiente virtual:** Asegúrese de activar el entorno virtual cada vez (`.\venv\Scripts\activate`) y de que VSCode use ese intérprete de Python (seleccionándolo en la esquina inferior derecha).

- **Errores con OpenCV (`cv2`):** Si al importar OpenCV ocurre un error `DLL load failed`, instale el **Visual C++ 2015 Redistributable** en Windows. En ediciones **Windows N/KN** puede ser necesario también el **Windows Media Feature Pack**.

- **pip/Python:** Si la consola no reconoce `pip`, use:
  ```bash
  python -m pip install <paquete>
  ```
  También se recomienda tener pip actualizado:
  ```bash
  pip install --upgrade pip
  ```

- **Otros errores comunes:** Verifique que las versiones de Python y librerías sean compatibles con el código. Revise mensajes de error en la terminal; errores como “module not found” indican librerías faltantes, que deben instalarse con `pip`.

---

### Referencias

- Instalación de OpenCV: `pip install opencv-python`
- Instalación de NumPy: `pip install numpy`
- Extensión Python de VSCode: soporte para Jupyter y depuración.
- Instalación de Visual C++ Redistributable en Windows para compatibilidad con OpenCV.
