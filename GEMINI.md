# GEMINI.md

This file provides guidance to Gemini Code (gemini.ai/code) when working with code in this repository.

## Repository Purpose

**MCP research toolkit for pregnancy medication studies.** Aggregates data from social media (Reddit), academic databases (PubMed, Scholar), government sources (FDA, CDC), and clinical platforms. Features IRB-compliant anonymization and structured exports for qualitative analysis tools (NVivo, Atlas.ti).

**Type:** Web application / CLI tool

## Code Architecture

This repository contains:
- **mcp-bundle-reddit-research/**: Node.js MCP server (production)
- **tools/**: Python utilities
- **.gemini/skills/**: Workflow automation skills (Python)

## Technology Stack

- **Language:** Node.js 18+ (App), Python 3.11+ (Workflow/Tools)
- **Package Manager:** npm (App), uv (Workflow)
- **Git Workflow:** Git-flow + GitHub-flow hybrid with worktrees
- **Workflow System:** Skill-based architecture (8 specialized skills)

## Common Development Commands

### Workflow Commands (Python/uv)

```bash
# Create BMAD planning (Phase 1: in main repo, contrib branch)
uv run python .gemini/skills/bmad-planner/scripts/create_planning.py \
  <slug> stharrold

# Create feature worktree (Phase 2)
uv run python .gemini/skills/git-workflow-manager/scripts/create_worktree.py \
  feature <slug> contrib/stharrold

# Create SpecKit specifications (Phase 2: in worktree)
uv run python .gemini/skills/speckit-author/scripts/create_specifications.py \
  feature <slug> stharrold --todo-file ../TODO_feature_*.md

# Run quality gates (Phase 3)
uv run python .gemini/skills/quality-enforcer/scripts/run_quality_gates.py
```

### Application Commands (Node.js)

```bash
cd mcp-bundle-reddit-research
npm install
npm test
npm start
```

### Workflow Dependencies (Python)

```bash
# Install/sync dependencies for workflow tools
uv sync
```

## Quality Gates

- [OK] Test coverage >= 80%
- [OK] All tests passing
- [OK] Build successful
- [OK] Linting clean
- [OK] Type checking clean

## Git Branch Structure

```
main                           <- Production
  ^
develop                        <- Integration branch
  ^
contrib/stharrold              <- Personal contribution
  ^
feature/<timestamp>_<slug>    <- Isolated feature (worktree)
```

## Related Documentation

- **[README.md](README.md)** - Human-readable project documentation
- **[WORKFLOW.md](WORKFLOW.md)** - Complete workflow guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contributor guidelines
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
