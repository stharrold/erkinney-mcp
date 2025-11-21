# Encrypted Credential Storage with macOS Keychain

This document describes how to securely store Reddit API credentials using macOS Keychain encryption.

## Why Use Keychain?

- **Encrypted Storage**: Credentials encrypted at rest using macOS security infrastructure
- **System Integration**: Uses native macOS Keychain Access app
- **No Plain-Text Files**: Avoids storing secrets in `.env` files
- **Centralized Management**: One place to manage credentials across development and production
- **Secure Access Control**: Requires authentication to access credentials

## Quick Start

### 1. Store Credentials in Keychain

```bash
# Interactive setup
./scripts/keychain-setup.sh setup
```

This will prompt you for:
- Reddit Client ID
- Reddit Client Secret
- Reddit Username
- Reddit Password
- Anonymization Salt (auto-generated or manual)

### 2. Verify Storage

```bash
# Test retrieval (shows redacted values)
./scripts/keychain-setup.sh test
```

Output:
```
=== Testing Keychain Retrieval ===

✓ REDDIT_CLIENT_ID: your_client_id_here
✓ REDDIT_CLIENT_SECRET: [REDACTED - 32 characters]
✓ REDDIT_USERNAME: your_username
✓ REDDIT_PASSWORD: [REDACTED - 16 characters]
✓ ANONYMIZATION_SALT: [REDACTED - 32 characters]
```

### 3. Use Credentials

**Option A: Load into environment for bash scripts**
```bash
source scripts/load-env-from-keychain.sh
npm test
```

**Option B: Load in Node.js code**
```javascript
import { loadCredentialsFromKeychain } from './scripts/keychain-helper.js';

// Load credentials before creating Reddit client
loadCredentialsFromKeychain();

// Now process.env.REDDIT_CLIENT_ID etc. are available
```

**Option C: Manual retrieval**
```bash
# Get specific credential
./scripts/keychain-setup.sh get REDDIT_CLIENT_ID

# Or from Node.js
node scripts/keychain-helper.js get REDDIT_CLIENT_ID
```

## Using with MCP Server

Update your Claude Desktop config to load from Keychain:

**Option 1: Shell wrapper (recommended)**

Create `mcp-bundle-reddit-research/start-with-keychain.sh`:
```bash
#!/bin/bash
source "$(dirname "$0")/scripts/load-env-from-keychain.sh"
exec node "$(dirname "$0")/index.js"
```

Then in `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "reddit-research": {
      "command": "/absolute/path/to/mcp-bundle-reddit-research/start-with-keychain.sh"
    }
  }
}
```

**Option 2: Load in index.js**

Add to top of `index.js`:
```javascript
import { loadCredentialsFromKeychain } from './scripts/keychain-helper.js';

// Load credentials from Keychain if .env not present
if (!process.env.REDDIT_CLIENT_ID) {
  loadCredentialsFromKeychain();
}
```

## Security Considerations

### Keychain Access Control

- First access will prompt for macOS password
- Can be configured to require password every time or allow app access
- Credentials stored in user's login keychain (encrypted on disk)

### Viewing Credentials

```bash
# View in Keychain Access app
open -a "Keychain Access"

# Search for: "reddit-research-mcp"
```

### Revoking Access

```bash
# Delete all credentials
./scripts/keychain-setup.sh delete
```

## Comparison: Keychain vs .env File

| Feature | Keychain | .env File |
|---------|----------|-----------|
| Encryption | ✅ Yes (system-level) | ❌ Plain text |
| Gitignored | ✅ Not in repo | ⚠️ Must remember to ignore |
| Centralized | ✅ System-wide | ❌ Per-project |
| Backup | ✅ With system backup | ❌ Manual |
| Access Control | ✅ OS-level | ❌ File permissions only |
| Rotation | ✅ Easy (re-run setup) | ⚠️ Edit file |
| Audit Trail | ✅ System logs | ❌ None |

## Advanced Usage

### Environment-Specific Credentials

Use different service names for different environments:

```bash
# Development
SERVICE_NAME="reddit-research-mcp-dev" ./scripts/keychain-setup.sh setup

# Production
SERVICE_NAME="reddit-research-mcp-prod" ./scripts/keychain-setup.sh setup
```

### Credential Rotation

```bash
# Update single credential
security delete-generic-password -s "reddit-research-mcp" -a "REDDIT_PASSWORD"
security add-generic-password -s "reddit-research-mcp" -a "REDDIT_PASSWORD" -w "new_password"

# Or re-run setup to update all
./scripts/keychain-setup.sh setup
```

### Scripting Access

```bash
# Get credential in shell script
CLIENT_ID=$(./scripts/keychain-setup.sh get REDDIT_CLIENT_ID)

# Get credential in Node.js
import { getKeychainCredential } from './scripts/keychain-helper.js';
const clientId = getKeychainCredential('REDDIT_CLIENT_ID');
```

## Troubleshooting

### "Password required" prompt appears repeatedly

```bash
# Allow app permanent access
security set-generic-password-partition-list \
  -s "reddit-research-mcp" \
  -a "REDDIT_CLIENT_ID" \
  -S
```

### Credentials not found

```bash
# Verify they're stored
./scripts/keychain-setup.sh test

# If missing, re-run setup
./scripts/keychain-setup.sh setup
```

### Permission denied

```bash
# Ensure scripts are executable
chmod +x scripts/*.sh scripts/*.js
```

## Migration from .env to Keychain

```bash
# 1. Load current .env values
source .env

# 2. Store in Keychain (paste values when prompted)
./scripts/keychain-setup.sh setup

# 3. Test retrieval
./scripts/keychain-setup.sh test

# 4. Backup and remove .env
mv .env .env.backup
```

## Cross-Platform Alternatives

For non-macOS systems, consider:

- **Linux**: `libsecret` or `pass` (password-store)
- **Windows**: Windows Credential Manager (`cmdkey`)
- **Cross-platform**: Node.js `keytar` package

Example with `keytar`:
```bash
npm install keytar
```

```javascript
import keytar from 'keytar';

// Store
await keytar.setPassword('reddit-research-mcp', 'REDDIT_CLIENT_ID', 'value');

// Retrieve
const clientId = await keytar.getPassword('reddit-research-mcp', 'REDDIT_CLIENT_ID');
```
