```bash
.claude/
├── CLAUDE.md # Project context & conventions
├── settings.json # Agent/command configuration
├── agents/ # Your 4 specialized agents
├── commands/ # Custom workflows (optional)
├── rules/ # Path-scoped guidelines (optional)
├── docs/ # Reference documentation (optional)
└── skills/ # Reusable multi-step workflows (optional)
```

## Your 4 Agents

- frontend-specialist: React, TypeScript, performance, accessibility
- backend-specialist: APIs, databases, auth, services
- code-reviewer: PRs, security, correctness (read-only)
- dba-specialist: Schema design, query optimization, indexing

## Key Distinctions

| Aspect   | Agent                      | Tool Access           | Use When             |
| -------- | -------------------------- | --------------------- | -------------------- |
| Frontend | Builds/modifies components | Read, Write, Execute  | Component work       |
| Backend  | Designs APIs & schemas     | Read, Write, Execute  | API/DB work          |
| Reviewer | Audits code                | Read, Grep, Glob only | PRs, security audits |
| DBA      | Optimizes queries          | Read, Write, Execute  | Schema/perf work     |

## ✅ Setup Path

- Copy QUICK-SETUP.md instructions (takes ~15 minutes)
- Create .claude/ folder structure
- Copy CLAUDE.md.template → .claude/CLAUDE.md
- Copy agent templates from agents-all-templates.md → .claude/agents/
- Add settings.json pointing to your agents
- Test: claude -a frontend-specialist "your task"

## 🎯 Why This Matters

- Isolation: Each agent runs in isolated context; findings won't clutter main session
- Focus: Code-reviewer can't accidentally write/execute (safer)
- Cost: Faster models for simple read-only tasks (Haiku instead of Sonnet)
- Scalability: Easy to add more agents as your team grows
- Team Ready: Commit .claude/agents/ to git; team gets same setup
