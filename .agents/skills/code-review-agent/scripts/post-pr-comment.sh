#!/bin/bash
set -e

if [ "$#" -ne 4 ]; then
  echo "Usage: $0 <repo_owner> <repo_name> <pr_number> <comment_file_path>"
  exit 1
fi

REPO_OWNER=$1
REPO_NAME=$2
PR_NUMBER=$3
COMMENT_FILE=$4

if [ ! -f .env ]; then
  echo "Error: .env file not found."
  exit 1
fi

GITHUB_TOKEN=$(grep '^GITHUB_TOKEN=' .env | cut -d '=' -f2-)
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN not found in .env"
  exit 1
fi

if [ ! -f "$COMMENT_FILE" ]; then
  echo "Error: Comment file $COMMENT_FILE not found."
  exit 1
fi

COMMENT_BODY=$(cat "$COMMENT_FILE")

# Determine status state based on the content of the review
STATUS_STATE="success"
STATUS_DESC="Code review passed."
if grep -q "⛔️" "$COMMENT_FILE" || grep -q "⚠️" "$COMMENT_FILE"; then
  STATUS_STATE="failure"
  STATUS_DESC="Code review failed. Fix blocking issues."
fi

# 1. Post the comment via Issues API
JSON_PAYLOAD=$(node -e "
console.log(JSON.stringify({
  body: process.argv[1]
}))
" "$COMMENT_BODY")

curl -s -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues/$PR_NUMBER/comments" > /dev/null

# 2. Get the head SHA of the PR
PR_INFO=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls/$PR_NUMBER")

SHA=$(node -e "
  try {
    const data = JSON.parse(process.argv[1]);
    if (data.head && data.head.sha) { console.log(data.head.sha); }
  } catch(e) {}
" "$PR_INFO")

# 3. Post the Commit Status
if [ -n "$SHA" ]; then
  STATUS_PAYLOAD=$(node -e "
  console.log(JSON.stringify({
    state: process.argv[1],
    description: process.argv[2],
    context: 'Code Review Agent'
  }))
  " "$STATUS_STATE" "$STATUS_DESC")

  curl -s -X POST \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    -H "Content-Type: application/json" \
    -d "$STATUS_PAYLOAD" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/statuses/$SHA" > /dev/null
  
  echo "Commit status set to $STATUS_STATE for commit $SHA"
else
  echo "Failed to retrieve commit SHA for PR $PR_NUMBER. Could not set commit status."
fi

# Automatically delete the comment file after successful post
rm -f "$COMMENT_FILE"
