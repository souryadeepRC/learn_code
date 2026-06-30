# Antigravity Skills & Scripts

This directory (`.antigravity/skills/`) is the home for **Custom Capabilities** — specialized scripts, automations, and Model Context Protocol (MCP) server configurations that extend the abilities of the Antigravity agents.

While `.agents/skills/` contains the AI agent trigger prompts, this directory contains the actual executable code and complex workflows that those agents (or you) can run to automate tedious tasks.

## Available Capabilities

### 1. API Scaffolder (`scaffold-api.mjs`)
A Node.js script that instantly generates a new Next.js API route handler that strictly conforms to the project's `backend-standards.md`. It sets up the `route.ts` file with:
- Standard `try/catch` wrapper
- `APIResponse.send()` formatting
- Zod validation boilerplate
- Service extraction pattern

**Usage:**
```bash
node .antigravity/skills/scaffold-api.mjs <route-path>

# Example:
node .antigravity/skills/scaffold-api.mjs users/profile
```

---

*Feel free to add more Python, Node, or Bash scripts here to automate database seeding, component generation, or deployment checks!*
