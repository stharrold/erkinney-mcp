#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2025 stharrold
# SPDX-License-Identifier: Apache-2.0

from src.server.utils import anonymize_username, count_words

def test_anonymize_username():
    username = "testuser"
    anon1 = anonymize_username(username)
    anon2 = anonymize_username(username)
    
    assert anon1 == anon2
    assert len(anon1) == 12
    assert anon1 != username

def test_anonymize_deleted():
    assert anonymize_username("[deleted]") == "[deleted]"
    assert anonymize_username(None) == "[deleted]"

def test_count_words():
    assert count_words("Hello world") == 2
    assert count_words("") == 0
    assert count_words("  multiple   spaces  ") == 2
