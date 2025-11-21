# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MCP research toolkit for pregnancy medication studies. Aggregates data from social media, academic databases (PubMed, Scholar), government sources (FDA, CDC), and clinical platforms. Features IRB-compliant anonymization and structured exports for NVivo/Atlas.ti.

**Contact**: emkinney@iu.edu (Research), samuel.harrold@gmail.com (Development)

## Current Status

**Latest Release**: [v1.1.0](https://github.com/stharrold/erkinney-mcp/releases/tag/v1.1.0) - Reddit Research MCP Bundle

**Repository Phase**: Production - MCP Bundle deployed, comprehensive documentation complete

**What exists**:
- ✅ Complete 9-skill workflow system in `.claude/skills/`
- ✅ Git workflow automation tools in `tools/`
- ✅ CI/CD pipelines configured (GitHub Actions, Azure Pipelines)
- ✅ Branch structure established (main, develop, contrib/stharrold)
- ✅ **Comprehensive documentation** (README.md, CONTRIBUTING.md, CHANGELOG.md, issue templates)
- ✅ **Reddit Research MCP Bundle** in `mcp-bundle-reddit-research/` (GitHub Issue #1)
  - 5 MCP tools for pregnancy medication research
  - IRB-compliant SHA-256 anonymization (required env var)
  - Rate limiting (60 req/min) and LRU caching (100 items)
  - OAuth 2.0 authentication with Reddit API
  - Export to JSON/CSV formats
  - Complete test infrastructure with Jest
  - Privacy documentation (PRIVACY.md) and ethics guidelines (AoIR Ethics 3.0)

**Reference materials**:
- `.tmp/mcp-bundle-mprint/` - Alternative MCP bundle architecture
- `.tmp/stharrold-templates/` - Workflow skill templates (see `.tmp/README.md`)

**Documentation resources**:
- [README.md](README.md) - Project overview with quick start
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development workflow and contribution guidelines
- [CHANGELOG.md](CHANGELOG.md) - Version history (v1.0.0, v1.0.1, v1.1.0)

## MCP Bundle Architecture

The Reddit Research MCP Bundle uses a simplified tool-based architecture:

```
mcp-bundle-reddit-research/
├── index.js              # MCP server entry point
├── src/
│   ├── auth.js          # Reddit OAuth 2.0 authentication
│   ├── tools/           # MCP tools (5 research tools)
│   │   ├── search.js           # search_reddit_threads
│   │   ├── thread-details.js   # get_thread_details
│   │   ├── batch-search.js     # batch_search_medications
│   │   ├── export.js           # export_research_data
│   │   └── subreddit-info.js   # get_subreddit_info
│   ├── privacy/         # Privacy & anonymization
│   │   └── anonymize.js        # SHA-256 username hashing
│   └── utils/           # Shared utilities
│       ├── cache.js            # LRU caching
│       └── rate-limiter.js     # Token bucket rate limiting
├── resources/           # Pre-configured resources
│   ├── medication-templates.json   # Common medications
│   └── ethics-guidelines.json      # AoIR Ethics 3.0
├── docs/                # Documentation
│   └── CLAUDE_SETUP.md         # Claude Desktop setup
└── tests/               # Jest tests
    └── basic.test.js           # Basic infrastructure tests
```

**Key Design Patterns**:
- **Tool-per-file**: Each MCP tool is a self-contained module
- **Shared utilities**: Rate limiting and caching used across all tools
- **Privacy-first**: All usernames anonymized through SHA-256 by default
- **Resource-based configuration**: Pre-configured medication lists and ethics guidelines

## Development Commands

### Workflow Skills (Currently Available)

All workflow automation uses Python scripts in `.claude/skills/`:

```bash
# Planning (Phase 1)
python .claude/skills/bmad-planner/scripts/create_planning.py <slug> <gh-user>

# Worktree Management (Phase 2)
python .claude/skills/git-workflow-manager/scripts/create_worktree.py feature <slug> contrib/<user>

# Specifications (Phase 2)
python .claude/skills/speckit-author/scripts/create_specifications.py <slug> <gh-user>

# Quality Gates (Phase 3)
python .claude/skills/quality-enforcer/scripts/run_quality_gates.py
python .claude/skills/git-workflow-manager/scripts/semantic_version.py develop v1.5.0

# Integration & Cleanup (Phase 4)
python .claude/skills/git-workflow-manager/scripts/cleanup_feature.py <slug> --summary "..." --version "X.Y.Z"
python .claude/skills/git-workflow-manager/scripts/generate_work_items_from_pr.py <pr-number>

# State Management
python .claude/skills/agentdb-state-manager/scripts/init_database.py
python .claude/skills/agentdb-state-manager/scripts/sync_todo_to_db.py

# Utilities
python .claude/skills/workflow-utilities/scripts/archive_manager.py <file>
python .claude/skills/workflow-utilities/scripts/validate_versions.py
```

### MCP Bundle Commands (Reddit Research)

Commands for the Reddit Research MCP Bundle in `mcp-bundle-reddit-research/`:

```bash
# Setup
cd mcp-bundle-reddit-research
npm install                     # Install dependencies
cp .env.example .env            # Create environment file
nano .env                       # Edit with Reddit API credentials

# Testing
npm test                        # Run all tests
npm run test:watch              # Watch mode for development
npm run test:coverage           # Tests with coverage report
npm run lint                    # Run ESLint

# Running the MCP Server
npm start                       # Start MCP server
node index.js                   # Direct server start

# Testing Authentication
node -e "import('./src/auth.js').then(m => m.createRedditClient()).then(() => console.log('✓ Success')).catch(e => console.error('✗ Error:', e.message))"
```

**Claude Desktop Configuration**:
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

Config file locations:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## Key Technical Requirements

### IRB Compliance & Privacy
- **REQUIRED**: `ANONYMIZATION_SALT` environment variable must be set (no default for security)
  - Generate unique salt per study: `openssl rand -hex 16`
  - Never use publicly-known or default salts
  - Prevents hash correlation across studies
- SHA-256 username anonymization (8-character truncated hash)
- Public data only (no private messages)
- No personal health information collection
- Reproducible methodology for research papers
- Auth error messages sanitized to prevent credential leakage

### Data Sources
- Reddit (r/pregnant, r/babybumps, r/beyondthebump, r/tryingforababy)
- PubMed and Google Scholar (academic research)
- FDA and CDC (government sources)
- Clinical platforms

### Export Formats
- CSV (Excel/SPSS)
- JSON (custom tools)
- TSV (statistical software)
- NVivo and Atlas.ti compatible formats

## Testing Strategy

Follow the Test Pyramid:
- **Unit tests** (70%): Domain and application logic
- **Integration tests** (20%): Infrastructure adapters
- **E2E tests** (10%): Critical user journeys

Coverage thresholds: 80% lines, 80% functions, 75% branches

## Workspace Configuration

The project will use npm workspaces:
- `src/domain` - Domain layer package
- `src/application` - Application layer package
- `src/infrastructure` - Infrastructure layer package
- `src/interfaces` - Interfaces layer package

## Version Management

Git tags are the source of truth for versions. Package.json versions are derived from tags.

### Release Workflow
1. Validate: `npm run validate:release v1.0.0`
2. Create tag: `git tag -a v1.0.0 -m "Release v1.0.0: description"`
3. Sync version: `npm run version:sync`
4. Commit: `git commit -m "chore: Update package version to v1.0.0 (#ISSUE)"`
5. Push: `git push origin main && git push origin --tags`
6. Create release: `gh release create v1.0.0 --generate-notes`

## Commit Message Convention

**REQUIRED**: All commit messages must reference at least one GitHub issue.

Supported patterns: `#123`, `fixes #123`, `closes #123`, `resolves #123`, `gh-123`

Format template:
```
[type]: [description] (#ISSUE)

Optional body explaining what and why

Closes #ISSUE
```

Examples:
- `feat: Add medication search functionality (#45)`
- `fix: Resolve memory leak in cache - fixes #67`
- `docs: Update API documentation (#12)`

This will be enforced via Husky Git hooks once development begins.

## Datetime Standards

Always use ISO-8601 datetime stamps in UTC:
- **In file contents**: `YYYY-MM-DDTHH:MM:SSZ` (e.g., `2025-08-31T14:30:00Z`)
- **In filenames/directories**: `YYYYMMDDTHHMMSSZ` (e.g., `20250831T143000Z`)
- Always use 24-hour format with seconds
- Always include Z suffix for UTC

## Semantic Versioning

Follow semver.org:
- MAJOR: Breaking changes, incompatible API changes
- MINOR: New features, backward-compatible functionality
- PATCH: Bug fixes, backward-compatible patches

Examples:
- `1.0.0 → 1.0.1` (bug fix)
- `1.0.1 → 1.1.0` (new feature)
- `1.1.0 → 2.0.0` (breaking change)

Git tags always use `v` prefix (e.g., `v1.2.3`)

## Git Workflow

This repository follows a structured branching workflow:

```
main (production)
  ↑
develop (integration)
  ↑
contrib/stharrold (active development - default branch)
  ↑
feature/* (via worktrees)
```

**Branch Types:**
- `main` - Production branch (protected)
- `develop` - Team integration branch
- `contrib/<username>` - Personal integration branch (HOME/DEFAULT)
- `feat/`, `fix/`, `docs/` - Feature branches for specific work

**PR Flow**: Feature → contrib/username → develop → main

### Worktree Management

Feature branches should be created via worktrees:

```bash
# Create feature worktree (using automation tool)
python3 tools/git-helpers/create_worktree.py feature my-feature contrib/stharrold

# Manual worktree creation
git worktree add ../erkinney-mcp.worktrees/my-feature -b feat/my-feature

# List and cleanup
git worktree list
git worktree remove ../erkinney-mcp.worktrees/my-feature
git worktree prune
```

### Commit Format

All commits must follow this format with GitHub issue references:

```bash
git commit -m "feat: descriptive message

Closes #123

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Types**: feat, fix, docs, style, refactor, test, chore

## Available Slash Commands

Custom commands for this repository (stored in `.claude/commands/`):

### `/plan [implementation details]`
Execute the implementation planning workflow using the plan template to generate design artifacts. Creates research.md, data-model.md, contracts/, quickstart.md, and tasks.md based on feature specification.

### `/specify [feature description]`
Create or update the feature specification from a natural language feature description. Generates a structured spec file following the template format.

### `/tasks [context]`
Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts. Creates numbered tasks (T001, T002, etc.) with parallel execution guidance.

## Workflow Automation Tools

Located in `tools/` directory (stdlib-only Python):

### Git Helpers (`tools/git-helpers/`)
- **create_worktree.py**: Create feature worktrees with proper branch setup
- **semantic_version.py**: Manage semantic versioning for releases

### Workflow Utilities (`tools/workflow-utilities/`)
- **archive_manager.py**: Archive and compress old files
- **directory_structure.py**: Validate directory structure
- **validate_versions.py**: Ensure version consistency across files

```bash
# Examples
python3 tools/git-helpers/semantic_version.py develop v1.0.0
python3 tools/workflow-utilities/archive_manager.py list
python3 tools/workflow-utilities/directory_structure.py src/
python3 tools/workflow-utilities/validate_versions.py
```

## CI/CD Integration

### GitHub Actions (`.github/workflows/`)
- **tests.yml**: Runs on push/PR to main, develop, contrib/stharrold
- **claude.yml**: Claude-based code review automation
- **claude-code-review.yml**: Detailed Claude Code review process

### Azure Pipelines (`azure-pipelines.yml`)
Alternative CI/CD platform with same test suite as GitHub Actions.

## Workflow Skills System

This repository includes **9 specialized skills** in `.claude/skills/` that automate development workflow:

### Core Orchestration

#### workflow-orchestrator
**Purpose**: Main coordinator for the 6-phase development workflow (Planning → Implementation → Quality → Integration → Release → Hotfix)

**Key features**:
- Coordinates all other skills through workflow phases
- Manages TODO file lifecycle
- Handles context checkpoints at 100K tokens
- Token usage: ~200 tokens per phase transition

**When to use**: Claude Code uses this automatically to orchestrate the workflow. Users typically don't call directly.

### Planning & Specification

#### bmad-planner
**Purpose**: Interactive tool for creating Business Model Architecture Documents

**Key features**:
- Three-persona Q&A system (Analyst, Architect, PM)
- Generates requirements.md, architecture.md, epics.md
- Runs on contrib branch (before creating feature worktree)
- Token savings: ~2,300 tokens per feature (92% reduction)

**Usage**:
```bash
python .claude/skills/bmad-planner/scripts/create_planning.py <slug> <gh-user>
```

**Example**:
```bash
python .claude/skills/bmad-planner/scripts/create_planning.py auth-system stharrold
```

#### speckit-author
**Purpose**: Creates detailed technical specifications in feature worktrees

**Key features**:
- Auto-detects planning context from `../planning/<slug>/`
- Adaptive Q&A (5-8 questions with BMAD, 10-15 without)
- Generates plan.md and spec.md
- Creates as-built feedback loop

**Usage**:
```bash
python .claude/skills/speckit-author/scripts/create_specifications.py <slug> <gh-user>
```

**Token savings**: ~1,700-2,700 tokens by reusing BMAD context

### Git & Version Control

#### git-workflow-manager
**Purpose**: Automated git operations for git-flow + GitHub-flow hybrid

**Key features**:
- Worktree creation and cleanup
- Semantic versioning automation
- Daily rebase operations
- Release workflow management
- PR feedback extraction to work-items

**Usage**:
```bash
# Create feature worktree
python .claude/skills/git-workflow-manager/scripts/create_worktree.py feature <slug> contrib/<user>

# Atomic cleanup (archives TODO, deletes worktree and branches)
python .claude/skills/git-workflow-manager/scripts/cleanup_feature.py <slug> --summary "..." --version "X.Y.Z"

# Daily rebase
python .claude/skills/git-workflow-manager/scripts/daily_rebase.py contrib/<user>

# Calculate semantic version
python .claude/skills/git-workflow-manager/scripts/semantic_version.py develop v1.5.0

# Extract PR feedback to work-items
python .claude/skills/git-workflow-manager/scripts/generate_work_items_from_pr.py <pr-number>
```

### Quality & Testing

#### quality-enforcer
**Purpose**: Enforces quality gates before merging

**Key features**:
- Coverage threshold enforcement (≥80%)
- Semantic version validation
- Test suite execution
- Quality report generation

**Usage**:
```bash
python .claude/skills/quality-enforcer/scripts/run_quality_gates.py
```

#### tech-stack-adapter
**Purpose**: Detects project technology stack automatically

**Key features**:
- Auto-detects Python/uv projects
- Identifies web frameworks (FastAPI, Flask, Django)
- Discovers testing frameworks
- Container configuration detection

**Usage**:
```bash
python .claude/skills/tech-stack-adapter/scripts/detect_stack.py
```

### Utilities & State Management

#### workflow-utilities
**Purpose**: Shared utilities for all skills

**Key features**:
- Archive management
- Directory structure validation
- Version consistency checking
- VCS abstraction (GitHub/Azure DevOps)
- Skill creation tools

**Key scripts**:
```bash
# Archive files
python .claude/skills/workflow-utilities/scripts/archive_manager.py <file>

# Validate directory structure
python .claude/skills/workflow-utilities/scripts/directory_structure.py <path>

# Check version consistency
python .claude/skills/workflow-utilities/scripts/validate_versions.py

# Create new skill
python .claude/skills/workflow-utilities/scripts/create_skill.py <skill-name>
```

#### agentdb-state-manager
**Purpose**: Persistent state management using DuckDB for workflow analytics

**Key features**:
- Complex dependency graph queries
- Historical workflow metrics
- Context checkpoint storage/recovery
- State transition analysis

**Usage**:
```bash
# Initialize database
python .claude/skills/agentdb-state-manager/scripts/init_database.py

# Sync TODO files to database
python .claude/skills/agentdb-state-manager/scripts/sync_todo_to_db.py

# Query workflow state
python .claude/skills/agentdb-state-manager/scripts/query_state.py --dependencies
```

**Token savings**: ~2,500 tokens (89% reduction) for complex queries

#### initialize-repository
**Purpose**: Meta-skill for bootstrapping new repositories with complete workflow system

**Key features**:
- Replicates all 9 skills to new repository
- Interactive Q&A for configuration
- Git setup with branch structure
- Remote repository configuration

**Usage**:
```bash
python .claude/skills/initialize-repository/scripts/initialize_repository.py <source> <target>
```

**Example**:
```bash
python .claude/skills/initialize-repository/scripts/initialize_repository.py . ../my-new-project
```

**Token savings**: ~3,350 tokens (96% reduction) vs manual setup

### Workflow Phases

The skills implement a 6-phase development workflow:

1. **Phase 1 (Planning)**: bmad-planner creates requirements, architecture, epics
2. **Phase 2 (Implementation)**: git-workflow-manager creates worktree, speckit-author creates specifications
3. **Phase 3 (Quality)**: quality-enforcer runs tests and coverage checks, git-workflow-manager calculates semantic version
4. **Phase 4 (Integration)**: Create PR, handle feedback via work-items, atomic cleanup with git-workflow-manager
5. **Phase 5 (Release)**: git-workflow-manager handles release creation, tagging, and back-merge
6. **Phase 6 (Hotfix)**: Emergency fixes from main branch

### Skill Integration

Skills work together seamlessly:
- **workflow-orchestrator** coordinates all skills
- **bmad-planner** → **speckit-author** (planning context flows to specifications)
- **git-workflow-manager** → all skills (provides git infrastructure)
- **quality-enforcer** → **git-workflow-manager** (uses semantic_version.py)
- **workflow-utilities** → all skills (shared utilities)
- **agentdb-state-manager** → **workflow-orchestrator** (state tracking)

## Reddit Research MCP Bundle

### ✅ Implemented (GitHub Issue #1)

**Location**: `mcp-bundle-reddit-research/`

**5 MCP Tools**:
1. ✅ `search_reddit_threads` - Search medication discussions with filters
2. ✅ `get_thread_details` - Retrieve full thread content with comments
3. ✅ `batch_search_medications` - Multi-medication search with progress tracking
4. ✅ `export_research_data` - Export to JSON/CSV with anonymization
5. ✅ `get_subreddit_info` - Subreddit metadata and rules

**Technical Implementation**:
- **MCP SDK**: `@modelcontextprotocol/sdk` v0.5.0
- **Reddit API**: `snoowrap` v1.23.0 with OAuth 2.0
- **Anonymization**: SHA-256 hashing (8-char truncated) - automatic
- **Rate Limiting**: Token bucket (60 req/min) with exponential backoff
- **Caching**: LRU cache (100 items) to reduce API calls
- **Testing**: Jest with Node.js ESM support

**Privacy & Ethics**:
- AoIR Ethics 3.0 compliant
- IRB-friendly design with built-in anonymization
- Public data only (no private messages)
- Transparent methodology for reproducible research
- Detailed privacy documentation in `PRIVACY.md`

**Documentation**:
- `mcp-bundle-reddit-research/README.md` - Complete setup and usage guide
- `mcp-bundle-reddit-research/PRIVACY.md` - Privacy protection details
- `mcp-bundle-reddit-research/docs/CLAUDE_SETUP.md` - Claude Desktop configuration
- `mcp-bundle-reddit-research/examples/` - Example research workflows

**Getting Started**:
```bash
cd mcp-bundle-reddit-research
npm install
cp .env.example .env
# Edit .env with Reddit API credentials
npm test  # Verify setup
```

## Repository Structure

```
erkinney-mcp/
├── .claude/
│   ├── commands/           # Slash commands (plan, specify, tasks)
│   └── skills/            # 9 workflow automation skills
│       ├── workflow-orchestrator/
│       ├── bmad-planner/
│       ├── speckit-author/
│       ├── git-workflow-manager/
│       ├── quality-enforcer/
│       ├── tech-stack-adapter/
│       ├── workflow-utilities/
│       ├── agentdb-state-manager/
│       └── initialize-repository/
├── .github/workflows/     # CI/CD pipelines (Python + Node.js)
├── .tmp/                  # Reference implementations
│   ├── mcp-bundle-mprint/    # Reddit MCP reference
│   └── stharrold-templates/  # Workflow system source
├── ARCHIVED/              # Implementation prompts and archived files
├── mcp-bundle-reddit-research/  # ✅ IMPLEMENTED MCP Bundle
│   ├── src/               # MCP tools and utilities
│   ├── tests/             # Jest test suite
│   ├── docs/              # Documentation
│   ├── examples/          # Example workflows
│   ├── resources/         # Pre-configured resources
│   └── index.js           # MCP server entry point
└── tools/                 # Standalone Python utilities
    ├── git-helpers/
    └── workflow-utilities/
```

## MCP Tools Usage Examples

### In Claude Desktop

Once configured, use natural language to invoke tools:

**Example 1: Search for medication discussions**
> Search for discussions about ondansetron in the pregnant subreddit from 2021 to 2023

Claude will use `search_reddit_threads` tool automatically.

**Example 2: Get full thread content**
> Get the full content of thread abc123 including all comments

Claude will use `get_thread_details` tool.

**Example 3: Batch search multiple medications**
> Search for ondansetron, amoxicillin, and levothyroxine in pregnant and BabyBumps subreddits

Claude will use `batch_search_medications` tool.

**Example 4: Export data**
> Export threads abc123, def456, ghi789 to CSV format

Claude will use `export_research_data` tool. Files saved to `exports/` directory.

**See `mcp-bundle-reddit-research/examples/` for complete workflow examples.**

## Contributing to This Repository

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

**Quick reference**:
- Default branch: `contrib/<gh-username>` (always work here or in feature branches)
- Create PRs: `feature/* → contrib/<username> → develop → main`
- Commit format: `type: description (#ISSUE)` - issue reference required
- Testing: ≥80% coverage required (lines/functions), ≥75% branches
- Release notes: Update [CHANGELOG.md](CHANGELOG.md) with each version

**New contributors**:
1. Fork repository
2. Create personal branch: `contrib/your-username` from `develop`
3. Use worktrees for features: `python .claude/skills/git-workflow-manager/scripts/create_worktree.py feature my-feature contrib/your-username`
4. Follow 6-phase workflow (Planning → Implementation → Quality → Integration → Release → Hotfix)
5. See CONTRIBUTING.md for complete workflow details

## Code Quality Standards

**From PR #9 review (all future code should follow)**:
- Use robust date formatting (not string manipulation): `new Date().getFullYear()` etc.
- No stderr suppression in user-facing scripts - show helpful error messages
- Require environment variables for security-sensitive config (no defaults)
- Use `console.log` for info messages, `console.error` only for actual errors
- Sanitize error messages to prevent credential/PII leakage
- Pin exact versions for reproducibility: `"@modelcontextprotocol/sdk": "0.5.0"` not `^0.5.0`
- Use forward slashes in JSON paths even on Windows
- Document privacy/ethics considerations in all data collection features
