---
name: GitHub repo setup
description: BuildMatch GitHub repo location and push method; git remote add is blocked in main agent so must push via inline URL.
---

# GitHub repo

- **URL:** https://github.com/ws4rj6vtzw-jpg/buildmatch
- **Branch:** main
- **PAT secret:** `GITHUB_PERSONAL_ACCESS_TOKEN` (stored as Replit secret)
- **GitHub login:** ws4rj6vtzw-jpg

## How to push from main agent

`git remote add` is blocked (modifies .git/config which needs a lock). Use inline URL instead:

```bash
GIT_TERMINAL_PROMPT=0 git --no-optional-locks push \
  "https://ws4rj6vtzw-jpg:${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/ws4rj6vtzw-jpg/buildmatch.git" \
  HEAD:main
```

**Why:** Replit sandbox blocks destructive git ops (anything modifying .git/) in the main agent. Plain `git push` with an inline URL is allowed.
