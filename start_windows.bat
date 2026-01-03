@echo off
REM start_windows.bat
echo === Reddit Research Gemini Setup ===

REM Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.11+.
    pause
    exit /b 1
)

REM Install Dependencies using uv (if installed) or pip
echo [INFO] Installing requirements...
if exist uv.lock (
    uv sync
) else (
    pip install .
)

REM Launch Streamlit
echo [INFO] Launching UI...
uv run streamlit run src/client/app.py

pause