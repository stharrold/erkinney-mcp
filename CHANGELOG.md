# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.2] - 2025-11-21

### Changed
- Synchronized `backmerge_release.py` with template version for better error handling
  - Added Issue #152 reference for error handling clarity
  - Added Issue #147 comment about empty list check
- Enhanced CLAUDE.md with critical MCP bundle architecture documentation
  - Added dual-project structure clarification (Python workflow + Node.js MCP bundle)
  - Documented singleton authentication pattern
  - Documented LRU cache Map-based eviction details
  - Documented token bucket rate limiting mechanism
  - Added ES Modules requirements and stdio transport notes
  - Enhanced command section with required .env variables and ESM testing context

### Fixed
- Improved code traceability with issue references in workflow scripts

## [1.1.1] - 2025-11-21

### Added
- Comprehensive root README.md with badges, quick start, and project overview
- CHANGELOG.md for tracking version history
- CONTRIBUTING.md with development workflow guidelines

## [1.1.0] - 2025-11-20

### Added
- **Reddit Research MCP Bundle** - Complete implementation with 5 MCP tools
  - `search_reddit_threads` - Search medication discussions with filters
  - `get_thread_details` - Retrieve full thread content with comments
  - `batch_search_medications` - Multi-medication search with progress tracking
  - `export_research_data` - Export to JSON/CSV with anonymization
  - `get_subreddit_info` - Subreddit metadata and rules
- IRB-compliant SHA-256 anonymization for username privacy
- AoIR Ethics 3.0 framework compliance documentation
- Rate limiting (60 req/min) with exponential backoff
- LRU caching (100 items) to reduce API calls
- OAuth 2.0 authentication with Reddit API
- Comprehensive documentation (README, PRIVACY.md, CLAUDE_SETUP.md)
- Complete workflow examples in `examples/` directory
- Automated installation script (`install.sh`)
- Jest test infrastructure with basic tests
- Resources: medication templates and ethics guidelines

### Changed
- Updated CI/CD workflow to support both Python and Node.js projects
- Enhanced release cleanup and backmerge scripts to always end on contrib branch
- Updated CLAUDE.md with complete MCP bundle implementation details

### Fixed
- CI/CD workflow now uses uv for Python dependency management
- Removed references to non-existent test files
- Added dynamic pyproject.toml creation in CI for Python linting
- Fixed Node.js test workflow path handling

### Security
- Require ANONYMIZATION_SALT environment variable (no default for security)
- Removed real client ID from .env.example
- Sanitized auth error messages to prevent credential leakage

## [1.0.1] - 2025-11-20

### Fixed
- Release workflow scripts now automatically switch to `contrib/<gh-user>` branch after completion
- Users always end on an editable branch instead of `develop` branch

### Changed
- Enhanced `cleanup_release.py` with automatic branch detection and switching
- Enhanced `backmerge_release.py` with automatic branch detection and switching
- Added `get_github_username()` and `switch_to_contrib_branch()` functions to release scripts

## [1.0.0] - 2025-11-20

### Added
- **9-Skill Workflow Automation System**
  - `workflow-orchestrator` - Coordinates 6-phase development workflow
  - `bmad-planner` - Business Model Architecture Document creation
  - `speckit-author` - Technical specification generation
  - `git-workflow-manager` - Automated git operations (worktrees, releases, versioning)
  - `quality-enforcer` - Test coverage and quality gates
  - `tech-stack-adapter` - Auto-detects project technology stack
  - `workflow-utilities` - Shared utilities (archiving, validation)
  - `agentdb-state-manager` - Persistent state with DuckDB
  - `initialize-repository` - Bootstrap new projects with full workflow
- **Slash Commands** for Claude Code
  - `/specify` - Create feature specification from natural language
  - `/plan` - Generate design artifacts from specification
  - `/tasks` - Create dependency-ordered task list
- **Standalone Python Tools**
  - `tools/git-helpers/` - Worktree creation, semantic versioning
  - `tools/workflow-utilities/` - Archive management, directory validation
- **CI/CD Infrastructure**
  - GitHub Actions workflows for tests
  - Azure Pipelines configuration
  - Claude Code review automation
- **Documentation**
  - Comprehensive CLAUDE.md (639 lines) for Claude Code instances
  - Individual skill READMEs with detailed usage instructions
  - Git workflow documentation
- **Repository Structure**
  - Branch strategy: main → develop → contrib/username → feature/*
  - Worktree-based feature development
  - Git-flow + GitHub-flow hybrid workflow

### Infrastructure
- MIT License
- .gitignore configuration
- Git hooks setup for commit message validation
- Semantic versioning automation
- Release management scripts

---

## Version Numbering

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward-compatible manner
- **PATCH** version for backward-compatible bug fixes

Git tags are the source of truth for versions and always use the `v` prefix (e.g., `v1.2.3`).

## Release Process

1. Validate: `npm run validate:release vX.Y.Z`
2. Create tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z: description"`
3. Push: `git push origin main && git push origin --tags`
4. Create release: `gh release create vX.Y.Z --generate-notes`

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed release workflow.

[Unreleased]: https://github.com/stharrold/erkinney-mcp/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/stharrold/erkinney-mcp/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/stharrold/erkinney-mcp/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/stharrold/erkinney-mcp/releases/tag/v1.0.0
