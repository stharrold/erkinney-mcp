#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2025 stharrold
# SPDX-License-Identifier: Apache-2.0

import os

import praw
from mcp.server.fastmcp import FastMCP

from src.server.actions import register_action_tools

# Import modular tools
from src.server.research import register_research_tools
from src.server.wiki import register_wiki_tools


def create_server() -> FastMCP:
    """Initialize and configure the FastMCP server."""

    # 1. Environment Validation
    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    user_agent = os.environ.get("REDDIT_USER_AGENT", "ResearchBot/1.0 (IRB Approved)")

    if not client_id or not client_secret:
        raise RuntimeError("CRITICAL ERROR: REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET must be set.")

    # 2. Optional Account Credentials (for moderation/posting)
    username = os.environ.get("REDDIT_USERNAME")
    password = os.environ.get("REDDIT_PASSWORD")

    # 3. Initialize PRAW
    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent=user_agent,
        username=username,
        password=password,
    )

    # Verify authentication
    try:
        if reddit.read_only:
            print(f"Reddit Server started in READ-ONLY mode (User-Agent: {user_agent})")
        else:
            me = reddit.user.me()
            print(
                f"Reddit Server started in AUTHENTICATED mode as u/{me} (User-Agent: {user_agent})"
            )
    except Exception as e:
        print(f"Warning: Could not verify Reddit authentication: {e}")

    # 4. Initialize MCP Server
    mcp = FastMCP("erkinney-reddit-app")

    # 5. Register Tools
    register_research_tools(mcp, reddit)
    register_action_tools(mcp, reddit)
    register_wiki_tools(mcp, reddit)

    return mcp


# Create the server instance
mcp = create_server()

if __name__ == "__main__":
    mcp.run()
