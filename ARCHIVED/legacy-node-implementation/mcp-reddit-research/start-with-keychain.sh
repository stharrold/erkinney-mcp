#!/bin/bash
# Start MCP server with credentials loaded from macOS Keychain
# Usage: ./start-with-keychain.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load credentials from Keychain
source "$SCRIPT_DIR/scripts/load-env-from-keychain.sh"

# Start MCP server
exec node "$SCRIPT_DIR/index.js"
