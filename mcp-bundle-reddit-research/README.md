# Reddit Research MCP Bundle

**MCP bundle for pregnancy medication research on Reddit**

A production-ready Model Context Protocol (MCP) server that enables medical researchers to systematically collect and analyze discussions about pregnancy medications from Reddit, with built-in privacy protection and ethical safeguards.

---

## 🎯 Purpose

This tool enables academic health communication researchers to:
- **Collect** medication discussions from pregnancy-related subreddits
- **Analyze** patient experiences with medications during pregnancy
- **Export** data in research-ready formats (JSON/CSV)
- **Protect** participant privacy through SHA-256 anonymization
- **Comply** with AoIR Ethics 3.0 and IRB requirements

**Target Users**: Medical professors, physician-scientists, and health communication researchers (limited technical knowledge assumed).

---

## ✨ Features

### 5 Research Tools

1. **search_reddit_threads** - Search for medication discussions
2. **get_thread_details** - Retrieve full thread content with comments
3. **batch_search_medications** - Search multiple medications efficiently
4. **export_research_data** - Export to JSON/CSV with metadata
5. **get_subreddit_info** - Get subreddit context and rules

### Privacy & Ethics

- ✅ **SHA-256 Anonymization** - All usernames hashed by default
- ✅ **AoIR Ethics 3.0 Compliant** - Follows established ethical framework
- ✅ **Public Data Only** - No private messages or restricted content
- ✅ **IRB-Friendly** - Designed to facilitate IRB approval
- ✅ **Transparent Methodology** - Reproducible research methods

### Technical Features

- 🚀 **Rate Limiting** - Respects Reddit's 60 req/min limit
- ⚡ **Caching** - LRU cache reduces redundant API calls
- 🔄 **Automatic Retry** - Exponential backoff on errors
- 📊 **Progress Reporting** - Clear feedback during data collection
- 🎓 **User-Friendly Errors** - Non-technical error messages

---

## 📋 Prerequisites

Before installation, ensure you have:

1. **Node.js** (version 18 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **Claude Desktop** (for using the MCP server)
   - Download: https://claude.ai/download

3. **Reddit API Credentials** (free)
   - Create account: https://www.reddit.com/
   - Create app: https://www.reddit.com/prefs/apps
   - Choose "script" type application

---

## 🚀 Installation

### Step 1: Download or Clone Repository

```bash
# Option A: Clone from GitHub
git clone https://github.com/stharrold/erkinney-mcp.git
cd erkinney-mcp/mcp-bundle-reddit-research

# Option B: Download ZIP and extract
# Then navigate to the extracted directory
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `snoowrap` - Reddit API client
- `dotenv` - Environment variable management

### Step 3: Configure Reddit API Credentials

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your credentials:
   ```bash
   nano .env
   # or use your preferred text editor
   ```

3. **Fill in your Reddit credentials**:
   ```
   REDDIT_CLIENT_ID=your_client_id_here
   REDDIT_CLIENT_SECRET=your_client_secret_here
   REDDIT_USERNAME=your_reddit_username
   REDDIT_PASSWORD=your_reddit_password
   REDDIT_USER_AGENT=MPRINT-Research:v1.0.0
   ```

   **Where to find these values**:
   - Go to: https://www.reddit.com/prefs/apps
   - Click "create another app..." or "create app"
   - Name: `MPRINT Research` (or your study name)
   - Type: **script**
   - Redirect URI: `http://localhost:8080` (not used but required)
   - Click "create app"
   - **Client ID**: The string under "personal use script"
   - **Client Secret**: Click "edit" to reveal

### Step 4: Test Installation

Test that everything works:

```bash
# Test Reddit authentication
node -e "import('./src/auth.js').then(m => m.createRedditClient()).then(() => console.log('✓ Authentication successful')).catch(e => console.error('✗ Error:', e.message))"
```

If successful, you'll see: `✓ Authentication successful`

---

## 🔧 Claude Desktop Setup

### macOS Configuration

1. **Edit Claude Desktop config**:
   ```bash
   nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Add this configuration**:
   ```json
   {
     "mcpServers": {
       "reddit-research": {
         "command": "node",
         "args": ["/absolute/path/to/mcp-bundle-reddit-research/index.js"]
       }
     }
   }
   ```

   **Important**: Replace `/absolute/path/to/` with the actual full path on your system.

   **Find the path**:
   ```bash
   cd mcp-bundle-reddit-research
   pwd
   # Copy this full path
   ```

### Windows Configuration

1. **Edit Claude Desktop config**:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **Add this configuration** (same as macOS, with Windows path format):
   ```json
   {
     "mcpServers": {
       "reddit-research": {
         "command": "node",
         "args": ["C:\\Users\\YourName\\path\\to\\mcp-bundle-reddit-research\\index.js"]
       }
     }
   }
   ```

### Linux Configuration

1. **Edit Claude Desktop config**:
   ```bash
   nano ~/.config/Claude/claude_desktop_config.json
   ```

2. **Add configuration** (same as macOS).

### Restart Claude Desktop

Close and reopen Claude Desktop for changes to take effect.

---

## 📖 Quick Start

### Example 1: Search for Ondansetron Discussions

In Claude Desktop, ask:

> Search for discussions about ondansetron in the pregnant subreddit from 2021 to 2023

Claude will use the `search_reddit_threads` tool:

```json
{
  "medication_name": "ondansetron",
  "subreddits": ["pregnant"],
  "start_date": "2021-01-01",
  "end_date": "2023-12-31",
  "min_comments": 5,
  "max_results": 100
}
```

### Example 2: Get Full Thread Content

> Get the full content of thread abc123 including all comments

Claude will use `get_thread_details`:

```json
{
  "thread_id": "abc123",
  "include_comments": true,
  "max_comments": 50,
  "sort_by": "top"
}
```

### Example 3: Batch Search Multiple Medications

> Search for discussions about ondansetron, amoxicillin, and levothyroxine in pregnant and BabyBumps subreddits

Claude will use `batch_search_medications`:

```json
{
  "medications": ["ondansetron", "amoxicillin", "levothyroxine"],
  "subreddits": ["pregnant", "BabyBumps"],
  "start_date": "2019-01-01",
  "end_date": "2023-12-31",
  "threads_per_medication": 20
}
```

### Example 4: Export Data

> Export threads abc123, def456, ghi789 to CSV format

Claude will use `export_research_data`:

```json
{
  "thread_ids": ["abc123", "def456", "ghi789"],
  "format": "csv",
  "anonymize": true,
  "include_metadata": true
}
```

Files are saved to the `exports/` directory.

---

## 🛠️ Tool Reference

### 1. search_reddit_threads

**Purpose**: Search for medication-related threads

**Parameters**:
- `medication_name` (required) - Medication to search for
- `subreddits` (required) - Array of subreddit names
- `start_date` - Start date YYYY-MM-DD (default: 2019-01-01)
- `end_date` - End date YYYY-MM-DD (default: 2023-12-31)
- `min_comments` - Minimum comments (default: 5)
- `min_words` - Minimum word count (default: 50)
- `max_results` - Maximum results (default: 100)

**Returns**: Array of thread objects with anonymized authors

### 2. get_thread_details

**Purpose**: Get full content of a specific thread

**Parameters**:
- `thread_id` (required) - Reddit thread ID
- `include_comments` - Include comments (default: true)
- `max_comments` - Max comments to retrieve (default: 50)
- `sort_by` - Sort order: 'top', 'best', 'new' (default: 'top')

**Returns**: Thread object with post and comments

### 3. batch_search_medications

**Purpose**: Search multiple medications efficiently

**Parameters**:
- `medications` (required) - Array of medication names
- `subreddits` (required) - Array of subreddit names
- `start_date` - Start date YYYY-MM-DD
- `end_date` - End date YYYY-MM-DD
- `threads_per_medication` - Target threads per medication (default: 20)

**Returns**: Results organized by medication

### 4. export_research_data

**Purpose**: Export data to JSON or CSV

**Parameters**:
- `thread_ids` (required) - Array of thread IDs
- `format` (required) - 'json' or 'csv'
- `anonymize` - Enable anonymization (default: true)
- `include_metadata` - Include metadata (default: true)
- `include_comments` - Include comments (default: false)

**Returns**: File path and export statistics

### 5. get_subreddit_info

**Purpose**: Get subreddit information

**Parameters**:
- `subreddit_name` (required) - Subreddit name (without r/)

**Returns**: Subscribers, description, rules, metadata

---

## 📚 Resources

The MCP server provides pre-configured resources:

### Medication Templates

Access via: `resource://medication-templates`

Pre-configured searches for common medication classes:
- Antibiotics (amoxicillin, azithromycin, etc.)
- Anti-nausea (ondansetron, zofran, etc.)
- Thyroid medications (levothyroxine, synthroid)
- Antidepressants (sertraline, fluoxetine, etc.)
- Pain relief (acetaminophen, ibuprofen)
- Allergy medications (cetirizine, loratadine)
- And more...

### Ethics Guidelines

Access via: `resource://ethics-guidelines`

AoIR Ethics 3.0 guidelines and compliance checklist.

---

## 🔒 Privacy & Ethics

**See [PRIVACY.md](PRIVACY.md) for complete details.**

### Key Privacy Features

- **SHA-256 Anonymization**: All usernames hashed automatically
- **No Original Usernames**: Never stored, logged, or exported
- **Public Data Only**: No private messages or restricted content
- **Transparent Methodology**: Documented for reproducibility

### Ethical Framework

This tool follows **AoIR Ethics 3.0** principles:
- Public data collection only
- Privacy protection through anonymization
- Respect for community norms
- Transparent methodology
- Minimize potential harms

### IRB Compliance

Designed to facilitate IRB approval:
- Clear ethical framework
- Built-in anonymization
- No human subjects interaction
- Documented methodology
- Public data only

**Consult your IRB** early in the research planning process.

---

## 🐛 Troubleshooting

### "Authentication failed"

**Problem**: Reddit credentials incorrect or missing

**Solution**:
1. Check `.env` file exists
2. Verify credentials at https://www.reddit.com/prefs/apps
3. Ensure no extra spaces in `.env` values
4. Test with: `node -e "import('./src/auth.js').then(m => m.createRedditClient())"`

### "Tool not found"

**Problem**: Claude Desktop can't find the MCP server

**Solution**:
1. Check `claude_desktop_config.json` has correct path
2. Path must be absolute (not relative)
3. Restart Claude Desktop after config changes
4. Verify Node.js is in PATH: `node --version`

### "Rate limit reached"

**Problem**: Too many requests to Reddit API

**Solution**:
- Tool automatically handles rate limiting
- Wait a moment before retrying
- Batch searches add delays between medications

### "No threads found"

**Problem**: Search returned no results

**Solution**:
- Try different search terms
- Expand date range
- Lower `min_comments` or `min_words`
- Check subreddit names (use "pregnant", not "r/pregnant")

### "Cannot connect to Reddit"

**Problem**: Network or API issues

**Solution**:
- Check internet connection
- Verify Reddit.com is accessible
- Tool will retry automatically with exponential backoff

---

## 📊 Data Output Formats

### JSON Export

Structured format with metadata:

```json
{
  "threads": [
    {
      "thread_id": "abc123",
      "title": "Taking ondansetron - experiences?",
      "subreddit": "pregnant",
      "author": "a7b3c9d2",
      "created_date": "2023-05-15T14:30:00Z",
      "score": 25,
      "num_comments": 18,
      "selftext": "...",
      "comments": [...]
    }
  ],
  "metadata": {
    "export_date": "2025-11-20T17:00:00Z",
    "total_threads": 1,
    "anonymization": {
      "method": "SHA-256",
      "hash_length": 8
    }
  }
}
```

### CSV Export

Flattened format for Excel/SPSS:

```csv
thread_id,subreddit,title,author_hash,created_date,score,num_comments,word_count,url
abc123,pregnant,"Taking ondansetron...",a7b3c9d2,2023-05-15T14:30:00Z,25,18,156,https://...
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Watch Mode (Development)

```bash
npm run test:watch
```

---

## 🤝 Contributing

This is a research tool developed for the MPRINT study. For questions:

- **Research**: emkinney@iu.edu
- **Technical**: samuel.harrold@gmail.com

---

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details.

---

## 📖 Documentation

- **[PRIVACY.md](PRIVACY.md)** - Privacy protection and ethical guidelines
- **[docs/API.md](docs/API.md)** - Complete API reference
- **[docs/CLAUDE_SETUP.md](docs/CLAUDE_SETUP.md)** - Claude Desktop setup guide
- **[examples/](examples/)** - Example workflows

---

## 🎓 Citation

If you use this tool in your research, please cite:

```
Reddit Research MCP Bundle (2025)
GitHub: https://github.com/stharrold/erkinney-mcp
Contacts: emkinney@iu.edu, samuel.harrold@gmail.com
```

---

## 🌟 Acknowledgments

**Developed for**: MPRINT (Medications and Pregnancy Information) Study
**Institution**: Indiana University
**Framework**: AoIR Ethics 3.0
**Protocol**: Model Context Protocol (MCP) by Anthropic

---

**Version**: 1.0.0
**Last Updated**: 2025-11-20
