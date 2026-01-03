# Erkinney MCP

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Python Version](https://img.shields.io/badge/python-3.11%2B-blue)](https://www.python.org/)

**A streamlined, research-focused chatbot for exploring pregnancy medication discussions on Reddit.**

This tool connects Google's Gemini 2.0 Flash model with Reddit data via the Model Context Protocol (MCP). It allows researchers to safely and efficiently query Reddit threads while maintaining strict IRB compliance (user anonymization, approved user-agents).

---

## 🚀 Installation & Usage

**Prerequisites:**
- **Python 3.11+** installed ([Download Python](https://www.python.org/downloads/))
- **Reddit API Credentials** (Client ID & Client Secret)
- **Google Gemini API Key**

### 🍎 macOS

1.  **Download** the repository (Code -> Download ZIP) and unzip it.
2.  Open **Terminal**.
3.  Navigate to the folder (e.g., `cd ~/Downloads/erkinney-mcp-main`).
4.  Run the launcher:
    ```bash
    ./start_mac.command
    ```
5.  The application will open in your browser. Enter your API keys in the sidebar to start chatting.

### 🪟 Windows

1.  **Download** the repository and unzip it.
2.  Double-click the **`start_windows.bat`** file.
3.  A command window will appear, install dependencies, and then launch the application in your browser.

---

## 🗑️ Uninstallation

To remove the application and all its dependencies from your system:

1.  **Delete the project folder**: Simply move the entire `erkinney-mcp` directory to the Trash/Recycle Bin.
2.  **That's it!** All dependencies are installed in a local `.venv` folder within the project, so deleting the folder cleans up everything. No global system files are modified.

---

## 🏗️ Architecture

This project uses a **single-tool architecture** to ensure simplicity and reliability.

- **Frontend (`src/client/`)**: A Streamlit-based chat interface. It handles user input, displays responses, and securely manages API credentials in memory (never saved to disk).
- **Backend (`src/server/`)**: A Python MCP server using `fastmcp`. It executes Reddit searches and ensures compliance rules (User-Agent strings) are enforced.
- **Launcher**: Platform-specific scripts (`start_mac.command`, `start_windows.bat`) that automate environment setup using `uv` (or `pip` fallback).

### Directory Structure

```
erkinney-mcp/
├── src/
│   ├── client/          # Streamlit UI & Gemini Bridge
│   └── server/          # MCP Server & Reddit Tools
├── docs/
│   ├── reddit-application/ # Reddit API application artifacts
│   └── references/         # Policy PDFs and reference docs
├── start_mac.command    # macOS Launcher
├── start_windows.bat    # Windows Launcher
├── pyproject.toml       # Project configuration & dependencies
└── ARCHIVED/            # Legacy Node.js implementation (reference only)
```

---

## 🛡️ Security & Compliance

- **Zero Persistence**: API keys are injected directly into the server process environment variables at runtime. They are **never** written to config files or disk.
- **Compliance**: The Reddit tool hardcodes the User-Agent to `ResearchBot/1.0 (IRB Approved)` to strictly adhere to platform usage agreements.
- **Privacy**: The application is designed for qualitative analysis of public data, adhering to AoIR Ethics 3.0 guidelines.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our workflow.

**Development Setup:**
1.  Clone the repository.
2.  Install [uv](https://github.com/astral-sh/uv) (recommended).
3.  Run `uv sync` to install dependencies.
4.  Run the app: `uv run streamlit run src/client/app.py`.

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
