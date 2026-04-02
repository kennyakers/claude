---
description: "Enhanced PR review with confidence scoring and cross-reviewer discourse"
argument-hint: "[review-aspects] [parallel]"
allowed-tools: ["Agent", "Bash", "Glob", "Grep", "Read"]
---

# Enhanced PR Review

PR review with two additions over standard `/pr-review-toolkit:review-pr`:
1. **Redundancy scoring** — code-reviewer runs twice independently; findings from both runs = HIGH CONFIDENCE, one run only = MODERATE CONFIDENCE
2. **Structured discourse** — after individual reviews, a synthesis agent cross-validates all findings

**Review Aspects (optional):** "$ARGUMENTS"

## Phase 1: Scope & Context

1. Run `git diff --name-only` to identify changed files
2. Run `git diff` to get the full diff content
3. Read CLAUDE.md and .claude/CODING_STANDARDS.md for project standards
4. Determine which review aspects apply (same rules as standard review-pr):
   - **Always**: code-reviewer
   - **If test files changed**: pr-test-analyzer
   - **If comments/docs added**: comment-analyzer
   - **If error handling changed**: silent-failure-hunter
   - **If types added/modified**: type-design-analyzer

## Phase 2: Launch Review Agents with Redundancy

Launch ALL applicable agents in parallel. For the code-reviewer specifically, launch TWO independent instances (code-reviewer-A and code-reviewer-B) with identical inputs but separate agent spawns.

For each agent, provide:
- The full git diff
- The list of changed files
- Project standards from CLAUDE.md

**Agent prompts must include:** "Return your findings as a structured list. For each finding include: severity (CRITICAL/IMPORTANT/SUGGESTION), file path, line number(s), description, and recommended fix."

**IMPORTANT for redundancy:** The two code-reviewer instances MUST be launched as separate Agent calls in the same message (true parallel). Do NOT share context between them. They must review independently.

Specialist agents (silent-failure-hunter, pr-test-analyzer, etc.) run once each — their focused scope makes them more deterministic so redundancy adds less value.

## Phase 3: Confidence Scoring

After both code-reviewer instances return:

1. Compare their findings by matching on: same file + same general issue (not exact wording)
2. Score each finding:
   - **HIGH CONFIDENCE** — Both reviewers independently flagged the same issue. These are almost certainly real.
   - **MODERATE CONFIDENCE** — Only one reviewer flagged it. Could be real or could be noise. Include but flag as single-source.
3. Specialist agent findings default to HIGH CONFIDENCE (single-pass specialists are deterministic enough).
4. Drop any finding where both reviewers looked at the same code area and only one flagged it AND the issue is severity SUGGESTION — these are likely noise.

## Phase 4: Structured Discourse

Spawn a single "discourse synthesis" agent. Its prompt:

---

You are a Tech Lead synthesizing findings from multiple independent code reviewers. You have access to all individual review reports.

For EVERY finding across ALL reviewers, apply exactly one tag:

- **AGREE** — Multiple reviewers flagged the same issue, or you independently confirm a single-reviewer finding is correct. State which reviewers agree.
- **CHALLENGE** — A finding looks like a false positive, is based on a misunderstanding of the codebase, or contradicts project conventions. Explain why.
- **CONNECT** — Two findings from different reviewers are related (e.g., error-hunter found a swallowed exception that code-reviewer flagged as missing error handling). Explain the connection — the linked finding is stronger than either alone.
- **SURFACE** — An issue emerges from the INTERSECTION of multiple findings that no single reviewer explicitly called out. Explain what the combined findings reveal.

Also note:
- Any finding tagged CHALLENGE should be demoted or removed from the final report
- Any finding tagged CONNECT should be merged into a single stronger finding
- Any finding tagged SURFACE is a new finding to add to the final report

Output a structured discourse report with each finding, its tag, and your reasoning.

---

Provide this agent with ALL individual review outputs (both code-reviewer runs + all specialist reports) and the original diff for reference.

## Phase 5: Final Report

Synthesize everything into the final output:

```markdown
# Enhanced PR Review Summary

## Confidence-Scored Findings

### Critical Issues
- [HIGH/MODERATE] [agent(s)]: Description [file:line]
  - Discourse: [AGREE/CONNECT/SURFACE tag + reasoning]

### Important Issues
- [HIGH/MODERATE] [agent(s)]: Description [file:line]
  - Discourse: [tag + reasoning]

### Suggestions
- [HIGH/MODERATE] [agent(s)]: Description [file:line]

## Discourse Highlights
- Challenged findings (removed/demoted): list with reasons
- Connected findings (merged): list with explanations
- Surfaced findings (new): list with cross-reviewer reasoning

## Reviewer Agreement Matrix
| Finding | code-reviewer-A | code-reviewer-B | specialists | discourse |
|---------|----------------|----------------|-------------|-----------|

## Strengths
- What's well-done in this PR

## Recommended Actions
1. Fix critical HIGH CONFIDENCE issues first
2. Fix critical MODERATE CONFIDENCE issues (verify they're real)
3. Address important issues
4. Consider suggestions
```

