#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2025 stharrold
# SPDX-License-Identifier: Apache-2.0


import praw


def register_action_tools(mcp, reddit: praw.Reddit):
    """Register interaction and moderation tools with the MCP server."""

    # --- MODERATION TOOLS ---

    @mcp.tool()
    def moderate_user(
        subreddit_name: str,
        username: str,
        action: str,
        reason: str | None = None,
        note: str | None = None,
        duration: int | None = None,
    ) -> dict:
        """
        Perform moderation actions on a user (ban, unban, approve, invite).

        Args:
            subreddit_name: The subreddit where the action is performed.
            username: The Reddit username.
            action: Action to perform ('ban', 'unban', 'approve', 'invite_moderator', etc).
            reason: Reason for the action (visible to user).
            note: Internal moderator note.
            duration: Duration of ban in days (None for permanent).
        """
        subreddit = reddit.subreddit(subreddit_name)
        if action == "ban":
            subreddit.mod.ban(username, ban_reason=reason, ban_message=note, duration=duration)
        elif action == "unban":
            subreddit.mod.unban(username)
        elif action == "approve":
            subreddit.mod.contributor.add(username)
        elif action == "invite_moderator":
            subreddit.moderator.add(username, note=note)
        elif action == "remove_moderator":
            subreddit.moderator.remove(username)
        else:
            return {"success": False, "error": f"Unknown action: {action}"}

        return {"success": True, "action": action, "user": username}

    @mcp.tool()
    def moderate_content(
        content_id: str, action: str, reason: str | None = None, is_comment: bool = False
    ) -> dict:
        """
        Perform moderation actions on a post or comment.

        Args:
            content_id: The ID of the post or comment.
            action: Action ('approve', 'remove', 'spam', 'lock', 'unlock', etc).
            reason: Optional reason for removal.
            is_comment: True if the content_id refers to a comment.
        """
        content = reddit.comment(content_id) if is_comment else reddit.submission(content_id)

        if action == "approve":
            content.mod.approve()
        elif action == "remove":
            content.mod.remove(mod_note=reason)
        elif action == "spam":
            content.mod.remove(spam=True)
        elif action == "lock":
            content.mod.lock()
        elif action == "unlock":
            content.mod.unlock()
        elif action == "distinguish":
            content.mod.distinguish()
        elif action == "undistinguish":
            content.mod.distinguish(how="no")
        else:
            return {"success": False, "error": f"Unknown action: {action}"}

        return {"success": True, "action": action, "id": content_id}

    @mcp.tool()
    def get_moderation_log(
        subreddit_name: str, limit: int = 25, mod_name: str | None = None, action: str | None = None
    ) -> dict:
        """
        Retrieve the moderation log for a subreddit.

        Args:
            subreddit_name: Subreddit name.
            limit: Number of entries to retrieve.
            mod_name: Filter by moderator username.
            action: Filter by action type (e.g., 'banuser', 'removelink').
        """
        subreddit = reddit.subreddit(subreddit_name)
        log = []
        for entry in subreddit.mod.log(limit=limit, mod=mod_name, action=action):
            log.append(
                {
                    "action": entry.action,
                    "mod": entry.mod.name if entry.mod else "unknown",
                    "target_author": entry.target_author,
                    "target_title": entry.target_title,
                    "created_utc": entry.created_utc,
                    "details": entry.details,
                }
            )
        return {"success": True, "log": log}

    # --- INTERACTION TOOLS ---

    @mcp.tool()
    def submit_content(
        subreddit_name: str,
        title: str,
        text: str | None = None,
        url: str | None = None,
        flair_id: str | None = None,
    ) -> dict:
        """
        Submit a new post to a subreddit.

        Args:
            subreddit_name: Subreddit name.
            title: Title of the post.
            text: Body text (for self-posts).
            url: URL (for link-posts).
            flair_id: Optional flair template ID.
        """
        subreddit = reddit.subreddit(subreddit_name)
        submission = subreddit.submit(title, selftext=text, url=url, flair_id=flair_id)
        return {"success": True, "id": submission.id, "url": submission.url}

    @mcp.tool()
    def interact_with_content(
        content_id: str, action: str, is_comment: bool = False, text: str | None = None
    ) -> dict:
        """
        Vote, save, reply, or edit content.

        Args:
            content_id: Post or comment ID.
            action: Action ('upvote', 'downvote', 'save', 'reply', 'edit', etc).
            is_comment: True if ID is a comment.
            text: Body text for reply or edit.
        """
        content = reddit.comment(content_id) if is_comment else reddit.submission(content_id)

        if action == "upvote":
            content.upvote()
        elif action == "downvote":
            content.downvote()
        elif action == "clear_vote":
            content.clear_vote()
        elif action == "save":
            content.save()
        elif action == "unsave":
            content.unsave()
        elif action == "reply":
            if not text:
                return {"success": False, "error": "Text required for reply"}
            reply = content.reply(text)
            return {"success": True, "action": action, "reply_id": reply.id}
        elif action == "edit":
            if not text:
                return {"success": False, "error": "Text required for edit"}
            content.edit(text)
        elif action == "delete":
            content.delete()
        else:
            return {"success": False, "error": f"Unknown action: {action}"}

        return {"success": True, "action": action, "id": content_id}

    @mcp.tool()
    def manage_inbox(
        action: str,
        message_id: str | None = None,
        username: str | None = None,
        subject: str | None = None,
        body: str | None = None,
    ) -> dict:
        """
        Read or send private messages.

        Args:
            action: Action ('list_unread', 'list_inbox', 'send', 'read').
            message_id: Message ID for 'read'.
            username: Recipient username for 'send'.
            subject: Message subject for 'send'.
            body: Message body for 'send'.
        """
        if action == "list_unread":
            messages = []
            for msg in reddit.inbox.unread(limit=25):
                messages.append(
                    {
                        "id": msg.id,
                        "author": msg.author.name if msg.author else None,
                        "subject": msg.subject,
                        "body": msg.body,
                    }
                )
            return {"success": True, "messages": messages}
        elif action == "send":
            if not (username and subject and body):
                return {"success": False, "error": "Recipient, subject, and body required"}
            reddit.redditor(username).message(subject, body)
            return {"success": True, "action": "sent"}
        # ... more actions could be added
        return {"success": False, "error": f"Action {action} not fully implemented"}

    @mcp.tool()
    def gild_content(content_id: str, is_comment: bool = False) -> dict:
        """
        Gild a post or comment (spend Reddit Gold).

        Args:
            content_id: Post or comment ID.
            is_comment: True if ID is a comment.
        """
        content = reddit.comment(content_id) if is_comment else reddit.submission(content_id)
        content.gild()
        return {"success": True, "action": "gilded", "id": content_id}

    @mcp.tool()
    def get_subreddit_traffic(subreddit_name: str) -> dict:
        """
        Get traffic statistics for a subreddit (requires moderator permissions).

        Args:
            subreddit_name: Subreddit name.
        """
        subreddit = reddit.subreddit(subreddit_name)
        traffic = subreddit.traffic()
        return {"success": True, "subreddit": subreddit_name, "traffic": traffic}

    @mcp.tool()
    def manage_modmail(
        subreddit_name: str, action: str, conversation_id: str | None = None
    ) -> dict:
        """
        Read or respond to Modmail (requires moderator permissions).

        Args:
            subreddit_name: Subreddit name.
            action: Action ('list', 'read').
            conversation_id: Modmail conversation ID.
        """
        subreddit = reddit.subreddit(subreddit_name)
        if action == "list":
            conversations = []
            for conv in subreddit.modmail.conversations(limit=25):
                conversations.append(
                    {"id": conv.id, "subject": conv.subject, "last_updated": conv.last_updated}
                )
            return {"success": True, "conversations": conversations}
        elif action == "read" and conversation_id:
            conv = subreddit.modmail(conversation_id)
            return {"success": True, "conversation": {"id": conv.id, "subject": conv.subject}}
        return {"success": False, "error": f"Action {action} or ID missing"}

    @mcp.tool()
    def manage_subscriptions(subreddit_name: str, action: str) -> dict:
        """
        Subscribe or unsubscribe from a subreddit.

        Args:
            subreddit_name: Subreddit name.
            action: Action ('subscribe', 'unsubscribe').
        """
        subreddit = reddit.subreddit(subreddit_name)
        if action == "subscribe":
            subreddit.subscribe()
        elif action == "unsubscribe":
            subreddit.unsubscribe()
        else:
            return {"success": False, "error": f"Unknown action: {action}"}
        return {"success": True, "subreddit": subreddit_name, "action": action}

    @mcp.tool()
    def get_my_identity() -> dict:
        """Get information about the authenticated Reddit account."""
        me = reddit.user.me()
        return {
            "name": me.name,
            "id": me.id,
            "created_utc": me.created_utc,
            "link_karma": me.link_karma,
            "comment_karma": me.comment_karma,
            "has_mail": me.has_mail,
            "is_mod": me.is_mod,
        }
