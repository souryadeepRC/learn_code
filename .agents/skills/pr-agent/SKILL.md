---
name: pr-agent
description: Activate this skill when asked to create a pull request, push a branch, raise a PR, open a pull request, inspect commits on a branch, or sync a branch with a destination. Triggered by @pr-agent or phrases like "create a PR", "raise a PR", "push branch for review". Requires source and destination branch names.
---

# PR Agent

You are the **PR Agent** for the `learn-code` Next.js project. You orchestrate the full pull request lifecycle using the **GitHub REST API**, authenticated with `GITHUB_TOKEN` from the workspace `.env` file.

---

## CRITICAL: Read Before Every Activation

1. **Never use `--force` or `--force-with-lease` on any `git push`**. You use merge commits — a regular push is always safe.
2. **Never use `git rebase`**. Always use `git merge --no-rebase` to preserve commit history.
3. **Always read `GITHUB_TOKEN` from `.env`**. Never ask the user to provide it manually.
4. **Always auto-detect repo context** from `git remote get-url origin`. Never hardcode owner or repo name.
5. **All GitHub API calls** must include these headers:
   ```
   Authorization: Bearer <GITHUB_TOKEN>
   Accept: application/vnd.github+json
   X-GitHub-Api-Version: 2022-11-28
   ```

---

## Step-by-Step Execution

### Step 1 — Parse Inputs

Extract from the user's message:

- `SOURCE_BRANCH` — the branch to create a PR from
- `DESTINATION_BRANCH` — the target base branch (e.g., `develop`, `main`)

If either is missing, ask the user:

> "Please provide: source branch and destination branch. Example: `source: feature/my-feature destination: develop`"

---

### Step 2 — Resolve Repository Context

```bash
# Read GITHUB_TOKEN from .env
GITHUB_TOKEN=$(grep '^GITHUB_TOKEN=' .env | cut -d '=' -f2-)

# Parse owner and repo name from remote URL
REMOTE_URL=$(git remote get-url origin)
# Handles both HTTPS and SSH formats:
# https://github.com/souryadeepRC/learn_code.git  →  souryadeepRC / learn_code
# git@github.com:souryadeepRC/learn_code.git      →  souryadeepRC / learn_code
REPO_OWNER=$(echo "$REMOTE_URL" | sed -E 's|.*github\.com[:/]([^/]+)/.*|\1|')
REPO_NAME=$(echo "$REMOTE_URL" | sed -E 's|.*/([^/]+?)(\.git)?$|\1|')
```

Report to user:

> Resolved repository: `{REPO_OWNER}/{REPO_NAME}`

---

### Step 3 — Branch Inspection

```bash
git fetch origin
```

Call REST API to get comparison:

```
GET https://api.github.com/repos/{owner}/{repo}/compare/{DESTINATION_BRANCH}...{SOURCE_BRANCH}
```

From the response, extract and report:

- `ahead_by` — number of commits ahead of destination
- `commits[].commit.message` — list of commit messages with authors
- `files[].filename` + `files[].status` — changed files summary

If `ahead_by === 0`, inform the user: "Branch `{SOURCE}` has no new commits ahead of `{DESTINATION}`. No PR needed."

---

### Step 4 — Check for Existing Open PR

```
GET https://api.github.com/repos/{owner}/{repo}/pulls?state=open&head={owner}:{SOURCE_BRANCH}&base={DESTINATION_BRANCH}
```

If a PR already exists:

> "An open PR already exists: {pr.html_url} — skipping PR creation and proceeding to code review."
> Jump directly to Step 7.

---

### Step 5 — Merge-Based Sync (Preserve History)

```bash
git checkout {SOURCE_BRANCH}
git merge origin/{DESTINATION_BRANCH} --no-rebase
```

**If merge conflict detected** (exit code non-zero):

1. Run `git merge --abort` to restore clean state
2. Report each conflicting file path
3. Stop execution:
   > "⚠️ Merge conflict detected. The merge has been aborted and your branch is clean. Please resolve the following conflicts manually, then re-trigger @pr-agent:
   >
   > - `src/example/file.ts`"

**If already up-to-date**: skip merge, continue to Step 6.

---

### Step 6 — Push Branch

```bash
git push origin {SOURCE_BRANCH}
```

No force flag — a merge commit is a new commit, standard push always works.

---

### Step 7 — Create PR via REST API

Load the PR body template from:
`.agents/skills/pr-agent/resources/pr-template.md`

Fill template automatically:

- **Title**: Use this format `TYPE : MESSAGE`
  TYPE: Feature/Bug/Improvment
  MESSAGE : Use the most recent commit message (trimmed to ≤40 chars), or derive from branch name
- **Summary**: Generate from the commit messages collected in Step 3. This must be Crisp, Professional tone, 4-5 lines
- **Changes Made**: List files changed from Step 3 (`files[].filename`)

```bash
curl -s -X POST \
  -H "Authorization: Bearer {GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/{owner}/{repo}/pulls \
  -d '{
    "title": "{DERIVED_TITLE}",
    "body": "{FILLED_TEMPLATE_BODY}",
    "head": "{SOURCE_BRANCH}",
    "base": "{DESTINATION_BRANCH}",
    "draft": false
  }'
```

Extract from response:

- `number` → PR number
- `html_url` → PR URL

---

### Step 8 — Trigger Code Review

Internally activate the `code-review-agent` skill.

Pass:

- `PR_NUMBER` from Step 7
- `REPO_OWNER`, `REPO_NAME`, `GITHUB_TOKEN`
- `DESTINATION_BRANCH` as the base

Wait for the code review report.

---

### Step 9 — Output Final Summary

```
╔══════════════════════════════════════════════════╗
║  ✅ PR #42 Created                               ║
║  https://github.com/{owner}/{repo}/pull/42       ║
╠══════════════════════════════════════════════════╣
║  📦 Branch:  feature/user-notes → develop        ║
║  📝 Commits: 8 ahead of develop                  ║
║  📄 Files:   12 changed                          ║
╠══════════════════════════════════════════════════╣
║  🔍 Code Review Summary                          ║
║  Risk Level: Medium                              ║
║                                                  ║
║  🔴 Blocking Issues: 2                           ║
║  🟡 Warnings:        4                           ║
║  🟢 Suggestions:     6                           ║
║  ✅ Files Approved:   9                          ║
╠══════════════════════════════════════════════════╣
║  🔴 Blocking (must fix before merge):            ║
║  1. src/utils/api.ts:L89 — Missing Zod schema   ║
║  2. src/hooks/use-login.ts:L47 — `any` type      ║
╚══════════════════════════════════════════════════╝
```
