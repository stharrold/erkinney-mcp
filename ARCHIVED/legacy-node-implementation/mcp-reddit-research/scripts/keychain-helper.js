#!/usr/bin/env node
/**
 * Keychain Helper for Node.js
 * Retrieves credentials from macOS Keychain for use in Node.js applications
 */

import { execSync } from 'child_process';

const SERVICE_NAME = 'reddit-research-mcp';

/**
 * Get credential from macOS Keychain
 * @param {string} key - Credential key
 * @returns {string|null} Credential value or null if not found
 */
export function getKeychainCredential(key) {
  try {
    const value = execSync(
      `security find-generic-password -s "${SERVICE_NAME}" -a "${key}" -w`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    return value;
  } catch (error) {
    return null;
  }
}

/**
 * Load all Reddit credentials from Keychain into process.env
 */
export function loadCredentialsFromKeychain() {
  const keys = [
    'REDDIT_CLIENT_ID',
    'REDDIT_CLIENT_SECRET',
    'REDDIT_USERNAME',
    'REDDIT_PASSWORD',
    'ANONYMIZATION_SALT'
  ];

  const credentials = {};
  const missing = [];

  for (const key of keys) {
    const value = getKeychainCredential(key);
    if (value) {
      credentials[key] = value;
      process.env[key] = value;
    } else {
      missing.push(key);
    }
  }

  // Set default user agent if not set
  if (!process.env.REDDIT_USER_AGENT) {
    process.env.REDDIT_USER_AGENT = 'MPRINT-Research:v1.0.0';
  }

  if (missing.length > 0) {
    console.error('ERROR: Missing credentials from Keychain:', missing.join(', '));
    console.error('Run: ./scripts/keychain-setup.sh setup');
    return false;
  }

  console.error('✓ Loaded credentials from Keychain');
  return true;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];

  if (command === 'get' && process.argv[3]) {
    const value = getKeychainCredential(process.argv[3]);
    if (value) {
      console.log(value);
      process.exit(0);
    } else {
      console.error(`Credential not found: ${process.argv[3]}`);
      process.exit(1);
    }
  } else if (command === 'load') {
    const success = loadCredentialsFromKeychain();
    process.exit(success ? 0 : 1);
  } else {
    console.log('Usage:');
    console.log('  node scripts/keychain-helper.js get KEY    - Get specific credential');
    console.log('  node scripts/keychain-helper.js load       - Load all credentials');
    console.log('');
    console.log('Example:');
    console.log('  node scripts/keychain-helper.js get REDDIT_CLIENT_ID');
    process.exit(1);
  }
}
