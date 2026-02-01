# Claude Code Configuration

Personal Claude Code configuration. GSD is installed separately from [my fork](https://github.com/kennyakers/get-shit-done).

## Structure

```
~/.claude/
├── CLAUDE.md              # Global Claude instructions
├── settings.json          # Claude Code settings
├── commands/              # Custom commands (non-GSD)
├── agents/                # Custom agents (non-GSD)
├── hooks/                 # Custom hooks
└── [GSD files]            # Installed from fork (gitignored)
```

## GSD Fork

GSD is managed via a separate fork with customizations:

**Fork:** [github.com/kennyakers/get-shit-done](https://github.com/kennyakers/get-shit-done)

**Customizations:**
- EARS-inspired behavioral requirements (When/While/If patterns)
- Behavioral checklist for discovery (states, triggers, failures, boundaries)
- Code simplifier integration in `/gsd:execute-phase`
- PR review + update-agent-knowledge in `/gsd:complete-milestone`

### Install/Update GSD

```bash
cd ~/projects/get-shit-done
git pull origin main
node bin/install.js --global
```

### Sync with Upstream GSD

```bash
cd ~/projects/get-shit-done
git fetch upstream
git merge upstream/main
# Resolve conflicts (keep your customizations)
git push origin main
node bin/install.js --global
```
