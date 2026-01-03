#!/bin/bash
# start_mac.command

# Set working directory to the script's folder
cd "$(dirname "$0")"

echo "=== Reddit Research Gemini Setup ==="

# Check for Python
if ! command -v python3 &> /dev/null
then
    echo "[ERROR] python3 could not be found. Please install Python 3.11+."
    exit 1
fi

# Install Dependencies
echo "[INFO] Installing requirements..."
if command -v uv &> /dev/null; then
    uv sync
else
    echo "[WARN] uv not found. Installing via pip..."
    pip install .
fi

# Launch Streamlit
echo "[INFO] Launching UI..."
if command -v uv &> /dev/null; then
    uv run streamlit run src/client/app.py
else
    streamlit run src/client/app.py
fi