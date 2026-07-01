#!/bin/bash
set -e

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <repo_owner> <repo_name> <pr_number>"
  exit 1
fi

REPO_OWNER=$1
REPO_NAME=$2
PR_NUMBER=$3

if [ ! -f .env ]; then
  echo "Error: .env file not found."
  exit 1
fi

GITHUB_TOKEN=$(grep '^GITHUB_TOKEN=' .env | cut -d '=' -f2-)
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN not found in .env"
  exit 1
fi

curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls/$PR_NUMBER/files"
