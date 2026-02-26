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

## Pull Requests

Do not include a "Test plan" section in PR descriptions.

## GSD (Get Shit Done)

GSD is installed from a personal fork with customizations:
- **Fork:** `~/projects/get-shit-done` → github.com/kennyakers/get-shit-done
- **Upstream:** github.com/glittercowboy/get-shit-done

**⚠️ DO NOT use `/gsd:update`** — it installs from npm, not the fork.

**To update GSD:**
```bash
cd ~/projects/get-shit-done
git pull origin main
node bin/install.js --global
```

**To sync upstream changes:**
```bash
cd ~/projects/get-shit-done
git fetch upstream
git merge upstream/main
# Resolve conflicts, push, then reinstall
```

**Customizations in fork:**
- EARS-inspired behavioral requirements (When/While/If patterns)
- Behavioral checklist in questioning workflow
- Code simplifier integration in execute-phase
- PR review and update-agent-knowledge in complete-milestone
