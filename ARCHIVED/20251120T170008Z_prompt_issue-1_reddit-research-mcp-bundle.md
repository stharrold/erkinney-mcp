---
type: implementation-prompt
issue: 1
issue_url: https://github.com/stharrold/erkinney-mcp/issues/1
title: "Build Reddit Research MCP Bundle for Pregnancy Medication Study"
created: 2025-11-20T17:00:08Z
target_audience: claude-code
skill_required: mcp-builder
repository: erkinney-mcp
priority: high
labels: [enhancement, mcp-bundle, research-tools]
milestone: "MPRINT Research Tools v1.0"
contacts:
  researcher: emkinney@iu.edu
  developer: samuel.harrold@gmail.com
---

# Implementation Prompt: Reddit Research MCP Bundle for MPRINT Study

## Executive Summary

You are tasked with implementing a production-ready MCP (Model Context Protocol) bundle for academic health communication research. This tool will enable medical researchers to systematically collect and analyze discussions about pregnancy medications from Reddit, with built-in privacy protection and ethical safeguards.

**Critical Context**: This is a **pre-IRB prototype** for qualitative research. The implementation must prioritize privacy, ethics, and usability for non-technical medical researchers.

## Your Mission

Create a complete, production-ready MCP server that:
1. Connects to Reddit's API via OAuth 2.0
2. Provides 5 specialized research tools for data collection
3. Implements bulletproof privacy protection (SHA-256 anonymization)
4. Includes comprehensive error handling for non-technical users
5. Follows MCP best practices and protocol specifications
6. Includes full documentation, tests, and examples

## Prerequisites

Before starting implementation, you must:

1. **Read the MCP Builder Skill documentation** (if available in `.claude/skills/mcp-builder/`)
   - Understand MCP protocol structure
   - Review tool definition best practices
   - Study authentication patterns
   - Learn resource/prompt patterns

2. **Review GitHub Issue #1**: https://github.com/stharrold/erkinney-mcp/issues/1
   - Full technical specifications
   - All required parameters
   - Data schemas
   - Success criteria

3. **Understand the Research Context**:
   - **Purpose**: Qualitative thematic analysis of pregnancy medication discussions
   - **Target**: 100+ Reddit threads from pregnancy subreddits
   - **Methods**: Braun & Clarke (2019) framework, PRISMA-ScR guidelines
   - **Ethics**: AoIR Ethics 3.0, pre-IRB prototype phase
   - **Users**: Medical professors and physician-scientists (limited technical knowledge)

## Implementation Roadmap

### Phase 1: Project Setup and Authentication (Priority: Critical)

**Objective**: Create project structure and implement secure Reddit OAuth 2.0 authentication.

**Tasks**:

1. **Initialize Project Structure**
   ```bash
   mkdir -p mcp-bundle-reddit-research/{examples,tests,docs}
   cd mcp-bundle-reddit-research
   npm init -y
   ```

2. **Install Dependencies**
   ```json
   {
     "dependencies": {
       "@modelcontextprotocol/sdk": "latest",
       "snoowrap": "^1.23.0",
       "dotenv": "^16.0.0"
     },
     "devDependencies": {
       "jest": "^29.0.0",
       "@types/node": "^20.0.0"
     }
   }
   ```

3. **Create Authentication Module** (`src/auth.js`)
   - Implement OAuth 2.0 flow using snoowrap
   - Load credentials from environment variables
   - Handle authentication errors gracefully
   - Provide clear error messages for users

   **Configuration**:
   - Client ID: `fqQ4iQYlnbANGjaEbltSvA`
   - Client Secret: `process.env.REDDIT_CLIENT_SECRET`
   - User Agent: `MPRINT-Research:v1.0.0`
   - OAuth Scope: `read` (read-only)

4. **Create `.env.example`**
   ```
   REDDIT_CLIENT_SECRET=your_secret_here
   ```

**Error Handling Requirements**:
- Invalid credentials → "Authentication failed. Please check your REDDIT_CLIENT_SECRET in .env"
- Network errors → "Cannot connect to Reddit. Please check your internet connection"
- Expired tokens → "Session expired. Restarting Claude Desktop will refresh authentication"

**Testing**:
- Write test for successful authentication
- Write test for failed authentication with invalid credentials
- Write test for missing environment variables

---

### Phase 2: Core Data Collection Tools (Priority: Critical)

**Objective**: Implement the 5 required MCP tools for Reddit data collection.

#### Tool 1: search_reddit_threads

**Purpose**: Search for medication-related threads in specified subreddits with filtering.

**MCP Tool Definition**:
```javascript
{
  name: "search_reddit_threads",
  description: "Search for medication-related threads in pregnancy subreddits. Returns thread metadata with anonymized authors.",
  inputSchema: {
    type: "object",
    properties: {
      medication_name: {
        type: "string",
        description: "Name of medication to search for (e.g., 'ondansetron', 'amoxicillin')"
      },
      subreddits: {
        type: "array",
        items: { type: "string" },
        description: "Target subreddits (e.g., ['pregnant', 'BabyBumps'])"
      },
      start_date: {
        type: "string",
        description: "Start date YYYY-MM-DD (default: 2019-01-01)"
      },
      end_date: {
        type: "string",
        description: "End date YYYY-MM-DD (default: 2023-12-31)"
      },
      min_comments: {
        type: "integer",
        description: "Minimum comment count (default: 5)"
      },
      min_words: {
        type: "integer",
        description: "Minimum word count in post (default: 50)"
      },
      max_results: {
        type: "integer",
        description: "Maximum threads to return (default: 100)"
      }
    },
    required: ["medication_name", "subreddits"]
  }
}
```

**Implementation Requirements** (`src/tools/search.js`):
1. Use Reddit search API with proper query construction
2. Filter by date range (convert YYYY-MM-DD to Unix timestamps)
3. Filter by minimum comments and word count
4. Anonymize author names using SHA-256 (8-char truncated hash)
5. Return structured metadata (thread_id, title, author_hash, created_date, score, num_comments)
6. Implement pagination if results exceed max_results
7. Handle rate limiting with exponential backoff
8. Provide progress indication for long searches

**Error Handling**:
- No results → "No threads found. Try different search terms or expand date range"
- API errors → "Reddit API temporarily unavailable. Please try again in a moment"
- Invalid date format → "Date format should be YYYY-MM-DD (e.g., 2021-01-15)"

#### Tool 2: get_thread_details

**Purpose**: Retrieve full content of a specific thread with comments.

**MCP Tool Definition**:
```javascript
{
  name: "get_thread_details",
  description: "Retrieve full content of a Reddit thread including comments. Authors are automatically anonymized.",
  inputSchema: {
    type: "object",
    properties: {
      thread_id: {
        type: "string",
        description: "Reddit thread ID (e.g., 'abc123')"
      },
      include_comments: {
        type: "boolean",
        description: "Include comments (default: true)"
      },
      max_comments: {
        type: "integer",
        description: "Maximum comments to retrieve (default: 50)"
      },
      sort_by: {
        type: "string",
        enum: ["top", "best", "new"],
        description: "Comment sort order (default: 'top')"
      }
    },
    required: ["thread_id"]
  }
}
```

**Implementation Requirements** (`src/tools/thread-details.js`):
1. Fetch thread content using snoowrap
2. Fetch and sort comments based on sort_by parameter
3. Anonymize all usernames (post author, comment authors)
4. Maintain consistent hashes (same user = same hash across dataset)
5. Return structured thread object matching schema in issue #1
6. Handle deleted/removed content gracefully
7. Cache thread content for 5 minutes to reduce API calls

**Error Handling**:
- Thread not found → "Thread not found or has been deleted"
- Thread deleted → "This thread is no longer accessible (deleted by user or moderator)"
- Access denied → "Cannot access private or restricted content"

#### Tool 3: batch_search_medications

**Purpose**: Search for multiple medications across subreddits efficiently.

**MCP Tool Definition**:
```javascript
{
  name: "batch_search_medications",
  description: "Search for multiple medications across subreddits in one operation. Efficient for collecting diverse medication data.",
  inputSchema: {
    type: "object",
    properties: {
      medications: {
        type: "array",
        items: { type: "string" },
        description: "List of medication names (e.g., ['ondansetron', 'amoxicillin', 'levothyroxine'])"
      },
      subreddits: {
        type: "array",
        items: { type: "string" },
        description: "Target subreddits"
      },
      start_date: { type: "string" },
      end_date: { type: "string" },
      threads_per_medication: {
        type: "integer",
        description: "Target threads per medication (default: 20)"
      }
    },
    required: ["medications", "subreddits"]
  }
}
```

**Implementation Requirements** (`src/tools/batch-search.js`):
1. Loop through medications, calling search_reddit_threads for each
2. Aggregate results by medication name
3. Implement rate limiting between searches (respect 60 req/min)
4. Provide progress updates ("Searching 2/5 medications...")
5. Continue on individual medication failures (don't fail entire batch)
6. Return organized results: `{ medication_name: [...threads] }`

**Error Handling**:
- Partial failures → "Completed 4/5 medications. Failed: [medication_name]"
- Rate limiting → "Pausing to respect Reddit's rate limits... (20 seconds remaining)"

#### Tool 4: export_research_data

**Purpose**: Export collected data in research-ready formats (JSON/CSV).

**MCP Tool Definition**:
```javascript
{
  name: "export_research_data",
  description: "Export collected thread data to JSON or CSV format with anonymization and metadata.",
  inputSchema: {
    type: "object",
    properties: {
      thread_ids: {
        type: "array",
        items: { type: "string" },
        description: "List of thread IDs to export"
      },
      format: {
        type: "string",
        enum: ["json", "csv"],
        description: "Export format"
      },
      anonymize: {
        type: "boolean",
        description: "Hash usernames with SHA-256 (default: true, recommended)"
      },
      include_metadata: {
        type: "boolean",
        description: "Include collection metadata (default: true)"
      }
    },
    required: ["thread_ids", "format"]
  }
}
```

**Implementation Requirements** (`src/tools/export.js`):
1. Fetch thread details for all thread_ids
2. Apply anonymization if enabled (default: true)
3. For JSON: Create structured export matching schema in issue #1
4. For CSV: Flatten data (thread_id, subreddit, title, author_hash, created_date, score, num_comments, word_count)
5. Include metadata block with collection date, total threads, anonymization method, ethical compliance
6. Write to file with descriptive filename: `reddit_export_YYYYMMDD_HHMMSS.{json|csv}`
7. Return file path and summary

**Error Handling**:
- Missing threads → "Warning: 2 threads not found or deleted (IDs: abc123, def456)"
- Write failure → "Cannot write file. Check directory permissions"

#### Tool 5: get_subreddit_info

**Purpose**: Get information about a subreddit for context.

**MCP Tool Definition**:
```javascript
{
  name: "get_subreddit_info",
  description: "Get information about a subreddit (subscribers, description, rules).",
  inputSchema: {
    type: "object",
    properties: {
      subreddit_name: {
        type: "string",
        description: "Name of subreddit (without r/ prefix, e.g., 'pregnant')"
      }
    },
    required: ["subreddit_name"]
  }
}
```

**Implementation Requirements** (`src/tools/subreddit-info.js`):
1. Fetch subreddit metadata using snoowrap
2. Return subscriber count, description, rules, posting guidelines
3. Cache for 1 hour (subreddit info rarely changes)
4. Handle private/banned subreddits

---

### Phase 3: Privacy & Ethics Implementation (Priority: Critical)

**Objective**: Implement bulletproof privacy protection and ethical safeguards.

**Tasks**:

1. **Create Anonymization Module** (`src/privacy/anonymize.js`)

   **Requirements**:
   - SHA-256 hash all usernames
   - Truncate to 8 characters for readability
   - Maintain consistency (same username → same hash across entire dataset)
   - Use salt stored in environment for reproducibility within study
   - Never log or expose original usernames

   **Implementation**:
   ```javascript
   const crypto = require('crypto');

   const SALT = process.env.ANONYMIZATION_SALT || 'mprint-research-2025';
   const hashCache = new Map(); // Consistency cache

   function anonymizeUsername(username) {
     if (hashCache.has(username)) {
       return hashCache.get(username);
     }

     const hash = crypto
       .createHash('sha256')
       .update(username + SALT)
       .digest('hex')
       .substring(0, 8);

     hashCache.set(username, hash);
     return hash;
   }
   ```

2. **Create Ethics Guidelines Resource** (`resources/ethics-guidelines.json`)

   **Content**:
   ```json
   {
     "framework": "AoIR Ethics 3.0",
     "principles": [
       "Public data only (no private messages)",
       "Anonymize all usernames",
       "No interaction with participants",
       "Respect community norms",
       "Document methodology for transparency"
     ],
     "checklist": [
       "✓ Data from public subreddits only",
       "✓ No personal health information collected",
       "✓ Anonymization applied before analysis",
       "✓ Research purpose clearly documented",
       "✓ No deception or covert collection"
     ]
   }
   ```

3. **Create PRIVACY.md Documentation**

   **Sections**:
   - Privacy protection mechanisms
   - Anonymization methodology
   - Ethical guidelines (AoIR Ethics 3.0)
   - IRB compliance considerations
   - Data handling best practices
   - Limitations and risks

---

### Phase 4: Rate Limiting & Caching (Priority: High)

**Objective**: Implement robust rate limiting and caching to respect Reddit's API limits.

**Tasks**:

1. **Create Rate Limiter** (`src/utils/rate-limiter.js`)

   **Requirements**:
   - Token bucket algorithm
   - 60 requests per minute ceiling
   - Exponential backoff on 429 responses
   - Start with 1s delay, double each retry, max 64s
   - Log rate limit hits for monitoring

   **Implementation**:
   ```javascript
   class RateLimiter {
     constructor(maxRequests = 60, timeWindow = 60000) {
       this.tokens = maxRequests;
       this.maxTokens = maxRequests;
       this.refillRate = maxRequests / timeWindow;
       this.lastRefill = Date.now();
     }

     async acquire() {
       this.refill();

       if (this.tokens < 1) {
         const waitTime = (1 - this.tokens) / this.refillRate;
         await sleep(waitTime);
         this.refill();
       }

       this.tokens -= 1;
     }

     refill() {
       const now = Date.now();
       const elapsed = now - this.lastRefill;
       const tokensToAdd = elapsed * this.refillRate;
       this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
       this.lastRefill = now;
     }
   }
   ```

2. **Create Cache Manager** (`src/utils/cache.js`)

   **Requirements**:
   - LRU cache with 100 item limit
   - Thread content: 5 minute TTL
   - Subreddit info: 1 hour TTL
   - Clear cache on authentication change

   **Implementation**:
   ```javascript
   class LRUCache {
     constructor(maxSize = 100) {
       this.cache = new Map();
       this.maxSize = maxSize;
     }

     get(key) {
       if (!this.cache.has(key)) return null;

       const item = this.cache.get(key);
       if (Date.now() > item.expiry) {
         this.cache.delete(key);
         return null;
       }

       // Move to end (most recently used)
       this.cache.delete(key);
       this.cache.set(key, item);
       return item.value;
     }

     set(key, value, ttl) {
       if (this.cache.size >= this.maxSize) {
         // Remove oldest (first item)
         const firstKey = this.cache.keys().next().value;
         this.cache.delete(firstKey);
       }

       this.cache.set(key, {
         value,
         expiry: Date.now() + ttl
       });
     }
   }
   ```

---

### Phase 5: MCP Resources & Prompts (Priority: Medium)

**Objective**: Create MCP resources for search templates and workflows.

**Tasks**:

1. **Create Medication Search Template Resource**

   **Resource Definition**:
   ```javascript
   {
     uri: "resource://medication-templates",
     name: "Medication Search Templates",
     description: "Pre-configured search templates for common medication classes",
     mimeType: "application/json"
   }
   ```

   **Content** (`resources/medication-templates.json`):
   ```json
   {
     "antibiotics": {
       "medications": ["amoxicillin", "azithromycin", "cephalexin", "penicillin"],
       "search_terms": ["antibiotic", "infection", "UTI", "prescribed"],
       "subreddits": ["pregnant", "BabyBumps"]
     },
     "antinausea": {
       "medications": ["ondansetron", "zofran", "metoclopramide", "reglan"],
       "search_terms": ["nausea", "vomiting", "morning sickness", "HG"],
       "subreddits": ["pregnant", "BabyBumps", "HyperemesisGravidarum"]
     },
     "thyroid": {
       "medications": ["levothyroxine", "synthroid", "thyroid"],
       "search_terms": ["thyroid", "TSH", "hypothyroid", "thyroid medication"],
       "subreddits": ["pregnant", "tryingforababy"]
     }
   }
   ```

2. **Create Research Workflow Prompt**

   **Prompt Definition**:
   ```javascript
   {
     name: "research_workflow_guide",
     description: "Step-by-step guide for systematic Reddit data collection",
     arguments: [
       {
         name: "medication_class",
         description: "Category of medications to study",
         required: true
       }
     ]
   }
   ```

---

### Phase 6: Documentation & Examples (Priority: High)

**Objective**: Create comprehensive documentation for non-technical researchers.

**Tasks**:

1. **Create README.md**

   **Sections**:
   - Purpose and research context
   - Prerequisites (Node.js, Claude Desktop)
   - Installation instructions (step-by-step)
   - Configuration guide (Reddit API credentials)
   - Claude Desktop MCP setup
   - Quick start example
   - Tool reference (all 5 tools)
   - Troubleshooting guide
   - Privacy and ethics section
   - FAQs
   - Contact information

2. **Create Example Scripts** (`examples/`)

   **Required Examples**:
   - `search-single-medication.md` - Search for ondansetron in r/pregnant
   - `batch-collection.md` - Collect data for 5 medications
   - `export-to-csv.md` - Export search results to CSV
   - `complete-workflow.md` - End-to-end research workflow

   **Format for each example**:
   ```markdown
   # Example: [Task Name]

   ## Goal
   [What this example demonstrates]

   ## Prerequisites
   [What you need before starting]

   ## Steps

   ### 1. [Step name]
   [Detailed instruction with exact tool call]

   ### 2. [Step name]
   [Detailed instruction with exact tool call]

   ## Expected Results
   [What you should see]

   ## Troubleshooting
   [Common issues and solutions]
   ```

3. **Create PRIVACY.md**

   **Sections**:
   - Privacy protection mechanisms
   - Anonymization methodology
   - What data is collected vs. not collected
   - Ethical framework (AoIR Ethics 3.0)
   - IRB considerations
   - Data security recommendations
   - Limitations and risks

4. **Create API Reference** (`docs/API.md`)

   **Format**:
   ```markdown
   # API Reference

   ## Tools

   ### search_reddit_threads

   **Description**: [...]

   **Parameters**:
   - `medication_name` (string, required): [...]
   - ...

   **Returns**: [...]

   **Example**:
   ```

   **Error Cases**:
   - [...]
   ```

---

### Phase 7: Testing (Priority: Critical)

**Objective**: Comprehensive test coverage for all functionality.

**Tasks**:

1. **Authentication Tests** (`tests/auth.test.js`)
   - ✓ Successful authentication with valid credentials
   - ✓ Failed authentication with invalid credentials
   - ✓ Missing environment variables
   - ✓ Token refresh on expiration

2. **Search Tests** (`tests/search.test.js`)
   - ✓ Search returns results for known medications
   - ✓ Search with date filters
   - ✓ Search with min_comments filter
   - ✓ Search with min_words filter
   - ✓ Search handles no results
   - ✓ Search handles deleted/removed content

3. **Privacy Tests** (`tests/privacy.test.js`)
   - ✓ Anonymization produces consistent hashes
   - ✓ Same username always maps to same hash
   - ✓ Different usernames produce different hashes
   - ✓ Hash length is exactly 8 characters
   - ✓ No original usernames in output

4. **Rate Limiting Tests** (`tests/rate-limiter.test.js`)
   - ✓ Rate limiter enforces 60 req/min ceiling
   - ✓ Exponential backoff on 429 responses
   - ✓ Rate limiter resets after time window

5. **Export Tests** (`tests/export.test.js`)
   - ✓ JSON export is valid JSON
   - ✓ CSV export is valid CSV
   - ✓ Metadata included when requested
   - ✓ Anonymization applied when enabled

6. **Integration Tests** (`tests/integration.test.js`)
   - ✓ Complete workflow: search → get details → export
   - ✓ Batch search for multiple medications
   - ✓ Handle mixed success/failure in batch operations

**Test Execution**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Coverage Target**: ≥80% for critical paths (auth, privacy, search, export)

---

### Phase 8: Final Integration & Deployment (Priority: High)

**Objective**: Create the main MCP server and prepare for deployment.

**Tasks**:

1. **Create MCP Server** (`index.js`)

   **Requirements**:
   - Initialize MCP server using @modelcontextprotocol/sdk
   - Register all 5 tools
   - Register resources (medication templates, ethics guidelines)
   - Register prompts (research workflow)
   - Handle server lifecycle (initialization, shutdown)
   - Log all operations for debugging

   **Template**:
   ```javascript
   #!/usr/bin/env node

   const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
   const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

   const server = new Server({
     name: 'reddit-research',
     version: '1.0.0'
   }, {
     capabilities: {
       tools: {},
       resources: {},
       prompts: {}
     }
   });

   // Register tools
   server.setRequestHandler('tools/list', async () => {
     return {
       tools: [
         // Tool definitions...
       ]
     };
   });

   server.setRequestHandler('tools/call', async (request) => {
     // Tool implementation dispatch...
   });

   // Start server
   const transport = new StdioServerTransport();
   await server.connect(transport);
   ```

2. **Create Installation Script** (`install.sh`)

   ```bash
   #!/bin/bash

   echo "Installing Reddit Research MCP Bundle..."

   # Check Node.js
   if ! command -v node &> /dev/null; then
     echo "Error: Node.js not found. Please install Node.js 18+"
     exit 1
   fi

   # Install dependencies
   npm install

   # Create .env if doesn't exist
   if [ ! -f .env ]; then
     cp .env.example .env
     echo "Created .env file. Please add your REDDIT_CLIENT_SECRET"
   fi

   echo "Installation complete!"
   echo ""
   echo "Next steps:"
   echo "1. Edit .env and add your REDDIT_CLIENT_SECRET"
   echo "2. Add this MCP server to Claude Desktop configuration"
   echo "3. Restart Claude Desktop"
   ```

3. **Create package.json Scripts**

   ```json
   {
     "name": "mcp-bundle-reddit-research",
     "version": "1.0.0",
     "description": "MCP bundle for Reddit research on pregnancy medications",
     "main": "index.js",
     "bin": {
       "reddit-research-mcp": "./index.js"
     },
     "scripts": {
       "start": "node index.js",
       "test": "jest",
       "test:coverage": "jest --coverage",
       "lint": "eslint src tests"
     },
     "keywords": ["mcp", "reddit", "research", "pregnancy", "medications"],
     "author": "samuel.harrold@gmail.com",
     "license": "MIT"
   }
   ```

4. **Create Claude Desktop Configuration Guide** (`docs/CLAUDE_SETUP.md`)

   **Content**:
   ```markdown
   # Claude Desktop Setup

   ## Step 1: Install the MCP Bundle

   1. Download or clone this repository
   2. Navigate to the directory
   3. Run: `npm install`
   4. Copy `.env.example` to `.env`
   5. Add your `REDDIT_CLIENT_SECRET` to `.env`

   ## Step 2: Configure Claude Desktop

   ### macOS

   Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

   ### Windows

   Edit: `%APPDATA%\Claude\claude_desktop_config.json`

   ### Configuration

   ```json
   {
     "mcpServers": {
       "reddit-research": {
         "command": "node",
         "args": ["/absolute/path/to/mcp-bundle-reddit-research/index.js"],
         "env": {
           "REDDIT_CLIENT_SECRET": "your_secret_here"
         }
       }
     }
   }
   ```

   **Important**: Replace `/absolute/path/to/` with the actual path on your system.

   ## Step 3: Restart Claude Desktop

   Close and reopen Claude Desktop for changes to take effect.

   ## Step 4: Verify Installation

   In Claude Desktop, try:

   > Search for discussions about ondansetron in r/pregnant subreddit

   Claude should use the `search_reddit_threads` tool.

   ## Troubleshooting

   ### "Tool not found"
   - Check that the path in config is absolute (not relative)
   - Verify Node.js is installed: `node --version`
   - Check config file syntax (valid JSON)

   ### "Authentication failed"
   - Verify REDDIT_CLIENT_SECRET is correct
   - Check .env file is in the correct location
   - Ensure no extra spaces in .env values

   ### "Cannot connect to Reddit"
   - Check internet connection
   - Verify Reddit API is accessible
   - Check for rate limiting (wait and retry)
   ```

---

## Quality Assurance Checklist

Before considering the implementation complete, verify:

### Functionality
- [ ] All 5 tools work with Reddit API
- [ ] Authentication succeeds with valid credentials
- [ ] Authentication fails gracefully with invalid credentials
- [ ] Search returns results for known medications
- [ ] Thread details retrieves full content
- [ ] Batch search processes multiple medications
- [ ] Export creates valid JSON files
- [ ] Export creates valid CSV files
- [ ] Subreddit info retrieves metadata

### Privacy & Ethics
- [ ] All usernames are anonymized via SHA-256
- [ ] Hash length is exactly 8 characters
- [ ] Same username always produces same hash
- [ ] No original usernames appear in logs or output
- [ ] PRIVACY.md clearly explains privacy protections
- [ ] AoIR Ethics 3.0 guidelines embedded

### Error Handling
- [ ] Clear, user-friendly error messages (no technical jargon)
- [ ] Handles missing credentials gracefully
- [ ] Handles rate limiting with backoff
- [ ] Handles deleted/removed content
- [ ] Handles network errors
- [ ] Handles invalid parameters

### Performance
- [ ] Search response < 5 seconds for 100 threads
- [ ] Thread details < 2 seconds per thread
- [ ] Memory usage < 500 MB for 1000 threads
- [ ] Rate limiting respects 60 req/min ceiling
- [ ] Caching reduces redundant API calls

### Documentation
- [ ] README.md complete and clear
- [ ] PRIVACY.md explains privacy protections
- [ ] API.md documents all tools
- [ ] Example scripts provided for common tasks
- [ ] Claude Desktop setup guide clear
- [ ] Troubleshooting section helpful
- [ ] Installation instructions step-by-step

### Testing
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Coverage ≥ 80% for critical paths
- [ ] Manual testing completed
- [ ] Example workflows tested end-to-end

### Code Quality
- [ ] Code is readable and well-commented
- [ ] Functions have clear single responsibilities
- [ ] No hardcoded credentials or secrets
- [ ] Environment variables used for configuration
- [ ] Error handling comprehensive
- [ ] Logging for debugging

---

## Success Criteria

The implementation is considered successful when:

1. **Functional**: A medical researcher can install, configure, and use the tool to collect Reddit data without technical assistance

2. **Ethical**: All data is anonymized by default, privacy guidelines are clear, and ethical framework is embedded

3. **Reliable**: Tool handles errors gracefully, respects rate limits, and recovers from failures automatically

4. **Documented**: A non-technical user can follow documentation to complete full research workflow

5. **Tested**: All critical functionality has test coverage and passes validation

6. **Validated**: Tool successfully collects 100+ threads matching study requirements with proper anonymization

---

## Implementation Notes & Best Practices

### For Claude Code Implementer

1. **Start with Authentication**: Get Reddit OAuth working first. Everything depends on this.

2. **Build Incrementally**: Implement tools one at a time, testing each before moving to next.

3. **Privacy is Non-Negotiable**: Anonymization must be bulletproof. Test thoroughly.

4. **User Experience Matters**: Error messages should help users fix problems, not confuse them.

5. **Follow MCP Best Practices**:
   - Clear, descriptive tool names
   - Comprehensive input schemas with descriptions
   - Structured, consistent output formats
   - Proper error responses

6. **Test with Real Data**: Use actual Reddit searches to validate functionality.

7. **Document as You Go**: Don't wait until the end to write documentation.

8. **Consider the User**: These are medical researchers, not developers. Make it foolproof.

### MCP Protocol Specifics

- **Tool Naming**: Use snake_case (e.g., `search_reddit_threads`)
- **Input Schema**: Use JSON Schema format with clear descriptions
- **Output Format**: Return structured data, not plain text
- **Error Responses**: Use MCP error codes and provide helpful messages
- **Resources**: Use `resource://` URI scheme
- **Prompts**: Include argument schemas with descriptions

### Reddit API Specifics

- **Rate Limiting**: 60 requests/minute, strictly enforced
- **OAuth Tokens**: Expire after 1 hour, handle refresh
- **Search Syntax**: Use Reddit's search operators (e.g., `subreddit:pregnant`)
- **Date Filtering**: Convert to Unix timestamps for API
- **Deleted Content**: Common, handle gracefully

### Privacy & Ethics

- **Anonymization**: SHA-256 with consistent salt
- **Public Data Only**: Never access private messages or restricted content
- **No Interaction**: Read-only access, no posting or voting
- **Documentation**: Clear explanation of privacy protections
- **IRB Readiness**: Tool should facilitate IRB approval, not complicate it

---

## Deliverables

Upon completion, the repository should contain:

```
mcp-bundle-reddit-research/
├── index.js                          # Main MCP server
├── package.json                      # Dependencies and scripts
├── package-lock.json                 # Locked dependencies
├── .env.example                      # Environment template
├── .gitignore                        # Git exclusions
├── README.md                         # Main documentation
├── PRIVACY.md                        # Privacy guidelines
├── LICENSE                           # MIT license
├── src/
│   ├── auth.js                       # Reddit OAuth authentication
│   ├── tools/
│   │   ├── search.js                 # search_reddit_threads
│   │   ├── thread-details.js         # get_thread_details
│   │   ├── batch-search.js           # batch_search_medications
│   │   ├── export.js                 # export_research_data
│   │   └── subreddit-info.js         # get_subreddit_info
│   ├── privacy/
│   │   └── anonymize.js              # SHA-256 anonymization
│   └── utils/
│       ├── rate-limiter.js           # Token bucket rate limiter
│       └── cache.js                  # LRU cache
├── resources/
│   ├── medication-templates.json     # Search templates
│   └── ethics-guidelines.json        # AoIR Ethics 3.0
├── examples/
│   ├── search-single-medication.md   # Simple search example
│   ├── batch-collection.md           # Batch search example
│   ├── export-to-csv.md              # Export example
│   └── complete-workflow.md          # End-to-end workflow
├── tests/
│   ├── auth.test.js                  # Authentication tests
│   ├── search.test.js                # Search tests
│   ├── privacy.test.js               # Privacy tests
│   ├── rate-limiter.test.js          # Rate limiting tests
│   ├── export.test.js                # Export tests
│   └── integration.test.js           # Integration tests
└── docs/
    ├── API.md                        # Complete API reference
    ├── CLAUDE_SETUP.md               # Claude Desktop config guide
    └── TROUBLESHOOTING.md            # Common issues and solutions
```

---

## Timeline & Milestones

**Recommended Implementation Order**:

1. **Week 1**: Project setup, authentication, basic search tool
2. **Week 2**: Remaining 4 tools, privacy implementation
3. **Week 3**: Rate limiting, caching, error handling
4. **Week 4**: Documentation, examples, testing
5. **Week 5**: Integration testing, refinement, deployment preparation

**Critical Path**: Authentication → Search → Privacy → Export → Documentation

---

## Support & Questions

For questions during implementation:

**Technical Questions**: samuel.harrold@gmail.com
**Research Context**: emkinney@iu.edu

**Resources**:
- MCP Specification: https://modelcontextprotocol.io/
- Reddit API: https://www.reddit.com/dev/api/
- snoowrap: https://github.com/not-an-aardvark/snoowrap
- AoIR Ethics 3.0: https://aoir.org/ethics/

---

## Final Notes

This is a **research tool for academic purposes**. The implementation should:

- **Prioritize privacy** over convenience
- **Prioritize ethics** over features
- **Prioritize usability** over complexity
- **Prioritize reliability** over speed

The tool will be used by medical researchers to understand how pregnant individuals discuss medications online. The insights gained will inform health communication and clinical practice.

**Your implementation will directly contribute to improving maternal and child health outcomes.**

Good luck with the implementation! 🚀

---

**End of Implementation Prompt**
