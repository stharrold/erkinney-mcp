# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

**MCP research toolkit for pregnancy medication studies (IRB Protocol #28905)**:
- Reddit Research MCP Bundle (`mcp-bundle-reddit-research/`) - Node.js MCP server
- IRB-compliant SHA-256 anonymization and exports for NVivo/Atlas.ti
- Workflow automation skills (`.claude/skills/`) - Python stdlib-only

**Contacts**: emkinney@iu.edu (Research PI), samuel.harrold@gmail.com (Development)

## Essential Commands

### MCP Bundle (`mcp-bundle-reddit-research/`)

```bash
# From repo root (Node.js >=18 required)
npm --prefix mcp-bundle-reddit-research install
npm --prefix mcp-bundle-reddit-research test
npm --prefix mcp-bundle-reddit-research run test:watch    # Watch mode
npm --prefix mcp-bundle-reddit-research run test:coverage
npm --prefix mcp-bundle-reddit-research run lint
npm --prefix mcp-bundle-reddit-research start             # Run MCP server

# Run single test (from mcp-bundle-reddit-research/)
node --experimental-vm-modules node_modules/jest/bin/jest.js tests/basic.test.js

# Keychain credentials (macOS)
npm --prefix mcp-bundle-reddit-research run keychain:setup
npm --prefix mcp-bundle-reddit-research run start:keychain
```

### Workflow Skills (`.claude/skills/`)

```bash
# Planning (Phase 1 - main repo)
python .claude/skills/bmad-planner/scripts/create_planning.py <slug> <gh-user>

# Implementation (Phase 2 - worktree)
python .claude/skills/git-workflow-manager/scripts/create_worktree.py feature <slug> contrib/<user>
python .claude/skills/speckit-author/scripts/create_specifications.py <slug> <gh-user>

# Quality (Phase 3)
python .claude/skills/quality-enforcer/scripts/run_quality_gates.py

# PR Workflow (Phase 4) - run in sequence or use 'full'
python .claude/skills/git-workflow-manager/scripts/pr_workflow.py finish-feature
python .claude/skills/git-workflow-manager/scripts/pr_workflow.py archive-todo
python .claude/skills/git-workflow-manager/scripts/pr_workflow.py sync-agents
python .claude/skills/git-workflow-manager/scripts/pr_workflow.py start-develop
python .claude/skills/git-workflow-manager/scripts/pr_workflow.py full  # All steps

# Cleanup
python .claude/skills/git-workflow-manager/scripts/cleanup_feature.py <slug> --summary "..." --version "X.Y.Z"
```

## Quality Gates (all must pass before PR)

| Gate | Threshold |
|------|-----------|
| Coverage | ≥80% lines/functions, ≥75% branches |
| Tests | All pass (Jest for Node.js) |
| Linting | ESLint clean |
| TODO Frontmatter | Valid YAML in all TODO*.md |
| AI Config Sync | CLAUDE.md → AGENTS.md |

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/specify` | Create/update feature specification |
| `/plan` | Generate design artifacts |
| `/tasks` | Create dependency-ordered tasks.md |
| `/workflow` | Execute PR workflow steps |

## Critical Requirements

### IRB Compliance & Privacy

**REQUIRED**: `ANONYMIZATION_SALT` environment variable (no default)
- Generate: `openssl rand -hex 16`
- SHA-256 username anonymization (8-char truncated hash)
- Public data only, no private messages

### Commit Messages

Format: `type: description (#ISSUE)` - issue reference required

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### TODO*.md Frontmatter

```yaml
---
status: in_progress|completed|blocked
feature: feature-name
branch: feature/timestamp_slug
---
```

## Branch Structure

```
main (production) ← develop (integration) ← contrib/<user> (active) ← feature/*
```

**PR Flow**: feature → contrib → develop → main

| Branch | Direct Commits |
|--------|----------------|
| `feature/*`, `contrib/*` | Yes |
| `develop`, `main` | PRs only |

## MCP Bundle Architecture

```
mcp-bundle-reddit-research/
├── index.js              # MCP server entry (stdio transport)
├── src/
│   ├── auth.js          # Reddit OAuth singleton (auth.js:15)
│   ├── tools/           # 5 MCP tools (tool-per-file)
│   ├── privacy/         # SHA-256 anonymization
│   └── utils/           # LRU cache (cache.js:16), rate limiter (rate-limiter.js:38)
└── resources/           # Medication templates, ethics guidelines
```

**Key patterns**:
- ES Modules (`"type": "module"`) - imports need `.js` extension
- Privacy-by-default: usernames auto-anonymized
- Rate limiting: 60 req/min token bucket

**5 MCP Tools**: `search_reddit_threads`, `get_thread_details`, `batch_search_medications`, `export_research_data`, `get_subreddit_info`

## Skills System (9 skills)

| Skill | Purpose |
|-------|---------|
| workflow-orchestrator | Main coordinator |
| git-workflow-manager | Worktrees, PRs, versioning |
| quality-enforcer | Quality gates |
| bmad-planner | Requirements + architecture |
| speckit-author | Specifications |
| tech-stack-adapter | Stack detection |
| workflow-utilities | Archive, validation |
| agentdb-state-manager | DuckDB state |
| initialize-repository | Bootstrap repos |

## Guidelines

- End on editable branch (`contrib/*`), never `develop` or `main`
- Prefer editing existing files over creating new ones
- Follow PR sequence: finish-feature → archive-todo → sync-agents → start-develop
- Pin exact versions: `"pkg": "1.0.0"` not `"^1.0.0"`

## Standards

- **Datetime**: ISO-8601 UTC (`2025-08-31T14:30:00Z`, filenames: `20250831T143000Z`)
- **Versioning**: semver with `v` prefix tags (`v1.2.3`)

## Reference

- `WORKFLOW.md` - 6-phase workflow guide
- `AGENTS.md` - Cross-tool AI config
- `mcp-bundle-reddit-research/README.md` - MCP bundle setup
