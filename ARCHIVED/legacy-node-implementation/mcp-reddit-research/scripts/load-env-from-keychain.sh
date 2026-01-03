#!/bin/bash
# Load Reddit API credentials from macOS Keychain into environment
# Usage: source scripts/load-env-from-keychain.sh

SERVICE_NAME="reddit-research-mcp"

function get_credential() {
    local key=$1
    security find-generic-password -s "$SERVICE_NAME" -a "$key" -w 2>/dev/null
}

# Export credentials as environment variables
export REDDIT_CLIENT_ID=$(get_credential "REDDIT_CLIENT_ID")
export REDDIT_CLIENT_SECRET=$(get_credential "REDDIT_CLIENT_SECRET")
export REDDIT_USERNAME=$(get_credential "REDDIT_USERNAME")
export REDDIT_PASSWORD=$(get_credential "REDDIT_PASSWORD")
export REDDIT_USER_AGENT="${REDDIT_USER_AGENT:-MPRINT-Research:v1.0.0}"
export ANONYMIZATION_SALT=$(get_credential "ANONYMIZATION_SALT")

# Verify all required variables are set
if [ -z "$REDDIT_CLIENT_ID" ] || [ -z "$REDDIT_CLIENT_SECRET" ] || \
   [ -z "$REDDIT_USERNAME" ] || [ -z "$REDDIT_PASSWORD" ] || \
   [ -z "$ANONYMIZATION_SALT" ]; then
    echo "ERROR: Some credentials missing from Keychain" >&2
    echo "Run: ./scripts/keychain-setup.sh setup" >&2
    return 1
fi

echo "✓ Loaded credentials from Keychain" >&2
