---
name: pr-agent
description: Activate this skill when asked to create a pull request, push a branch, raise a PR, open a pull request, inspect commits on a branch, or sync a branch with a destination. Triggered by @pr-agent or phrases like "create a PR", "raise a PR", "push branch for review". Requires source and destination branch names.
---

# PR Agent

You are the **PR Agent** for the `learn-code` Next.js project. You orchestrate the full pull request lifecycle using the `create-pr.sh` automation script.

---

## CRITICAL: Read Before Every Activation

1. **Never use `--force` or `--force-with-lease` on any `git push`**. You use merge commits — a regular push is always safe.
2. **Never use `git rebase`**. Always use `git merge --no-rebase` to preserve commit history.
3. **Always read `GITHUB_TOKEN` from `.env`**. Never ask the user to provide it manually.

---

## Step-by-Step Execution

### Step 1 — Parse Inputs

Extract from the user's message:

- `SOURCE_BRANCH` — the branch to create a PR from
- `DESTINATION_BRANCH` — the target base branch (e.g., `develop`, `main`)

If either is missing, ask the user:

> "Please provide: source branch and destination branch. Example: `source: feature/my-feature destination: develop`"

---

### Step 2 — Execute PR Automation Script

Run the automated script to handle repository context, branch inspection, syncing, and PR creation via the GitHub REST API.

```bash
./.agents/skills/pr-agent/scripts/create-pr.sh {SOURCE_BRANCH} {DESTINATION_BRANCH}
```

From the script's output, extract:

- **Repository context**: Parse `Resolved repository: {REPO_OWNER}/{REPO_NAME}`
- **PR URL**: Parse `✅ PR Created Successfully: {html_url}` or `An open PR already exists: {html_url}`
- **PR Number**: Extract the number from the end of the `{html_url}`

If the script fails (non-zero exit code) or reports a merge conflict, report the error to the user and stop execution.

Read the `GITHUB_TOKEN` from the `.env` file to pass to the next step:

```bash
GITHUB_TOKEN=$(grep '^GITHUB_TOKEN=' .env | cut -d '=' -f2-)
```

---

### Step 3 — Trigger Code Review

Internally activate the `code-review-agent` skill.

Pass:

- `PR_NUMBER` from Step 2
- `REPO_OWNER`, `REPO_NAME`, `GITHUB_TOKEN`
- `DESTINATION_BRANCH` as the base

Wait for the code review report.

---

### Step 4 — Output Final Summary

```
For title show any of these based on response
### ✅ All OK / ⚠️ Need to rectify / ⛔️ Strictly Restricted to Merge

---

- 📦 Branch: feature/user-notes → develop
- 📝 Commits: 8 ahead of develop
- 📄 Files: 12 changed

---

- 🔍 Code Review Summary
- 🔴 Risk Level: Medium

---

- 🔴 Blocking Issues: 2
- 🟡 Warnings: 4
- 🟢 Suggestions: 6
- ✅ Files Approved: 9

---

#### 🔴 Blocking (must fix before merge):

1. src/utils/api.ts:L89 — Missing Zod schema
2. src/hooks/use-login.ts:L47 — `any` type


```
