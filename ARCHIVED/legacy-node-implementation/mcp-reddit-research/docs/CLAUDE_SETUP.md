# Claude Desktop Setup Guide

Complete guide for configuring Claude Desktop to use the Reddit Research MCP Bundle.

---

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Reddit Research MCP Bundle installed (`npm install` completed)
- ✅ Reddit API credentials configured in `.env`
- ✅ Claude Desktop installed

---

## Step-by-Step Setup

### Step 1: Locate Your Project Directory

Find the **absolute path** to your `mcp-reddit-research` directory:

```bash
cd /path/to/mcp-reddit-research
pwd
```

Copy the full path that is displayed. You'll need this for the configuration.

**Example paths**:
- macOS: `/Users/yourname/Documents/mcp-reddit-research`
- Windows: `C:\Users\yourname\Documents\mcp-reddit-research`
- Linux: `/home/yourname/mcp-reddit-research`

---

### Step 2: Locate Claude Desktop Config File

The config file location depends on your operating system:

**macOS**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux**:
```
~/.config/Claude/claude_desktop_config.json
```

---

### Step 3: Edit Configuration File

#### Option A: Create New Config (If File Doesn't Exist)

Create the file with this content:

```json
{
  "mcpServers": {
    "reddit-research": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-reddit-research/index.js"]
    }
  }
}
```

#### Option B: Add to Existing Config

If you already have other MCP servers configured, add the `reddit-research` entry:

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": ["..."]
    },
    "reddit-research": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-reddit-research/index.js"]
    }
  }
}
```

**Important**:
- Replace `/absolute/path/to/` with your actual path from Step 1
- Use forward slashes `/` even on Windows in the JSON
- Path must be absolute, not relative
- No trailing slash at the end

---

### Step 4: Verify Configuration Syntax

**Check JSON is valid**:
- No missing commas
- No trailing commas
- Matching quotes and brackets
- Proper escaping of backslashes (if any)

**Use a JSON validator** if unsure:
- https://jsonlint.com/
- Or use your text editor's JSON validation

---

### Step 5: Restart Claude Desktop

1. **Completely close** Claude Desktop (not just minimize)
   - macOS: Cmd+Q or Claude menu → Quit
   - Windows: Right-click taskbar icon → Exit
   - Linux: File → Quit

2. **Reopen** Claude Desktop

---

### Step 6: Verify Installation

In Claude Desktop, try this test query:

> Get information about the pregnant subreddit

If Claude uses the `get_subreddit_info` tool and returns subreddit details, **installation successful**! ✅

---

## Configuration Examples

### macOS Example

```json
{
  "mcpServers": {
    "reddit-research": {
      "command": "node",
      "args": ["/Users/johndoe/Documents/mcp-reddit-research/index.js"]
    }
  }
}
```

### Windows Example

```json
{
  "mcpServers": {
    "reddit-research": {
      "command": "node",
      "args": ["C:/Users/johndoe/Documents/mcp-reddit-research/index.js"]
    }
  }
}
```

**Note**: Use forward slashes `/` in JSON even on Windows.

### Linux Example

```json
{
  "mcpServers": {
    "reddit-research": {
      "command": "node",
      "args": ["/home/johndoe/mcp-reddit-research/index.js"]
    }
  }
}
```

---

## Troubleshooting

### "Tool not found" or No Tools Appear

**Possible causes**:

1. **Path is incorrect**
   - Verify path is absolute (starts with `/` on Unix, `C:/` on Windows)
   - Check for typos in the path
   - Ensure `index.js` is at the end
   - Test path: `ls /your/path/index.js` (Unix) or `dir C:\your\path\index.js` (Windows)

2. **Node.js not in PATH**
   - Test: `node --version`
   - If not found, add Node.js to PATH or use full path to node binary

3. **Configuration syntax error**
   - Validate JSON at https://jsonlint.com/
   - Check for missing/extra commas
   - Ensure all quotes match

4. **Claude Desktop not restarted**
   - Must fully quit and reopen (not just close window)

### Authentication Errors

**Error**: "Reddit authentication failed"

**Solutions**:
1. Check `.env` file is in `mcp-reddit-research/` directory
2. Verify Reddit credentials are correct
3. Test auth manually:
   ```bash
   cd mcp-reddit-research
   node -e "import('./src/auth.js').then(m => m.createRedditClient()).then(() => console.log('✓ Success')).catch(e => console.error('✗ Error:', e.message))"
   ```

### Rate Limiting

**Error**: "Reddit API rate limit reached"

**Explanation**: Reddit limits to 60 requests/minute

**Solutions**:
- Tool handles this automatically with backoff
- Wait a moment before retrying
- For large batch searches, expect delays between medications

### "Cannot connect to Reddit"

**Possible causes**:
1. No internet connection
2. Reddit.com is down (check https://www.redditstatus.com/)
3. Firewall blocking connection

**Solutions**:
- Check internet connection
- Try accessing reddit.com in browser
- Check firewall settings

---

## Advanced Configuration

### Environment Variables

Pass environment variables to the MCP server:

```json
{
  "mcpServers": {
    "reddit-research": {
      "command": "node",
      "args": ["/path/to/index.js"],
      "env": {
        "REDDIT_CLIENT_SECRET": "your_secret_here",
        "ANONYMIZATION_SALT": "custom-salt-2025"
      }
    }
  }
}
```

**Note**: This is an alternative to using `.env` file. `.env` file is recommended for security.

### Custom Node Path

If `node` is not in PATH, specify full path:

```json
{
  "mcpServers": {
    "reddit-research": {
      "command": "/usr/local/bin/node",
      "args": ["/path/to/index.js"]
    }
  }
}
```

---

## Verifying Tools Are Available

After successful setup, Claude Desktop should have access to these tools:

1. **search_reddit_threads** - Search medication discussions
2. **get_thread_details** - Get full thread content
3. **batch_search_medications** - Batch search multiple medications
4. **export_research_data** - Export to JSON/CSV
5. **get_subreddit_info** - Get subreddit information

Test by asking Claude:

> What tools do you have available for Reddit research?

Claude should list all 5 tools.

---

## Getting Help

If you encounter issues:

1. **Check logs**:
   - Look for error messages in Claude Desktop
   - Check Node.js console output

2. **Verify each step**:
   - Node.js installed: `node --version`
   - Dependencies installed: `ls node_modules`
   - Auth configured: `cat .env`
   - Config file syntax: Validate JSON

3. **Contact support**:
   - Research questions: emkinney@iu.edu
   - Technical issues: samuel.harrold@gmail.com

---

## Next Steps

Once setup is complete:

1. **Review [examples/](../examples/)** - See example workflows
2. **Read [PRIVACY.md](../PRIVACY.md)** - Understand privacy protection
3. **Consult [docs/API.md](API.md)** - Complete API reference
4. **Start researching** - Try the quick start examples

---

**Version**: 1.0.0
**Last Updated**: 2025-11-20
