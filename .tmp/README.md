# .tmp/ Directory

This directory contains **reference implementations** and **template sources** that are used for development purposes. These are **not production code** and should not be used directly.

## Contents

### `stharrold-templates/`

**Source repository** for the 9-skill workflow automation system.

This is the original template repository that was used to bootstrap the workflow skills in `.claude/skills/`. It contains:
- Reference implementations of all 9 workflow skills
- Template files and documentation
- Original test infrastructure
- Example configurations

**Purpose**: Keep as reference for updates and synchronization with the upstream template repository.

**Status**: Read-only reference - do not modify files here. Updates should be made to `.claude/skills/` instead.

### `mcp-bundle-mprint/`

**Reference implementation** of an MCP bundle using a different architecture.

This is an example MCP bundle that demonstrates an alternative architectural pattern (layered architecture with domain/application/infrastructure/interfaces separation).

**Purpose**:
- Reference for architectural patterns
- Example of alternative MCP bundle structure
- Learning resource for MCP development

**Status**: Read-only reference - used for inspiration when building new MCP bundles.

## Why is this in Git?

These reference implementations are tracked in git for:
1. **Documentation purposes** - Show architectural decisions and evolution
2. **Consistency** - Ensure all contributors have the same references
3. **Claude Code context** - Claude instances can reference these for guidance

## Should I Use These?

**❌ DO NOT use directly** - These are templates and references only

**✅ DO reference** when:
- Building new MCP bundles (see `mcp-bundle-mprint/` for patterns)
- Updating workflow skills (see `stharrold-templates/` for latest)
- Understanding architectural decisions

**✅ DO use production code** from:
- `mcp-bundle-reddit-research/` - Production MCP bundle
- `.claude/skills/` - Production workflow skills
- `tools/` - Production Python utilities

## Maintenance

This directory is intentionally kept in git but excluded from CI/CD processes:
- Not tested in CI/CD workflows
- Not included in releases
- Not part of the production codebase

If you need to update these references, coordinate with the repository maintainers.

---

**Last Updated**: 2025-11-20
**Maintainers**: samuel.harrold@gmail.com
