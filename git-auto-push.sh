#!/bin/zsh

set -e

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: This script must be run inside a Git repository." >&2
  exit 1
fi

if [[ -z "$(git status --short)" ]]; then
  echo "No changes to commit."
  exit 0
fi

DEFAULT_MESSAGE=$(date +"Auto update %Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="$1"

if [[ -z "$COMMIT_MESSAGE" ]]; then
  printf "Enter commit message (leave blank for \"%s\"): " "$DEFAULT_MESSAGE"
  read USER_MESSAGE
  if [[ -n "$USER_MESSAGE" ]]; then
    COMMIT_MESSAGE="$USER_MESSAGE"
  else
    COMMIT_MESSAGE="$DEFAULT_MESSAGE"
  fi
fi

echo "Staging changes..."
git add -A

echo "Committing with message: \"$COMMIT_MESSAGE\""
git commit -m "$COMMIT_MESSAGE"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Pushing to origin/$CURRENT_BRANCH..."
git push origin "$CURRENT_BRANCH"

echo "Done."






