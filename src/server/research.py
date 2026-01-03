#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2025 stharrold
# SPDX-License-Identifier: Apache-2.0

from datetime import datetime

import praw

from .utils import anonymize_username, count_words


def register_research_tools(mcp, reddit: praw.Reddit):
    """Register research-focused tools with the MCP server."""

    @mcp.tool()
    def search_reddit_threads(
        medication_name: str,
        subreddits: list[str],
        start_date: str = "2019-01-01",
        end_date: str = "2023-12-31",
        min_comments: int = 5,
        min_words: int = 50,
        max_results: int = 100,
    ) -> dict:
        """
        Search for medication-related threads in pregnancy subreddits.

        Args:
            medication_name: Name of medication to search for.
            subreddits: List of subreddits to search (e.g., ["pregnant", "babybumps"]).
            start_date: Start date in YYYY-MM-DD format.
            end_date: End date in YYYY-MM-DD format.
            min_comments: Minimum number of comments required.
            min_words: Minimum word count in the post.
            max_results: Maximum number of threads to return.
        """
        # Parse dates
        start_ts = datetime.strptime(start_date, "%Y-%m-%d").timestamp()
        end_ts = datetime.strptime(end_date, "%Y-%m-%d").timestamp()

        query = f"{medication_name}"
        subreddit_str = "+".join(subreddits)

        threads = []
        # Search across specified subreddits
        # Fetch more than max_results to allow for filtering
        search_results = reddit.subreddit(subreddit_str).search(
            query, sort="relevance", time_filter="all", limit=max_results * 2
        )
        for submission in search_results:
            # Filtering
            if submission.created_utc < start_ts or submission.created_utc > end_ts:
                continue

            if submission.num_comments < min_comments:
                continue

            post_text = submission.selftext or submission.title
            if count_words(post_text) < min_words:
                continue

            # Additional check: medication name should be in text
            full_text = (submission.title + " " + submission.selftext).lower()
            if medication_name.lower() not in full_text:
                continue

            threads.append(
                {
                    "thread_id": submission.id,
                    "title": submission.title,
                    "subreddit": submission.subreddit.display_name,
                    "author": anonymize_username(submission.author.name)
                    if submission.author
                    else "[deleted]",
                    "created_utc": submission.created_utc,
                    "created_date": datetime.fromtimestamp(submission.created_utc).isoformat(),
                    "score": submission.score,
                    "num_comments": submission.num_comments,
                    "url": f"https://reddit.com{submission.permalink}",
                    "word_count": count_words(post_text),
                }
            )

            if len(threads) >= max_results:
                break

        return {"success": True, "count": len(threads), "threads": threads}

    @mcp.tool()
    def get_thread_details(thread_id: str, max_comments: int = 50, sort_by: str = "top") -> dict:
        """
        Retrieve full details of a Reddit thread including comments.

        Args:
            thread_id: The ID of the thread (e.g., 'abc123').
            max_comments: Maximum number of comments to retrieve.
            sort_by: Comment sort order ('top', 'new', 'controversial').
        """
        submission = reddit.submission(id=thread_id)

        # Set comment sort
        submission.comment_sort = sort_by

        # Load comments
        submission.comments.replace_more(limit=0)  # Only top-level or easy to reach comments

        comments = []
        for comment in submission.comments.list()[:max_comments]:
            comments.append(
                {
                    "comment_id": comment.id,
                    "author": anonymize_username(comment.author.name)
                    if comment.author
                    else "[deleted]",
                    "body": comment.body,
                    "score": comment.score,
                    "created_utc": comment.created_utc,
                    "created_date": datetime.fromtimestamp(comment.created_utc).isoformat(),
                }
            )

        return {
            "success": True,
            "thread": {
                "thread_id": submission.id,
                "title": submission.title,
                "subreddit": submission.subreddit.display_name,
                "author": anonymize_username(submission.author.name)
                if submission.author
                else "[deleted]",
                "selftext": submission.selftext,
                "score": submission.score,
                "created_utc": submission.created_utc,
                "url": f"https://reddit.com{submission.permalink}",
                "comments": comments,
            },
        }

    @mcp.tool()
    def get_subreddit_info(subreddit_name: str) -> dict:
        """
        Get metadata about a subreddit.

        Args:
            subreddit_name: Name of the subreddit (without r/).
        """
        subreddit = reddit.subreddit(subreddit_name)
        return {
            "name": subreddit.display_name,
            "title": subreddit.title,
            "description": subreddit.public_description,
            "subscribers": subreddit.subscribers,
            "created_utc": subreddit.created_utc,
            "rules": [rule.short_name for rule in subreddit.rules],
        }
