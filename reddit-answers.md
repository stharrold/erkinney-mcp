---
title: Reddit API Application Submission
app_name: erkinney-mcp-bundle
app_type: script
date_created: 2025-11-21
status: draft
contacts:
  researcher: emkinney@iu.edu
  developer: samuel.harrold@gmail.com
repository: https://github.com/stharrold/erkinney-mcp
purpose: Academic research - pregnancy medication discussions
compliance:
  - IRB
  - AoIR Ethics 3.0
  - SHA-256 anonymization
---

# Reddit API Application Submission

## Application Details

**App Name:** `erkinney-mcp-bundle`

**App Type:** Script (Script for personal use. Will only have access to the developer's account)

**App Description:**
Academic research prototype for analyzing medication discussions in pregnancy web app subreddits. Pre-IRB development phase for planned qualitative health communication study. Read-only data collection - no posting/interaction. Will transition to Research API upon approval of r/reddit4researchers proposal. Contact: samuel.harrold@gmail.com (developer) on behalf of emkinney@iu.edu (researcher).

**About URL:** https://github.com/stharrold/erkinney-mcp

**Redirect URI:** https://github.com/stharrold/erkinney-mcp

---

## Question 1: What benefit/purpose will the bot/app have for Redditors?

### Academic Research Tool - Pregnancy Medication Safety

This is a research tool for Indiana University's health communication study examining how pregnant individuals discuss medications on Reddit. The app will:

1. Help researchers understand medication information-seeking behavior in pregnancy communities
2. Identify gaps in healthcare communication that could improve patient education
3. Analyze peer support patterns in pregnancy health discussions
4. Contribute to published academic research on health communication

The app is READ-ONLY (no posting/voting) and implements:
- IRB-compliant anonymization (SHA-256 hashing of all usernames)
- AoIR Ethics 3.0 guidelines for internet research
- Public data only (no private messages)
- Rate limiting to respect Reddit's infrastructure

Research findings will be shared with the academic community to improve healthcare communication. No individual Reddit users will be identifiable in any publications.

**Research Contact:** Dr. Emily Kinney, Indiana University, School of Medicine (emkinney@iu.edu)
**Developer Contact:** Samuel Harrold (samuel.harrold@gmail.com)

---

## Question 2: Provide a detailed description of what the Bot/App will be doing on the Reddit platform

### TECHNICAL DESCRIPTION - READ-ONLY ACADEMIC RESEARCH TOOL

This application performs systematic, read-only data collection from public Reddit posts to study how pregnant individuals discuss medications and seek health information. It will NOT post, comment, vote, send messages, or interact with content in any way.

---

### OPERATION 1: SEARCH PUBLIC POSTS FOR MEDICATION DISCUSSIONS

**Example Search Query:**
- Medication: "ondansetron" (anti-nausea medication)
- Subreddits: r/pregnant, r/babybumps
- Date range: January 2021 - December 2023
- Minimum comments: 5 (indicates active discussion)
- Minimum word count: 50 (substantive posts only)

**API Call:**
```
GET /search.json?q=ondansetron+subreddit:pregnant+OR+subreddit:babybumps&t=all&sort=relevance&limit=100
```

**Example Results Collected:**
- Thread ID: `t3_abc123`
- Title: "Ondansetron during first trimester - experiences?"
- Body: "My OB prescribed Zofran for morning sickness. Has anyone taken this? Worried about side effects..."
- Author: [ANONYMIZED to "a7b3c9d2" via SHA-256]
- Timestamp: 2022-03-15T14:23:00Z
- Subreddit: r/pregnant
- Comments: 47
- Upvotes: 95
- Downvotes: 6

Researcher would collect 50-100 threads per medication for analysis.

---

### OPERATION 2: RETRIEVE FULL THREAD CONTENT WITH COMMENTS

**Example Thread Retrieval:**
- Thread ID: `t3_abc123` (from search results above)

**API Call:**
```
GET /r/pregnant/comments/abc123.json
```

**Example Comment Tree Collected:**
```
Post (ID: t3_abc123)
├─ Comment 1 (ID: c_xyz789)
│  Author: [ANONYMIZED to "f4e8d1c7"]
│  Text: "I took Zofran from weeks 6-12. It really helped with nausea..."
│  Timestamp: 2022-03-15T15:45:00Z
│  Upvotes: 25
│  Downvotes: 2
│  ├─ Reply 1.1 (ID: c_def456)
│  │  Author: [ANONYMIZED to "b9a2e6f3"]
│  │  Text: "Did you have any constipation? That's the main side effect I've read about."
│  │  Timestamp: 2022-03-15T16:12:00Z
│  │  Upvotes: 9
│  │  Downvotes: 1
│  └─ Reply 1.2 (ID: c_ghi789)
│     Author: [ANONYMIZED to "f4e8d1c7"] (same user as Comment 1)
│     Text: "Yes, definitely had constipation. My doctor recommended..."
│     Timestamp: 2022-03-15T17:03:00Z
│     Upvotes: 13
│     Downvotes: 1
├─ Comment 2 (ID: c_jkl012)
│  Author: [ANONYMIZED to "c5d9e2a1"]
│  Text: "My experience was different. I tried it for two weeks but..."
│  Timestamp: 2022-03-15T18:20:00Z
│  Upvotes: 17
│  Downvotes: 2
...continues for all 47 comments
```

Collects up to 500 comments per thread to capture full discussion context.

**Note on Upvotes/Downvotes:** These metrics indicate community engagement and perceived value of information. High upvotes suggest content the community found helpful or relevant. We record these for qualitative analysis of what information pregnant individuals value most, but do not use them to filter data or rank users.

---

### OPERATION 3: BATCH SEARCH MULTIPLE MEDICATIONS

**Example Batch Query:**
Medications: `["ondansetron", "amoxicillin", "levothyroxine", "metformin", "sertraline"]`

**Process:**
1. Search ondansetron → collect 75 threads
   [Wait 1 second for rate limiting]
2. Search amoxicillin → collect 62 threads
   [Wait 1 second for rate limiting]
3. Search levothyroxine → collect 83 threads
   [Wait 1 second for rate limiting]
...continues for all medications

**Total API calls:** ~250 searches + ~220 thread retrievals = 470 calls over ~8 minutes

---

### OPERATION 4: GET SUBREDDIT METADATA

**Example:**

**API Call:**
```
GET /r/pregnant/about.json
```

**Data Collected:**
- Subreddit name: "pregnant"
- Display name: "r/pregnant"
- Subscribers: 234,567
- Description: "A supportive community for those expecting..."
- Rules: ["Be kind and supportive", "No medical advice", ...]
- Created: 2010-06-15
- Public/Private: public

**Purpose:** Document research context, understand community norms, cite subreddit rules in publications.

---

### OPERATION 5: EXPORT DATA FOR ANALYSIS

**Example Export (CSV format):**
```csv
thread_id,author_hash,title,body,created_date,subreddit,num_comments,upvotes,downvotes
t3_abc123,a7b3c9d2,"Ondansetron during first trimester","My OB prescribed...",2022-03-15T14:23:00Z,pregnant,47,95,6
t3_def456,b8c3d9e1,"Zofran and constipation tips?","I've been taking...",2022-04-02T09:15:00Z,babybumps,23,61,5
...
```

**Researchers import into NVivo for qualitative coding:**
- Theme: "Side effects discussed"
- Theme: "Doctor recommendations"
- Theme: "Peer support patterns"

---

### PRIVACY SAFEGUARDS - CONCRETE EXAMPLES

**Username Anonymization:**
```
Original username: "PregnantMom2023"
→ SHA-256 hash: "a7b3c9d2e5f8..." (truncated to 8 chars: "a7b3c9d2")
→ Same user always gets same hash (consistency for analysis)
→ Cannot reverse hash to find original username
```

**What's NEVER collected:**
- Private messages
- User profiles or post history
- Email addresses
- Real names
- Location data
- Medical records or PHI

---

### RATE LIMITING IMPLEMENTATION

**Token bucket algorithm (60 requests/minute):**
- Initial tokens: 60
- Refill rate: 1 token/second

**Example timeline:**
```
00:00 - Make 30 API calls (30 tokens consumed)
00:30 - Wait, tokens refilling (now have 30 tokens)
01:00 - Make 40 more calls (40 tokens consumed, 20 remain)
01:20 - Wait, tokens refilling
```

**If rate limit hit (429 error):**
- Exponential backoff: wait 1s, 2s, 4s, 8s, 16s...
- Automatic retry with increasing delays

**Caching to reduce calls:**
- Same search repeated within 10 minutes → return cached results
- Same thread requested within 5 minutes → return cached content
- Reduces load on Reddit's infrastructure

---

### TYPICAL RESEARCH SESSION

1. Researcher opens Claude Desktop
2. Natural language query: "Search for ondansetron discussions in pregnant subreddits from 2021-2023"
3. MCP server executes search (60 API calls over 1 minute)
4. Returns 58 relevant threads
5. Researcher: "Get full content for threads with >20 comments"
6. MCP server retrieves 23 threads (23 API calls over 23 seconds)
7. Researcher: "Export to CSV"
8. MCP server generates anonymized CSV file locally
9. Researcher imports to NVivo for qualitative analysis

**Total API calls:** 83 over ~2 minutes (well under rate limits)

---

### ACADEMIC OUTPUT EXAMPLES

**Research Questions:**
- How do pregnant individuals describe medication side effects?
- What role does peer support play in medication decisions?
- How do discussions differ between medical professionals' advice and peer experiences?

**Publications (with IRB approval):**
- Journal articles: "Peer support in pregnancy medication decision-making: A Reddit discourse analysis"
- Conference presentations: Data aggregated, no individual quotes identifiable
- Theses: Tables showing themes, frequencies, patterns (not raw usernames)

---

### TECHNICAL SPECIFICATIONS

- **Programming language:** Node.js (JavaScript)
- **Reddit API library:** snoowrap v1.23.0
- **Authentication:** OAuth 2.0 password grant (script app type)
- **Deployment:** Local execution via Claude Desktop MCP protocol
- **Data storage:** Local filesystem only (not cloud)
- **Anonymization:** crypto.createHash('sha256') with unique salt per study

**Research Contact:** Dr. Emily Kinney, Indiana University, School of Medicine (emkinney@iu.edu)
**Developer Contact:** Samuel Harrold (samuel.harrold@gmail.com)

**Repository:** https://github.com/stharrold/erkinney-mcp

---

## Question 3: What is missing from Devvit that prevents building on that platform?

This is a research data collection tool, not an interactive Reddit application, so Devvit is not applicable.

### REASONS DEVVIT DOESN'T FIT THIS USE CASE:

#### 1. WRONG PLATFORM PURPOSE
- Devvit is for building interactive Reddit apps (bots, games, widgets)
- This tool performs offline academic research data collection
- No user-facing features, posts, or interactions needed

#### 2. ARCHITECTURE MISMATCH
- This tool runs locally on researchers' machines via Claude Desktop MCP extension
- Devvit apps run on Reddit's infrastructure
- Need local execution to maintain data privacy and researcher control

#### 3. DATA EXPORT REQUIREMENTS
- Research requires exporting data to CSV/JSON for analysis in NVivo/Atlas.ti
- Devvit apps are designed for in-Reddit experiences, not data export
- Need direct API access for systematic data collection

#### 4. PRIVACY & IRB COMPLIANCE
- Institutional Review Board (IRB) protocols require local data storage on researcher's machine
- Cannot use cloud-hosted infrastructure for sensitive research data
- Researchers must control anonymization and data retention

#### 5. MULTI-PLATFORM INTEGRATION
- Tool integrates with Claude Desktop for AI-assisted analysis
- Connects to external research tools (NVivo, Atlas.ti, SPSS)
- Devvit is limited to Reddit ecosystem

**Summary:** This is fundamentally a research tool (like a web scraper or API client), not a Reddit application. Devvit would be appropriate if we were building something users interact with on Reddit, but this tool is for academic researchers analyzing public data offline.

---

## Question 4: Provide a link to source code or platform that will access the API

**Repository:** https://github.com/stharrold/erkinney-mcp

**Description:** Public GitHub repository containing the complete MCP bundle implementation with:
- All source code (Node.js with ES modules)
- Privacy/anonymization implementation
- Rate limiting and caching logic
- Documentation (README, PRIVACY.md, KEYCHAIN.md)
- Test suite (Jest)
- Setup scripts for researchers

**License:** MIT License (open source)

**Key Files:**
- `index.js` - MCP server entry point
- `src/tools/` - 5 MCP research tools
- `src/privacy/anonymize.js` - SHA-256 anonymization
- `src/utils/rate-limiter.js` - Token bucket rate limiting
- `src/utils/cache.js` - LRU caching implementation

---

## Question 5: What subreddits do you intend to use the bot/app in?

**Target Subreddits:**
- `r/pregnant`
- `r/babybumps`
- `r/beyondthebump`
- `r/tryingforababy`

**Rationale:** These are the primary communities where pregnant individuals and those trying to conceive discuss pregnancy-related health topics, including medication use, side effects, and decision-making. They represent active, supportive communities with substantial discussion of pregnancy medication experiences.

**Usage Pattern:** Read-only data collection from public posts and comments. No posting, commenting, voting, or community interaction.

---

## Question 6: If applicable, what username will you be operating this bot/app under?

**Username:** `stharrold`

**Note:** This is a personal script app (not a bot account) that runs locally on the developer's machine for research prototyping. The tool performs read-only API calls and does not post, comment, or interact with Reddit content in any way.

Once the research study receives IRB approval, individual researchers will each use their own Reddit accounts with their own script apps (following the distributed architecture described in Question 3). This is the recommended approach for academic research tools where each researcher maintains independent credentials and rate limits.
