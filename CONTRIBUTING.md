# Contributing to MPRINT Research Toolkit

Thank you for your interest in contributing! This guide will help you understand our development workflow and contribution process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Strategy](#branch-strategy)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Release Process](#release-process)

---

## Code of Conduct

This project follows a professional code of conduct:

- **Be respectful** - Value diverse perspectives and experiences
- **Be collaborative** - Work together constructively
- **Be transparent** - Communicate openly about decisions and changes
- **Be research-focused** - Prioritize IRB compliance and participant privacy
- **Be quality-driven** - Maintain high standards for code and documentation

---

## Getting Started

### Prerequisites

**For MCP Bundle Development:**
- Node.js 18+ and npm
- Reddit API credentials (from https://www.reddit.com/prefs/apps)
- Git and GitHub account

**For Workflow System Development:**
- Python 3.12+
- uv (Python package manager)
- GitHub CLI (`gh`)
- Git

### Initial Setup

1. **Fork and clone the repository:**
   ```bash
   git fork stharrold/erkinney-mcp
   git clone https://github.com/YOUR_USERNAME/erkinney-mcp.git
   cd erkinney-mcp
   ```

2. **Set up remotes:**
   ```bash
   git remote add upstream https://github.com/stharrold/erkinney-mcp.git
   ```

3. **Create your personal branch:**
   ```bash
   git checkout -b contrib/YOUR_GITHUB_USERNAME develop
   git push -u origin contrib/YOUR_GITHUB_USERNAME
   ```

4. **Install dependencies:**
   ```bash
   # For MCP bundle
   cd mcp-bundle-reddit-research
   npm install

   # For Python workflow tools (if needed)
   uv sync
   ```

---

## Development Workflow

This repository uses a **6-phase development workflow** coordinated by the `workflow-orchestrator` skill:

```
Phase 1: Planning        → Create BMAD (requirements, architecture, epics)
Phase 2: Implementation  → Create specifications and worktree
Phase 3: Quality         → Run tests, coverage checks, version calculation
Phase 4: Integration     → Create PR, address feedback, merge
Phase 5: Release         → Tag release, create GitHub release, back-merge
Phase 6: Hotfix          → Emergency fixes from main branch
```

### Automated Workflow with Claude Code

If using Claude Code, leverage the 9 specialized skills:

```bash
# Phase 1: Planning
python .claude/skills/bmad-planner/scripts/create_planning.py feature-slug your-username

# Phase 2: Specifications
python .claude/skills/git-workflow-manager/scripts/create_worktree.py feature feature-slug contrib/your-username
python .claude/skills/speckit-author/scripts/create_specifications.py feature-slug your-username

# Phase 3: Quality Gates
python .claude/skills/quality-enforcer/scripts/run_quality_gates.py
python .claude/skills/git-workflow-manager/scripts/semantic_version.py develop vX.Y.Z

# Phase 4: Integration
# Create PR, address feedback
python .claude/skills/git-workflow-manager/scripts/cleanup_feature.py feature-slug --summary "..." --version "X.Y.Z"

# Phase 5: Release (maintainers only)
python .claude/skills/git-workflow-manager/scripts/create_release.py vX.Y.Z
```

---

## Branch Strategy

We use a **git-flow + GitHub-flow hybrid** with the following structure:

```
main (production)
  ↑
develop (integration)
  ↑
contrib/<username> (personal integration - YOUR DEFAULT BRANCH)
  ↑
feat/*, fix/*, docs/* (feature branches via worktrees)
```

### Branch Types

| Branch Type | Purpose | Created From | Merged To |
|------------|---------|--------------|-----------|
| `main` | Production releases | - | - |
| `develop` | Team integration | `main` | `main` |
| `contrib/<username>` | Personal integration (HOME) | `develop` | `develop` |
| `feat/*` | New features | `contrib/<username>` | `contrib/<username>` |
| `fix/*` | Bug fixes | `contrib/<username>` | `contrib/<username>` |
| `docs/*` | Documentation | `contrib/<username>` | `contrib/<username>` |
| `release/*` | Release preparation | `develop` | `main` + `develop` |
| `hotfix/*` | Emergency fixes | `main` | `main` + `develop` |

### Pull Request Flow

```
feature/* → contrib/username → develop → release/* → main
```

### Working with Worktrees

**Recommended**: Use worktrees for feature branches to keep your main workspace clean.

```bash
# Create feature worktree (automated)
python .claude/skills/git-workflow-manager/scripts/create_worktree.py feature my-feature contrib/your-username

# Manual worktree creation
git worktree add ../erkinney-mcp.worktrees/my-feature -b feat/my-feature

# List worktrees
git worktree list

# Remove worktree when done
git worktree remove ../erkinney-mcp.worktrees/my-feature
git worktree prune
```

---

## Commit Message Convention

**REQUIRED**: All commit messages must reference at least one GitHub issue.

### Format

```
<type>: <description> (#ISSUE)

[Optional body explaining what and why]

[Optional footer: Closes #ISSUE, Fixes #ISSUE, etc.]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature or bug fix)
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, configs)

### Examples

```bash
# Good
feat: Add medication search functionality (#45)

fix: Resolve memory leak in cache - fixes #67

docs: Update API documentation (#12)

# Bad (missing issue reference)
feat: Add medication search
fix: bug in cache
```

### Issue Reference Patterns

Supported: `#123`, `fixes #123`, `closes #123`, `resolves #123`, `gh-123`

---

## Pull Request Process

### 1. Before Creating a PR

- ✅ All tests pass locally
- ✅ Code follows existing style and conventions
- ✅ New code has appropriate test coverage (≥80%)
- ✅ Documentation updated if needed
- ✅ Commit messages follow convention
- ✅ Branch is up-to-date with base branch

### 2. Creating a PR

```bash
# Push your branch
git push origin feat/my-feature

# Create PR
gh pr create --base contrib/YOUR_USERNAME --head feat/my-feature --title "feat: Description (#ISSUE)" --body "$(cat <<'EOF'
## Summary
Brief description of changes

## Changes
- Item 1
- Item 2

## Test Plan
- [ ] Manual testing steps
- [ ] Automated tests added

Closes #ISSUE
EOF
)"
```

### 3. PR Review Process

1. **Automated checks** - CI/CD tests must pass
2. **Code review** - At least one approval required (Copilot reviews automatically)
3. **Address feedback** - Make requested changes
4. **Squash and merge** or **Regular merge** (depending on repository settings)

### 4. After Merge

Your feature branch will be automatically deleted. Update your contrib branch:

```bash
git checkout contrib/your-username
git pull origin contrib/your-username
```

---

## Testing Requirements

### Test Pyramid

Follow the test pyramid for balanced coverage:

- **Unit tests** (70%): Domain and application logic
- **Integration tests** (20%): Infrastructure adapters
- **E2E tests** (10%): Critical user journeys

### Coverage Thresholds

**Minimum requirements** (enforced by quality gates):
- Lines: ≥80%
- Functions: ≥80%
- Branches: ≥75%

### Running Tests

**MCP Bundle (Node.js):**
```bash
cd mcp-bundle-reddit-research
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

**Workflow System (Python):**
```bash
python .claude/skills/quality-enforcer/scripts/run_quality_gates.py
```

---

## Release Process

**Note**: Only maintainers can create releases.

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes, incompatible API changes
- **MINOR** (1.X.0): New features, backward-compatible functionality
- **PATCH** (1.0.X): Bug fixes, backward-compatible patches

Examples:
- `1.0.0 → 1.0.1` (bug fix)
- `1.0.1 → 1.1.0` (new feature)
- `1.1.0 → 2.0.0` (breaking change)

### Release Workflow

Git tags are the source of truth for versions.

```bash
# 1. Validate release
npm run validate:release v1.2.0  # If validation script exists

# 2. Create annotated tag
git tag -a v1.2.0 -m "Release v1.2.0: Description (#ISSUE)"

# 3. Sync version (if using package.json)
npm run version:sync  # If version sync script exists

# 4. Commit version updates
git commit -m "chore: Update package version to v1.2.0 (#ISSUE)"

# 5. Push tags and commits
git push origin main
git push origin --tags

# 6. Create GitHub release
gh release create v1.2.0 --generate-notes

# 7. Back-merge to develop
python .claude/skills/git-workflow-manager/scripts/backmerge_release.py v1.2.0 develop

# 8. Cleanup release branch
python .claude/skills/git-workflow-manager/scripts/cleanup_release.py v1.2.0
```

---

## Datetime Standards

Always use ISO-8601 datetime stamps in UTC:

- **In file contents**: `YYYY-MM-DDTHH:MM:SSZ` (e.g., `2025-08-31T14:30:00Z`)
- **In filenames/directories**: `YYYYMMDDTHHMMSSZ` (e.g., `20250831T143000Z`)
- Always use 24-hour format with seconds
- Always include Z suffix for UTC

---

## Research Ethics & Privacy

When contributing to research tools:

- ✅ **Public data only** - Never collect private messages or personal information
- ✅ **Anonymization required** - All usernames must be anonymized (SHA-256)
- ✅ **IRB compliance** - Follow IRB guidelines and AoIR Ethics 3.0
- ✅ **Transparent methodology** - Document data collection methods clearly
- ✅ **Reproducibility** - Ensure research can be replicated

See [mcp-bundle-reddit-research/PRIVACY.md](mcp-bundle-reddit-research/PRIVACY.md) for detailed privacy guidelines.

---

## Questions or Need Help?

- **Research Inquiries**: emkinney@iu.edu
- **Technical Questions**: samuel.harrold@gmail.com
- **Bug Reports**: [GitHub Issues](https://github.com/stharrold/erkinney-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/stharrold/erkinney-mcp/discussions) (if enabled)

---

## Additional Resources

- [CLAUDE.md](CLAUDE.md) - Detailed guide for Claude Code development
- [CHANGELOG.md](CHANGELOG.md) - Version history and release notes
- [README.md](README.md) - Project overview and quick start
- [MCP Bundle README](mcp-bundle-reddit-research/README.md) - MCP bundle documentation

---

Thank you for contributing to MPRINT Research Toolkit! 🎉
