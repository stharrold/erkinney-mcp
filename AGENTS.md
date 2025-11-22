# AGENTS.md

Cross-tool AI configuration for this repository. Synced from CLAUDE.md.

## What This Repository Is

**MCP research toolkit for pregnancy medication studies (IRB Protocol #28905)**:
- Reddit Research MCP Bundle (`mcp-bundle-reddit-research/`) - Node.js MCP server
- IRB-compliant SHA-256 anonymization and exports for NVivo/Atlas.ti
- Workflow automation skills (`.claude/skills/`) - Python stdlib-only

## Essential Commands

### MCP Bundle (`mcp-bundle-reddit-research/`)

```bash
cd mcp-bundle-reddit-research
npm install && npm test        # Setup and verify
npm run lint                   # ESLint
npm run test:coverage          # Coverage report
```

### Workflow Skills

```bash
python .claude/skills/bmad-planner/scripts/create_planning.py <slug> <gh-user>
python .claude/skills/git-workflow-manager/scripts/create_worktree.py feature <slug> contrib/<user>
python .claude/skills/quality-enforcer/scripts/run_quality_gates.py
python .claude/skills/git-workflow-manager/scripts/pr_workflow.py full
```

## Quality Gates

| Gate | Threshold |
|------|-----------|
| Coverage | ≥80% lines/functions, ≥75% branches |
| Tests | All pass (Jest for Node.js) |
| Linting | ESLint clean |
| TODO Frontmatter | Valid YAML in all TODO*.md |

## Critical Requirements

### IRB Compliance

**REQUIRED**: `ANONYMIZATION_SALT` environment variable (no default)
- SHA-256 username anonymization (8-char truncated hash)
- Public data only, no private messages

### Commit Messages

Format: `type: description (#ISSUE)` - issue reference required

### Branch Structure

```
main ← develop ← contrib/<user> ← feature/*
```

**PR Flow**: feature → contrib → develop → main

## Guidelines

- End on editable branch (`contrib/*`), never `develop` or `main`
- Prefer editing existing files over creating new ones
- Pin exact versions: `"pkg": "1.0.0"` not `"^1.0.0"`
- Follow PR sequence: finish-feature → archive-todo → sync-agents → start-develop
