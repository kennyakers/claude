# Global Claude Guidelines

## Subagents

Use subagents **proactively and eagerly**. They save context, improve specialized task quality, and can run in parallel. Don't wait to be asked—spawn them when their expertise applies.

| Agent | When to Use |
|-------|-------------|
| `backend-architect` | API design, microservice boundaries, database schemas, scalability |
| `code-reviewer` | After writing/modifying code—run automatically, not on request |
| `code-simplifier` | After completing code changes to reduce complexity |
| `deployment-engineer` | CI/CD pipelines, Docker, Kubernetes, GitHub Actions |
| `frontend-developer` | React components, state management, responsive design, a11y |
| `mobile-developer` | React Native/Flutter, native integrations, offline sync |
| `prompt-engineer` | AI features, system prompts, agent behavior tuning |
| `python-pro` | Advanced Python patterns, async, performance, refactoring |
| `search-specialist` | Deep research, fact-checking, competitive analysis |
| `test-engineer` | Test strategy, automation, coverage analysis |
| `typescript-pro` | Complex types, strict typing, JS→TS migration |
| `ui-ux-designer` | User research, wireframes, design systems, accessibility |

**Parallelization**: When tasks are independent, spawn multiple agents simultaneously.

## Documentation Maintenance

**Always update the project's CLAUDE.md after significant codebase changes.**

This is not optional and does not require prompting. When writing implementation plans, include "Update CLAUDE.md with changes" as a final step.

Significant changes include:
- New services, packages, or major features
- Architecture changes
- New development commands or workflows
- Changed conventions or patterns

## GSD (Get Shit Done) Sync Workflow

This repo contains customizations on top of [GSD](https://github.com/glittercowboy/get-shit-done). The upstream is tracked via the `gsd` remote.

**To sync updates from GSD:**
```bash
git fetch gsd
git merge gsd/main
# Resolve any conflicts, then commit
```

**Remotes:**
- `origin` → github.com/kennyakers/claude (this repo with customizations)
- `gsd` → github.com/glittercowboy/get-shit-done (upstream)

Custom changes (EARS requirements, code-simplifier integration, etc.) are preserved as commits on top of GSD's base.
