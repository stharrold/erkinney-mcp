---
title: Reddit API Application - Comprehensive Submission
version: 2.0.0
date_created: 2025-11-21
date_updated: 2025-11-22
status: ready_for_submission
prior_submission:
  request_id: 15987717
  date: 2025-11-21
  result: DENIED
  reason: "Not in compliance with Reddit's Responsible Builder Policy and/or lacks necessary details"
contacts:
  principal_investigator: squinney@iu.edu
  research_staff: emkinney@iu.edu
  developer: samuel.harrold@gmail.com
irb:
  protocol: 28905
  status: Exempt (Category 4(i))
  approval_date: 2025-10-31
  institution: Indiana University
repository: https://github.com/stharrold/erkinney-mcp
---

# Reddit API Application - Comprehensive Submission

This document provides answers to ALL questions from BOTH Reddit API request forms (Developer and Researcher), with explicit policy/terms references for each answer.

## Table of Contents

1. [Prior Submission & Revision Note](#prior-submission--revision-note)
2. [Part A: Researcher Form Questions](#part-a-researcher-form-questions)
3. [Part B: Developer Form Questions](#part-b-developer-form-questions)
4. [Appendix: Policy Compliance Matrix](#appendix-policy-compliance-matrix)
5. [Appendix: Attachments](#appendix-attachments)

---

# Prior Submission & Revision Note

> **This is a revised submission addressing Request #15987717, which was denied on November 21, 2025.**

## Denial Reason Received

The prior submission was denied with the following reason:

> *"Your submission is not in compliance with Reddit's Responsible Builder Policy and/or lacks necessary details."*

## How This Revised Submission Addresses the Denial

| Issue Identified | Resolution in This Submission |
|------------------|------------------------------|
| **Compliance with Responsible Builder Policy** | Every answer now includes explicit footnote references to specific sections of the Responsible Builder Policy, Developer Terms, and Data API Terms (24 policy citations total) |
| **Lacking necessary details** | This document provides comprehensive technical specifications, including API endpoints, data handling procedures, rate limiting implementation, and anonymization methods |
| **Submitter identity** | Now submitted by Research Staff (emkinney@iu.edu) with institutional affiliation, rather than developer's personal email |
| **Research context** | Full IRB documentation (Protocol #28905, Exempt Category 4(i)), NIH funding details, and AoIR Ethics 3.0 compliance explicitly stated |
| **Technical transparency** | Open-source repository (https://github.com/stharrold/erkinney-mcp) with complete implementation available for audit |

## Key Compliance Improvements

1. **24 explicit policy citations** - Each answer references specific policy sections by name and paragraph
2. **Policy Compliance Matrix** - Appendix maps all policy requirements to our implementation
3. **READ-ONLY commitment** - Explicit documentation that tool has no posting, commenting, voting, or messaging capabilities
4. **No AI/ML training** - Multiple citations confirming compliance with AI training prohibitions
5. **Privacy-by-design** - SHA-256 anonymization implemented before any data storage

---

# Part A: Researcher Form Questions

**Form URL:** https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=14868593862164
**Role Selection:** "I'm a researcher"

---

## A1. What do you need assistance with?

**Answer:** API Access Request

---

## A2. Your email address

**Answer:** emkinney@iu.edu

> **Policy Compliance:**
> - The Researcher form explicitly states: *"Please submit this form from a university-affiliated email address or your request will be denied."*[^1]
> - Dr. Emily Kinney is the Research Staff member listed on IRB Protocol #28905 and holds an Indiana University institutional email.

[^1]: Reddit Researcher API Request Form, email field instruction

---

## A3. Which role best describes your reason for requesting API access?

**Answer:** I'm a researcher

> **Policy Compliance:**
> - Responsible Builder Policy, Researchers Section: *"This section applies to academic researchers affiliated with an accredited university and Reddit for Researchers participants who are granted access solely for non-commercial purposes."*[^2]
> - Indiana University is an accredited R1 research university.

[^2]: Responsible Builder Policy, "Researchers" section, para. 1

---

## A4. Reddit account name

**Answer:** [To be created by Dr. Kinney with @iu.edu email verification]

> **Note:** A new Reddit account should be created by Dr. Kinney using her institutional email to maintain consistency between the API request submitter and the Reddit account holder.

---

## A5. Educational institution

**Answer:** Indiana University School of Medicine

> **Policy Compliance:**
> - Responsible Builder Policy, Researchers Section requires affiliation with *"an accredited university"*[^2]
> - IRB Protocol #28905 lists Indiana University as the reviewing institution
> - Principal Investigator: Sara Quinney, PhD (squinney@iu.edu)
> - Research Staff: Emily Kinney (emkinney@iu.edu)

---

## A6. Location of educational institution (Country)

**Answer:** United States

---

## A7. Research purpose

**Answer:**

### DETAILED RESEARCH PROPOSAL

#### 1. Research Purpose

This study examines how pregnant individuals discuss medication use, side effects, and healthcare provider interactions on Reddit pregnancy communities. The research aims to:

1. **Understand medication information-seeking behavior** in online pregnancy communities
2. **Identify gaps in healthcare communication** that could improve patient education
3. **Analyze peer support patterns** in pregnancy health discussions
4. **Contribute to NIH-funded research** on pregnancy medication safety (MPRINT Center, NICHD P30HD106451)

> **Policy Compliance:**
> - Responsible Builder Policy, Researchers Section: Research is *"solely for non-commercial purposes"*[^2]
> - This is federally-funded academic research with no commercial application
> - Data API Terms §2.4: We will *"copy and display the User Content using the Data API solely as necessary to develop, deploy, distribute, and run your App"*[^3]

[^3]: Data API Terms, Section 2.4 "User Content"

#### 2. Specific Data Requirements

**Target Subreddits:**
- r/pregnant
- r/babybumps
- r/beyondthebump
- r/tryingforababy

**Data Elements Collected:**
| Element | Purpose | Retention |
|---------|---------|-----------|
| Post titles | Identify medication discussions | Study duration only |
| Post bodies | Qualitative content analysis | Study duration only |
| Comment text | Understand peer responses | Study duration only |
| Timestamps | Temporal analysis | Study duration only |
| Subreddit | Community context | Study duration only |
| Vote counts | Community engagement metrics | Study duration only |

**Data Elements NOT Collected:**
- Usernames (anonymized via SHA-256 hash immediately upon collection)[^4]
- User profiles or post history
- Private messages
- Email addresses or real names
- Location data
- Any Protected Health Information (PHI)

> **Policy Compliance:**
> - Responsible Builder Policy, "Zero Tolerance for Privacy Violations": *"You are strictly prohibited from processing data to derive or infer potentially sensitive characteristics about Reddit users (e.g., health, political affiliation, sexual orientation)."*[^5]
> - Our study analyzes discussion patterns and themes, NOT individual user characteristics
> - Responsible Builder Policy: *"you must never attempt to re-identify, de-anonymize, or reverse engineer data about Redditors including by matching data with off-platform identifiers"*[^5]
> - SHA-256 hashing with unique study-specific salt prevents re-identification

[^4]: Implementation: `mcp-bundle-reddit-research/src/privacy/anonymize.js`
[^5]: Responsible Builder Policy, "Zero Tolerance for Privacy Violations" section

#### 3. Ethical Considerations

**IRB Approval:**
- **Protocol Number:** 28905
- **Status:** Exempt (Category 4(i) - publicly available information)
- **Approval Date:** October 31, 2025
- **Reviewing Institution:** Indiana University IRB
- **Principal Investigator:** Sara Quinney, PhD

**AoIR Ethics 3.0 Compliance:**
This research follows the Association of Internet Researchers (AoIR) Ethics Guidelines 3.0:
- Public data only (no expectation of privacy in public posts)
- No direct contact with or deception of Reddit users
- Anonymization of all user identifiers before analysis
- Aggregated findings only (no individual quotes without additional ethical review)
- Transparent methodology for reproducible research

**Data Handling Compliance:**

> **Policy Compliance:**
> - Responsible Builder Policy, Data Handling and Retention: *"Researchers must not retain copies of data beyond what is strictly necessary for the immediate research project."*[^6]
> - Data will be retained only for the duration of the active research project
> - Responsible Builder Policy: *"Researchers must re-run queries against the most recent data export to ensure findings are up-to-date with any data removals or deletions."*[^6]
> - Our tool re-queries Reddit API for each analysis session rather than maintaining a static database
> - Data API Terms §6: Upon termination, we will *"delete any cached or stored User Content and Materials... This includes any data or models that were derived from User Content"*[^7]

[^6]: Responsible Builder Policy, "Researchers > Data Handling and Retention" section
[^7]: Data API Terms, Section 6 "Termination"

#### 4. No AI/ML Training

> **EXPLICIT COMPLIANCE STATEMENT:**
> - Responsible Builder Policy, "No Unapproved Commercialization or AI Training": *"You must not sell, license, share, or otherwise commercialize Reddit data without express written approval. This extends to commercial and non-commercial mining, scraping, or using data for purposes like ads targeting or to train machine learning or AI models."*[^8]
> - Developer Terms §4.2: Prohibits using Reddit data *"to train large language, artificial intelligence, or other algorithmic models or related services without our permission"*[^9]
> - Data API Terms §2.4: *"no other rights or licenses are granted or implied, including any right to use User Content for other purposes, such as for training a machine learning or AI model, without the express permission of rightsholders"*[^3]
> - Data API Terms §3.2: Prohibits using the API *"to encourage or promote illegal activity or violation of third party rights (including using User Content to train a machine learning or AI model without the express permission of rightsholders)"*[^10]

**Our Commitment:** This research tool performs **qualitative content analysis only**. No machine learning models will be trained on Reddit data. The Claude Desktop integration is for **query assistance only** (helping researchers formulate searches), NOT for training AI on Reddit content.

[^8]: Responsible Builder Policy, "Other Prohibited Practices > No Unapproved Commercialization or AI Training"
[^9]: Developer Terms, Section 4.2 "Other Use Restrictions"
[^10]: Data API Terms, Section 3.2 "Restrictions"

---

## A8. Do you require direct database access?

**Answer:** No

> **Policy Compliance:**
> - We will access data exclusively through the approved Reddit Data API
> - Data API Terms §2.8: *"You will only access (or attempt to access) Data APIs using Access Info described in the Developer Documentation"*[^11]
> - No scraping, crawling, or database access required

[^11]: Data API Terms, Section 2.8 "Permitted Access"

---

## A9. What is your project's estimated timeline and current status?

**Answer:**

### Project Timeline

| Phase | Status | Description |
|-------|--------|-------------|
| **Tool Development** | ✅ Complete | MCP bundle with 5 research tools implemented |
| **IRB Approval** | ✅ Complete | Protocol #28905 approved Oct 31, 2025 |
| **API Access Request** | 🔄 In Progress | This submission |
| **Pilot Data Collection** | Pending | Initial medication search validation |
| **Full Data Collection** | Pending | 6-month collection period |
| **Analysis & Publication** | Pending | Qualitative coding and manuscript preparation |

### Current Status

- **Technical Implementation:** Complete and tested (see repository)
- **IRB Status:** Approved, Exempt Category 4(i)
- **Funding:** Active (NIH/NICHD MPRINT Center, P30HD106451)
- **Prior Submission:** Request #15987717 denied Nov 21, 2025; this is a revised submission addressing compliance concerns

---

## A10. Checkbox: Non-commercial and academic purposes

**Answer:** ☑️ I understand that my research must be non-commercial and for academic purposes only.

> **Policy Compliance:**
> - Responsible Builder Policy, Researchers Section: *"granted access solely for non-commercial purposes"*[^2]
> - Developer Terms §4.1: Commercial use requires *"express written approval"*[^12]
> - This research is:
>   - Funded by federal grants (NIH/NICHD), not commercial sponsors
>   - Conducted at a non-profit academic institution
>   - Intended for peer-reviewed publication, not commercial products
>   - Not generating revenue from Reddit data

[^12]: Developer Terms, Section 4.1 "Commercial Use Restrictions"

---

## A11. Checkbox: No content manipulation

**Answer:** ☑️ If granted access, I agree not to perform any content manipulation on the site including submitting posts, comments, or upvoting through the API.

> **Policy Compliance:**
> - Responsible Builder Policy, "Prohibited Bot Activities": *"Bots must not manipulate Reddit's features (e.g., voting, karma) or circumvent safety mechanisms"*[^13]
> - Developer Terms §4.2: Prohibits actions that *"spam, incentivize, or harass Users"*[^9]
> - Our tool is **READ-ONLY**:
>   - No posting capability implemented
>   - No commenting capability implemented
>   - No voting capability implemented
>   - No messaging capability implemented
>   - OAuth scopes requested: `read` only

[^13]: Responsible Builder Policy, "Bots and Automated Activity > Prohibited Bot Activities"

---

## A12. Attachments

**Attachments to include with submission:**

1. **IRB Approval Letter** - Protocol #28905 (IRB_28905.pdf)
2. **Source Code Repository** - https://github.com/stharrold/erkinney-mcp
3. **Privacy Documentation** - mcp-bundle-reddit-research/PRIVACY.md
4. **This Compliance Document** - reddit-answers.md

---

# Part B: Developer Form Questions

**Form URL:** https://support.reddithelp.com/hc/en-us/requests/new?ticket_form_id=14868593862164
**Role Selection:** "I'm a developer"

> **Note:** The Developer form may be used as a fallback if the Researcher form is unavailable or if Reddit directs us to this path. These answers are provided for completeness.

---

## B1. What do you need assistance with?

**Answer:** API Access Request

---

## B2. Your email address

**Answer:** emkinney@iu.edu (preferred) or samuel.harrold@gmail.com (developer)

> **Policy Compliance:**
> - Developer Terms §1.3: *"Reddit may ask you to provide us with information about your App... and yourself (e.g., your name and email)... This information must be up to date and accurate at all times."*[^14]

[^14]: Developer Terms, Section 1.3 "Your Information"

---

## B3. Which role best describes your reason for requesting API access?

**Answer:** I'm a developer

---

## B4. What is your inquiry?

**Answer:** I'm a developer and want to build a Reddit App that does not work in the Devvit ecosystem.

> **Policy Compliance:**
> - Responsible Builder Policy, Developers Section: *"Developers should use the Developer Platform ('Devvit') to build apps on Reddit... If your use case is not supported by Devvit, file a ticket here."*[^15]
> - This is a research data collection tool, not an interactive Reddit application, making Devvit unsuitable (see B8 for details)

[^15]: Responsible Builder Policy, "Developers" section

---

## B5. Reddit account name

**Answer:** stharrold (developer) or [new account to be created by Dr. Kinney]

> **Policy Compliance:**
> - Responsible Builder Policy, Introduction: *"You must not misrepresent or mask how or why you are accessing Reddit data. This prohibits registering multiple accounts or submitting multiple requests for the same use case."*[^16]
> - We are transparent about both developer and researcher identities

[^16]: Responsible Builder Policy, "Introduction"

---

## B6. What benefit/purpose will the bot/app have for Redditors?

**Answer:**

### Academic Research Tool - Pregnancy Medication Safety

This tool supports Indiana University's NIH-funded research examining medication discussions in pregnancy communities. Benefits to Reddit and Redditors include:

1. **Advancing Public Health Knowledge**
   - Research findings will improve understanding of how pregnant individuals seek medication information
   - Results will be published in peer-reviewed journals accessible to healthcare providers
   - May lead to improved patient education materials

2. **Respecting User Privacy**
   - All usernames automatically anonymized via SHA-256 hashing[^4]
   - No individual users identifiable in any publications
   - Public data only; no private message access

3. **Minimal Platform Impact**
   - READ-ONLY access (no posting, commenting, or voting)
   - Rate-limited to 60 requests/minute with token bucket algorithm[^17]
   - LRU caching reduces redundant API calls[^18]

4. **Transparent Methodology**
   - Open-source code available for audit: https://github.com/stharrold/erkinney-mcp
   - IRB-approved research protocol (#28905)
   - AoIR Ethics 3.0 compliant

> **Policy Compliance:**
> - Developer Terms §3.2: *"You are solely responsible for your App (including its development, operation, maintenance, support, distribution, use, and App Content)"*[^19]
> - We maintain full documentation and support for this research tool

[^17]: Implementation: `mcp-bundle-reddit-research/src/utils/rate-limiter.js`
[^18]: Implementation: `mcp-bundle-reddit-research/src/utils/cache.js`
[^19]: Developer Terms, Section 3.2 "App Users"

---

## B7. Provide a detailed description of what the Bot/App will be doing on the Reddit platform

**Answer:**

### TECHNICAL DESCRIPTION - READ-ONLY ACADEMIC RESEARCH TOOL

This application is a command-line research tool that performs **READ-ONLY** data collection from public Reddit posts and comments. It will **NOT** post, comment, vote, send messages, or interact with Reddit content in any way.

---

#### OPERATION 1: Search Public Posts (`search_reddit_threads`)

**Purpose:** Find medication-related discussions in pregnancy subreddits

**API Endpoint:**
```
GET /search.json?q={medication}+subreddit:{subreddit}&t=all&sort=relevance&limit=100
```

**Example Query:**
- Medication: "ondansetron" (anti-nausea medication)
- Subreddits: r/pregnant, r/babybumps
- Date range: January 2021 - December 2023

**Data Returned (with anonymization):**
```json
{
  "thread_id": "t3_abc123",
  "title": "Ondansetron during first trimester?",
  "author_hash": "a7b3c9d2",
  "subreddit": "pregnant",
  "created_utc": "2022-03-15T14:23:00Z",
  "num_comments": 47,
  "score": 89
}
```

> **Policy Compliance:**
> - Data API Terms §2.9: *"Reddit may set and enforce limits on your use of the Data APIs"*[^20]
> - We respect all rate limits and implement our own conservative limits (60 req/min)
> - Data API Terms §2.4: User Content is *"owned by Users and not by Reddit"*[^3] - we do not claim ownership

[^20]: Data API Terms, Section 2.9 "API Limitations"

---

#### OPERATION 2: Retrieve Thread Content (`get_thread_details`)

**Purpose:** Get full thread content including comments for qualitative analysis

**API Endpoint:**
```
GET /r/{subreddit}/comments/{thread_id}.json
```

**Data Processing:**
1. Retrieve thread and comments
2. **Immediately anonymize all usernames** via SHA-256 hash
3. Store only anonymized data locally
4. Never store original usernames

> **Policy Compliance:**
> - Responsible Builder Policy: *"you must never attempt to re-identify, de-anonymize, or reverse engineer data about Redditors"*[^5]
> - SHA-256 hashing is one-way; original usernames cannot be recovered
> - Unique salt per study prevents cross-study correlation

---

#### OPERATION 3: Batch Search (`batch_search_medications`)

**Purpose:** Efficiently search multiple medications across subreddits

**Process:**
```
For each medication in [ondansetron, amoxicillin, levothyroxine, ...]:
    1. Execute search query
    2. Wait for rate limit token
    3. Store anonymized results
    4. Log progress for researcher
```

> **Policy Compliance:**
> - Responsible Builder Policy: *"You must not circumvent or exceed access limits or engage in excessive usage that disrupts our APIs"*[^16]
> - Token bucket rate limiting ensures we never exceed 60 requests/minute
> - Exponential backoff on 429 errors

---

#### OPERATION 4: Get Subreddit Info (`get_subreddit_info`)

**Purpose:** Document research context (subscriber count, rules, description)

**API Endpoint:**
```
GET /r/{subreddit}/about.json
```

**Data Returned:**
- Subreddit name and description
- Subscriber count
- Community rules (to cite in methodology)
- Public/private status

> **Policy Compliance:**
> - This is metadata about the subreddit, not user data
> - Used for contextualizing research findings in publications

---

#### OPERATION 5: Export Data (`export_research_data`)

**Purpose:** Export anonymized data for analysis in NVivo/Atlas.ti

**Export Formats:**
- CSV (for Excel/SPSS)
- JSON (for custom tools)

**Privacy Enforcement:**
- All exports contain anonymized author hashes only
- No original usernames ever written to export files
- Export includes timestamp for data freshness tracking

> **Policy Compliance:**
> - Data API Terms §6: Upon project completion, we will delete all cached data[^7]
> - Responsible Builder Policy: Researchers must *"not retain copies of data beyond what is strictly necessary"*[^6]

---

#### RATE LIMITING IMPLEMENTATION

```javascript
// Token bucket: 60 tokens, refill 1/second
const rateLimiter = {
  tokens: 60,
  maxTokens: 60,
  refillRate: 1, // per second
  lastRefill: Date.now()
};

// Before each API call:
await rateLimiter.consume(1);
```

> **Policy Compliance:**
> - Data API Terms §3.2: Prohibits *"circumvent or exceed limitations on calls and use of the Data APIs... or otherwise use the Data APIs in a manner that would constitute excessive or abusive usage"*[^10]
> - Developer Terms §4.2: Prohibits *"circumvent or exceed reasonable limitations on calls and use of Reddit Services and Data"*[^9]

---

#### WHAT THIS TOOL DOES NOT DO

| Action | Supported? | Policy Reference |
|--------|------------|------------------|
| Post content | ❌ NO | Responsible Builder Policy §Prohibited Bot Activities[^13] |
| Comment on posts | ❌ NO | Responsible Builder Policy §Prohibited Bot Activities[^13] |
| Vote on content | ❌ NO | Responsible Builder Policy §Prohibited Bot Activities[^13] |
| Send messages | ❌ NO | Responsible Builder Policy §Bot Transparency[^21] |
| Access private messages | ❌ NO | Only public data collected |
| Train AI/ML models | ❌ NO | Developer Terms §4.2, Data API Terms §2.4, §3.2[^9][^3][^10] |
| Commercial use | ❌ NO | Developer Terms §4.1[^12] |
| Store original usernames | ❌ NO | Responsible Builder Policy §Privacy[^5] |
| Circumvent rate limits | ❌ NO | Data API Terms §3.2[^10] |

[^21]: Responsible Builder Policy, "Bots and Automated Activity > Bot Transparency"

---

## B8. What is missing from Devvit that prevents building on that platform?

**Answer:**

### Why Devvit Is Not Suitable for This Use Case

Devvit is Reddit's platform for building **interactive Reddit applications** (bots, games, widgets). This research tool has fundamentally different requirements:

| Requirement | Devvit | This Tool |
|-------------|--------|-----------|
| **Execution Location** | Reddit's infrastructure | Researcher's local machine |
| **Purpose** | Interactive Reddit features | Offline data analysis |
| **User Interaction** | Real-time with Redditors | None (read-only) |
| **Data Export** | Limited | Full export to NVivo/Atlas.ti |
| **IRB Compliance** | Not designed for research | Built for IRB requirements |
| **Integration** | Reddit-only | Claude Desktop + external tools |

**Specific Technical Reasons:**

1. **IRB Requires Local Data Storage**
   - IRB Protocol #28905 requires data to remain on researcher's institutional systems
   - Devvit apps run on Reddit's infrastructure, not researcher machines
   - Anonymization must occur before any storage; this requires local execution

2. **Research Tool Integration**
   - Researchers use NVivo, Atlas.ti, SPSS for qualitative and statistical analysis
   - These tools require local file exports (CSV, JSON)
   - Devvit is designed for in-Reddit experiences, not external tool integration

3. **Claude Desktop MCP Protocol**
   - Tool uses Model Context Protocol (MCP) for natural language research queries
   - MCP servers run locally via stdio transport
   - Not compatible with Devvit's architecture

4. **No Reddit User Interaction**
   - This tool never interacts with Reddit users
   - No posts, comments, votes, or messages
   - Devvit's value proposition (interactive apps) doesn't apply

> **Policy Compliance:**
> - Responsible Builder Policy, Developers Section: *"If your use case is not supported by Devvit, file a ticket here."*[^15]
> - We are filing this ticket because Devvit does not support offline academic research tools

---

## B9. Provide a link to source code or platform that will access the API

**Answer:** https://github.com/stharrold/erkinney-mcp

### Repository Contents

```
mcp-bundle-reddit-research/
├── index.js                    # MCP server entry point
├── src/
│   ├── auth.js                # Reddit OAuth 2.0 authentication
│   ├── tools/                 # 5 MCP research tools
│   │   ├── search.js          # search_reddit_threads
│   │   ├── thread-details.js  # get_thread_details
│   │   ├── batch-search.js    # batch_search_medications
│   │   ├── export.js          # export_research_data
│   │   └── subreddit-info.js  # get_subreddit_info
│   ├── privacy/
│   │   └── anonymize.js       # SHA-256 username hashing
│   └── utils/
│       ├── cache.js           # LRU caching (100 items)
│       └── rate-limiter.js    # Token bucket (60 req/min)
├── docs/
│   └── CLAUDE_SETUP.md        # Setup instructions
├── PRIVACY.md                  # Privacy documentation
└── tests/
    └── basic.test.js          # Jest test suite
```

**License:** MIT (open source, auditable)

> **Policy Compliance:**
> - Developer Terms §2.2: *"Reddit may monitor your use of Developer Services... and audit your App"*[^22]
> - Our code is fully open source and available for audit
> - Data API Terms §8.1: We will maintain confidentiality of any Reddit confidential information[^23]

[^22]: Developer Terms, Section 2.2 "Audit Right"
[^23]: Data API Terms, Section 8.1 "Confidentiality"

---

## B10. What subreddits do you intend to use the bot/app in?

**Answer:**

| Subreddit | Subscribers | Research Relevance |
|-----------|-------------|-------------------|
| r/pregnant | ~235,000 | Primary pregnancy community |
| r/babybumps | ~350,000 | Large pregnancy support community |
| r/beyondthebump | ~275,000 | Postpartum discussions |
| r/tryingforababy | ~130,000 | Pre-conception medication discussions |

**Usage Pattern:** READ-ONLY data collection from public posts and comments. No posting, commenting, voting, or community interaction.

> **Policy Compliance:**
> - Responsible Builder Policy, Bot Transparency: *"Bots should have a clearly specified purpose and scope of access, only accessing the subreddits and API actions they need and which are permitted."*[^21]
> - We access only these four pregnancy-related subreddits relevant to our research questions
> - No "discovery" or exploratory access to other subreddits

---

## B11. What username will you be operating this bot/app under?

**Answer:** stharrold (developer account) or [institutional account to be created]

> **Policy Compliance:**
> - Developer Terms §1.4: *"You will only access (or attempt to access) and use the Developer Services through... access controls that are authorized and made available to you by Reddit"*[^24]
> - Developer Terms §1.4: *"You may not share your Access Info with any other third party without Reddit's permission"*[^24]
> - API credentials will be stored securely in macOS Keychain, not in code

[^24]: Developer Terms, Section 1.4 "Access Info"

---

## B12. Attachments

**Attachments to include with submission:**

1. **IRB Approval Letter** - IRB_28905.pdf
2. **Privacy Policy Documentation** - mcp-bundle-reddit-research/PRIVACY.md
3. **This Compliance Document** - reddit-answers.md

---

# Appendix: Policy Compliance Matrix

| Policy Requirement | Section | Our Implementation | Status |
|-------------------|---------|-------------------|--------|
| Approval required before API access | Responsible Builder Policy, Introduction | Submitting this formal request | ✅ |
| Be transparent | Responsible Builder Policy, Introduction | Full disclosure of purpose, open source code | ✅ |
| Respect rate limits | Responsible Builder Policy, Introduction | 60 req/min token bucket + backoff | ✅ |
| No AI/ML training | Responsible Builder Policy, Prohibited Practices | Qualitative analysis only, no model training | ✅ |
| No re-identification | Responsible Builder Policy, Privacy | SHA-256 anonymization, no off-platform matching | ✅ |
| Non-commercial use | Responsible Builder Policy, Researchers | Academic research only, NIH-funded | ✅ |
| Data retention limits | Responsible Builder Policy, Researchers | Delete upon project completion | ✅ |
| Re-run queries for freshness | Responsible Builder Policy, Researchers | Real-time API queries, no static database | ✅ |
| Comply with Data API Terms | Developer Terms §2.4 | Reviewed and compliant | ✅ |
| App Review cooperation | Developer Terms §3.1 | Will cooperate fully | ✅ |
| User Content attribution | Developer Terms §5.2 | Links back to Reddit, anonymized author | ✅ |
| Privacy policy | Developer Terms §7.2 | PRIVACY.md in repository | ✅ |
| Security measures | Developer Terms §7.4 | Keychain storage, local execution only | ✅ |
| Delete data on termination | Data API Terms §6 | Will delete all cached data | ✅ |

---

# Appendix: Attachments

The following documents are available for review:

1. **IRB Approval** - `IRB_28905.pdf`
   - Protocol #28905, Exempt Category 4(i)
   - Indiana University IRB
   - Approved October 31, 2025

2. **Source Code** - https://github.com/stharrold/erkinney-mcp
   - Complete implementation
   - MIT License (open source)
   - Includes test suite

3. **Privacy Documentation** - `mcp-bundle-reddit-research/PRIVACY.md`
   - SHA-256 anonymization details
   - Data handling procedures
   - Retention policy

4. **Technical Documentation**
   - `mcp-bundle-reddit-research/README.md` - Setup and usage
   - `mcp-bundle-reddit-research/docs/CLAUDE_SETUP.md` - Claude Desktop integration

---

# Footnotes

<!-- Footnotes are rendered inline above; this section for reference -->

**Responsible Builder Policy** (Updated 10 days ago as of Nov 21, 2025)
- URL: https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy

**Developer Terms** (Effective September 24, 2024)
- URL: https://redditinc.com/policies/developer-terms

**Data API Terms** (Effective June 19, 2023)
- URL: https://redditinc.com/policies/data-api-terms

---

*Document prepared for Reddit API Access Request*
*Research Contact: Emily Kinney, emkinney@iu.edu*
*Developer Contact: Samuel Harrold, samuel.harrold@gmail.com*
*Repository: https://github.com/stharrold/erkinney-mcp*
