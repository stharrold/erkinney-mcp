# MPRINT Research Toolkit

[![Tests](https://github.com/stharrold/erkinney-mcp/actions/workflows/tests.yml/badge.svg)](https://github.com/stharrold/erkinney-mcp/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-3.12%2B-blue)](https://www.python.org/)

**MCP research toolkit for pregnancy medication studies.** Aggregates data from social media (Reddit), academic databases (PubMed, Scholar), government sources (FDA, CDC), and clinical platforms. Features IRB-compliant anonymization and structured exports for qualitative analysis tools (NVivo, Atlas.ti).

**Research Contact**: emkinney@iu.edu
**Development Contact**: samuel.harrold@gmail.com

---

## 🚀 Quick Start

### Reddit Research MCP Bundle

The primary component is a Model Context Protocol (MCP) server for collecting Reddit discussions about pregnancy medications.

```bash
cd mcp-bundle-reddit-research
npm install
cp .env.example .env
# Edit .env with your Reddit API credentials
npm test
npm start
```

**Full setup guide**: [mcp-bundle-reddit-research/README.md](mcp-bundle-reddit-research/README.md)

### For Claude Code Development

This repository includes a complete workflow automation system with 9 specialized skills. See [CLAUDE.md](CLAUDE.md) for detailed instructions.

---

## 📦 What's Included

### 1. Reddit Research MCP Bundle (`mcp-bundle-reddit-research/`)

Production-ready MCP server with 5 research tools:

- **search_reddit_threads** - Search medication discussions with filters
- **get_thread_details** - Retrieve full thread content with comments
- **batch_search_medications** - Multi-medication search with progress tracking
- **export_research_data** - Export to JSON/CSV with anonymization
- **get_subreddit_info** - Subreddit metadata and rules

**Key Features:**
- ✅ IRB-compliant SHA-256 anonymization
- ✅ AoIR Ethics 3.0 framework compliance
- ✅ Rate limiting (60 req/min) with automatic retry
- ✅ LRU caching to reduce API calls
- ✅ OAuth 2.0 authentication with Reddit API
- ✅ Export formats: JSON, CSV

**Documentation:**
- [README.md](mcp-bundle-reddit-research/README.md) - Setup and usage
- [PRIVACY.md](mcp-bundle-reddit-research/PRIVACY.md) - Privacy protection
- [CLAUDE_SETUP.md](mcp-bundle-reddit-research/docs/CLAUDE_SETUP.md) - Claude Desktop configuration
- [Examples](mcp-bundle-reddit-research/examples/) - Complete workflows

### 2. Workflow Automation System (`.claude/skills/`)

Nine specialized skills for automated development workflow:

| Skill | Purpose |
|-------|---------|
| **workflow-orchestrator** | Coordinates 6-phase development workflow |
| **bmad-planner** | Business Model Architecture Document creation |
| **speckit-author** | Technical specification generation |
| **git-workflow-manager** | Automated git operations (worktrees, releases, versioning) |
| **quality-enforcer** | Test coverage and quality gates |
| **tech-stack-adapter** | Auto-detects project technology stack |
| **workflow-utilities** | Shared utilities (archiving, validation) |
| **agentdb-state-manager** | Persistent state with DuckDB |
| **initialize-repository** | Bootstrap new projects with full workflow |

**Slash Commands:**
- `/specify [description]` - Create feature specification
- `/plan [details]` - Generate design artifacts
- `/tasks [context]` - Create dependency-ordered task list

### 3. Standalone Tools (`tools/`)

Python utilities for git and workflow management:
- `tools/git-helpers/` - Worktree creation, semantic versioning
- `tools/workflow-utilities/` - Archive management, directory validation

---

## 📂 Repository Structure

```
erkinney-mcp/
├── mcp-bundle-reddit-research/   # ✅ Reddit Research MCP Bundle (v1.1.0)
│   ├── src/                       # Source code (auth, tools, privacy, utils)
│   ├── tests/                     # Jest test suite
│   ├── docs/                      # Setup documentation
│   ├── examples/                  # Usage examples
│   ├── resources/                 # Medication templates, ethics guidelines
│   └── index.js                   # MCP server entry point
├── .claude/
│   ├── commands/                  # Slash commands (specify, plan, tasks)
│   └── skills/                    # 9 workflow automation skills
├── tools/                         # Standalone Python utilities
├── .github/workflows/             # CI/CD (Python + Node.js support)
├── ARCHIVED/                      # Historical implementation prompts
├── .tmp/                          # Reference implementations (not for production)
├── CLAUDE.md                      # 📖 Guide for Claude Code instances
├── CONTRIBUTING.md                # 📖 Contribution guidelines
├── CHANGELOG.md                   # 📖 Version history
└── README.md                      # 📖 This file
```

---

## 🔬 Research Use Case

This toolkit supports health communication research on pregnancy medication experiences:

1. **Data Collection**: Search Reddit for medication discussions (e.g., ondansetron, levothyroxine)
2. **Privacy Protection**: Automatic SHA-256 anonymization of usernames
3. **Export**: CSV/JSON formats compatible with NVivo and Atlas.ti
4. **Analysis**: Qualitative analysis of patient experiences and concerns

**Supported Subreddits**: r/pregnant, r/babybumps, r/beyondthebump, r/tryingforababy

---

## 🛠️ Technology Stack

**MCP Bundle:**
- Node.js 18+ with ES modules
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) 0.5.0
- [snoowrap](https://github.com/not-an-aardvark/snoowrap) (Reddit API client)
- Jest for testing

**Workflow System:**
- Python 3.12+ (standard library only)
- uv for dependency management
- DuckDB for state management
- GitHub CLI (gh) for automation

---

## 📊 Current Status

**Latest Release**: [v1.1.0](https://github.com/stharrold/erkinney-mcp/releases/tag/v1.1.0) - Reddit Research MCP Bundle

**Implemented:**
- ✅ Complete Reddit Research MCP Bundle with 5 tools
- ✅ IRB-compliant privacy protection (SHA-256 anonymization)
- ✅ 9-skill workflow automation system
- ✅ CI/CD for Python and Node.js projects
- ✅ Comprehensive documentation

**Planned:**
- 🔲 PubMed research MCP bundle
- 🔲 Google Scholar research MCP bundle
- 🔲 FDA/CDC data collection tools
- 🔲 Integrated multi-source research dashboard

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development workflow (git-flow + GitHub-flow hybrid)
- Branch strategy (main → develop → contrib/username → feature/*)
- Commit message conventions
- Quality gates and testing requirements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Research Inquiries**: emkinney@iu.edu (Dr. Erin Kinney)
- **Technical Support**: samuel.harrold@gmail.com (Sam Harrold)
- **Issues**: [GitHub Issues](https://github.com/stharrold/erkinney-mcp/issues)

---

## 🙏 Acknowledgments

- Built with [Model Context Protocol](https://modelcontextprotocol.io/)
- Reddit data via [snoowrap](https://github.com/not-an-aardvark/snoowrap)
- Ethics framework: [AoIR Ethics 3.0](https://aoir.org/reports/ethics3.pdf)
- Developed with [Claude Code](https://claude.com/claude-code)

---

**For detailed documentation:**
- Claude Code users: See [CLAUDE.md](CLAUDE.md)
- MCP Bundle users: See [mcp-bundle-reddit-research/README.md](mcp-bundle-reddit-research/README.md)
- Contributors: See [CONTRIBUTING.md](CONTRIBUTING.md)
- Version history: See [CHANGELOG.md](CHANGELOG.md)
