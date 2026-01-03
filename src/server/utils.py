#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2025 stharrold
# SPDX-License-Identifier: Apache-2.0

import hashlib
import os

# Unique salt for this study to prevent cross-platform correlation
# In production, this should be set via environment variable
STUDY_SALT = os.environ.get("STUDY_SALT", "erkinney-mcp-2025-default-salt")


def anonymize_username(username: str) -> str:
    """
    Anonymize a Reddit username using SHA-256 hashing with a study-specific salt.

    Args:
        username: The original Reddit username.

    Returns:
        A hexadecimal string representation of the hash.
    """
    if not username:
        return "[deleted]"

    if username in ["[deleted]", "[removed]"]:
        return username

    # Combine username with salt and hash
    salted_username = f"{username}:{STUDY_SALT}"
    hash_object = hashlib.sha256(salted_username.encode("utf-8"))

    # Return first 12 characters for readability while maintaining collision resistance
    return hash_object.hexdigest()[:12]


def count_words(text: str) -> int:
    """Count words in a string."""
    if not text:
        return 0
    return len(text.split())
