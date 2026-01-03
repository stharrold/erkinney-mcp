#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2025 stharrold
# SPDX-License-Identifier: Apache-2.0


import praw
from praw.exceptions import PRAWException


def register_wiki_tools(mcp, reddit: praw.Reddit):
    """Register wiki-related tools with the MCP server."""

    @mcp.tool()
    def read_wiki_page(subreddit_name: str, page_name: str = "index") -> dict:
        """
        Read a wiki page from a subreddit.

        Args:
            subreddit_name: Subreddit name.
            page_name: Name of the wiki page (default 'index').

        Returns:
            dict: Wiki page content and metadata or error.
        """
        try:
            subreddit = reddit.subreddit(subreddit_name)
            page = subreddit.wiki[page_name]
            return {
                "success": True,
                "subreddit": subreddit_name,
                "page": page_name,
                "content_md": page.content_md,
                "revision_by": page.revision_by.name if page.revision_by else None,
                "revision_date": page.revision_date,
            }
        except PRAWException as e:
            return {"success": False, "error": str(e), "error_type": e.__class__.__name__}
        except Exception as e:
            return {"success": False, "error": f"Failed to read wiki page: {e}"}

    @mcp.tool()
    def edit_wiki_page(
        subreddit_name: str, page_name: str, content: str, reason: str | None = None
    ) -> dict:
        """
        Edit a wiki page on a subreddit.

        Args:
            subreddit_name: Subreddit name.
            page_name: Name of the wiki page.
            content: New markdown content for the page.
            reason: Optional reason for the edit.

        Returns:
            dict: Success status or error.
        """
        try:
            subreddit = reddit.subreddit(subreddit_name)
            subreddit.wiki[page_name].edit(content=content, reason=reason)
            return {"success": True, "subreddit": subreddit_name, "page": page_name}
        except PRAWException as e:
            return {"success": False, "error": str(e), "error_type": e.__class__.__name__}

    @mcp.tool()
    def list_wiki_pages(subreddit_name: str) -> dict:
        """
        List all wiki pages in a subreddit.

        Args:
            subreddit_name: Subreddit name.

        Returns:
            dict: List of page names or error.
        """
        try:
            subreddit = reddit.subreddit(subreddit_name)
            pages = [page.name for page in subreddit.wiki]
            return {"success": True, "subreddit": subreddit_name, "pages": pages}
        except PRAWException as e:
            return {"success": False, "error": str(e), "error_type": e.__class__.__name__}
