#!/bin/bash
# Keychain credential management for Reddit MCP Bundle
# Stores Reddit API credentials securely in macOS Keychain

set -e

SERVICE_NAME="reddit-research-mcp"

function store_credential() {
    local key=$1
    local value=$2

    # Delete existing entry if present
    security delete-generic-password -s "$SERVICE_NAME" -a "$key" 2>/dev/null || true

    # Store new credential
    security add-generic-password -s "$SERVICE_NAME" -a "$key" -w "$value"
    echo "✓ Stored $key in Keychain"
}

function get_credential() {
    local key=$1
    security find-generic-password -s "$SERVICE_NAME" -a "$key" -w 2>/dev/null
}

function delete_all_credentials() {
    local keys=("REDDIT_CLIENT_ID" "REDDIT_CLIENT_SECRET" "REDDIT_USERNAME" "REDDIT_PASSWORD" "ANONYMIZATION_SALT")

    for key in "${keys[@]}"; do
        security delete-generic-password -s "$SERVICE_NAME" -a "$key" 2>/dev/null && echo "✓ Deleted $key" || true
    done
}

function setup_credentials() {
    echo "=== Reddit Research MCP - Keychain Setup ==="
    echo ""
    echo "This will store your Reddit API credentials securely in macOS Keychain."
    echo "Service name: $SERVICE_NAME"
    echo ""

    read -p "Reddit Client ID: " client_id
    store_credential "REDDIT_CLIENT_ID" "$client_id"

    read -sp "Reddit Client Secret: " client_secret
    echo ""
    store_credential "REDDIT_CLIENT_SECRET" "$client_secret"

    read -p "Reddit Username: " username
    store_credential "REDDIT_USERNAME" "$username"

    read -sp "Reddit Password: " password
    echo ""
    store_credential "REDDIT_PASSWORD" "$password"

    # Generate or prompt for salt
    echo ""
    read -p "Generate new anonymization salt? (y/n): " generate_salt
    if [[ "$generate_salt" =~ ^[Yy]$ ]]; then
        salt=$(openssl rand -hex 16)
        echo "Generated salt: $salt"
        store_credential "ANONYMIZATION_SALT" "$salt"
    else
        read -p "Anonymization Salt: " salt
        store_credential "ANONYMIZATION_SALT" "$salt"
    fi

    echo ""
    echo "=== ✓ Credentials stored successfully ==="
    echo ""
    echo "To load credentials into environment:"
    echo "  source scripts/load-env-from-keychain.sh"
    echo ""
    echo "To test retrieval:"
    echo "  ./scripts/keychain-setup.sh test"
}

function test_credentials() {
    echo "=== Testing Keychain Retrieval ==="
    echo ""

    local keys=("REDDIT_CLIENT_ID" "REDDIT_CLIENT_SECRET" "REDDIT_USERNAME" "REDDIT_PASSWORD" "ANONYMIZATION_SALT")

    for key in "${keys[@]}"; do
        value=$(get_credential "$key" 2>/dev/null || echo "NOT FOUND")
        if [ "$value" = "NOT FOUND" ]; then
            echo "✗ $key: NOT FOUND"
        else
            # Mask sensitive values
            if [[ "$key" =~ (SECRET|PASSWORD|SALT) ]]; then
                echo "✓ $key: [REDACTED - ${#value} characters]"
            else
                echo "✓ $key: $value"
            fi
        fi
    done
}

# Command handling
case "${1:-}" in
    setup)
        setup_credentials
        ;;
    test)
        test_credentials
        ;;
    delete)
        echo "=== Deleting all credentials from Keychain ==="
        delete_all_credentials
        echo "✓ Done"
        ;;
    get)
        if [ -z "$2" ]; then
            echo "Usage: $0 get KEY"
            exit 1
        fi
        get_credential "$2"
        ;;
    *)
        echo "Usage: $0 {setup|test|delete|get KEY}"
        echo ""
        echo "Commands:"
        echo "  setup   - Interactive setup to store credentials in Keychain"
        echo "  test    - Verify credentials can be retrieved"
        echo "  delete  - Remove all credentials from Keychain"
        echo "  get KEY - Retrieve specific credential"
        echo ""
        echo "Example:"
        echo "  ./scripts/keychain-setup.sh setup"
        echo "  ./scripts/keychain-setup.sh test"
        exit 1
        ;;
esac
