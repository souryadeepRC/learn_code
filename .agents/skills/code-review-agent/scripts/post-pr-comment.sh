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
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues/$PR_NUMBER/comments"
