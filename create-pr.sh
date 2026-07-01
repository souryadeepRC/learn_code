#!/bin/bash

# Exit on any error
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <source_branch> <destination_branch>"
  echo "Example: $0 feature/user-notes develop"
  exit 1
fi

SOURCE_BRANCH=$1
DESTINATION_BRANCH=$2

echo "=========================================="
echo "Step 2: Resolving Repository Context"
echo "=========================================="
if [ ! -f .env ]; then
  echo "Error: .env file not found in current directory."
  exit 1
fi

GITHUB_TOKEN=$(grep '^GITHUB_TOKEN=' .env | cut -d '=' -f2-)
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN not found in .env"
  exit 1
fi

REMOTE_URL=$(git remote get-url origin)
REPO_OWNER=$(echo "$REMOTE_URL" | sed -E 's|.*github\.com[:/]([^/]+)/.*|\1|')
REPO_NAME=$(echo "$REMOTE_URL" | sed -E 's|.*/([^/]+?)(\.git)?$|\1|')

echo "Resolved repository: $REPO_OWNER/$REPO_NAME"
echo ""

echo "=========================================="
echo "Step 3: Branch Inspection"
echo "=========================================="
git fetch origin

COMPARE_API="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/compare/$DESTINATION_BRANCH...$SOURCE_BRANCH"
COMPARE_RES=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "$COMPARE_API")

AHEAD_BY=$(node -e "
  try {
    const data = JSON.parse(process.argv[1]);
    console.log(data.ahead_by !== undefined ? data.ahead_by : 'null');
  } catch(e) { console.log('null'); }
" "$COMPARE_RES")

if [ "$AHEAD_BY" = "0" ] || [ "$AHEAD_BY" = "null" ]; then
  echo "Branch $SOURCE_BRANCH has no new commits ahead of $DESTINATION_BRANCH. No PR needed."
  exit 0
fi

echo "Branch is ahead by $AHEAD_BY commit(s)."
echo ""

echo "=========================================="
echo "Step 4: Checking for Existing Open PR"
echo "=========================================="
PULLS_API="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls?state=open&head=$REPO_OWNER:$SOURCE_BRANCH&base=$DESTINATION_BRANCH"
PULLS_RES=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "$PULLS_API")

EXISTING_PR_URL=$(node -e "
  try {
    const data = JSON.parse(process.argv[1]);
    if (data.length > 0) { console.log(data[0].html_url); }
  } catch(e) {}
" "$PULLS_RES")

if [ -n "$EXISTING_PR_URL" ]; then
  echo "An open PR already exists: $EXISTING_PR_URL — skipping PR creation."
  exit 0
fi
echo "No existing open PR found."
echo ""

echo "=========================================="
echo "Step 5: Merge-Based Sync"
echo "=========================================="
git checkout "$SOURCE_BRANCH"
if ! git merge "origin/$DESTINATION_BRANCH" --no-edit; then
  echo "⚠️ Merge conflict detected. The merge has been aborted."
  echo "Please resolve the conflicts manually."
  git merge --abort
  exit 1
fi
echo ""

echo "=========================================="
echo "Step 6: Pushing Branch"
echo "=========================================="
git push origin "$SOURCE_BRANCH"
echo ""

echo "=========================================="
echo "Step 7: Creating PR via REST API"
echo "=========================================="
LAST_COMMIT_MSG=$(git log -1 --pretty=%s)
PR_TITLE="Feature : ${LAST_COMMIT_MSG:0:40}"
TEMPLATE_PATH=".agents/skills/pr-agent/resources/pr-template.md"

if [ -f "$TEMPLATE_PATH" ]; then
  PR_BODY=$(cat "$TEMPLATE_PATH")
else
  PR_BODY="Automated PR created by script."
fi

JSON_PAYLOAD=$(node -e "
console.log(JSON.stringify({
  title: process.argv[1],
  body: process.argv[2],
  head: process.argv[3],
  base: process.argv[4],
  draft: false
}))
" "$PR_TITLE" "$PR_BODY" "$SOURCE_BRANCH" "$DESTINATION_BRANCH")

CREATE_PR_API="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls"
CREATE_RES=$(curl -s -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" \
  "$CREATE_PR_API")

NEW_PR_URL=$(node -e "
  try {
    const data = JSON.parse(process.argv[1]);
    if (data.html_url) { console.log(data.html_url); }
  } catch(e) {}
" "$CREATE_RES")

if [ -n "$NEW_PR_URL" ]; then
  echo "✅ PR Created Successfully: $NEW_PR_URL"
else
  echo "❌ Failed to create PR. API Response:"
  echo "$CREATE_RES"
fi
