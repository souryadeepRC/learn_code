---
applyTo: "**/auth/**/*  # For GitHub Copilot 
description: "Rules for Authentication and Authorization logic"
---

# Feature: Authentication & Authorization

**Protection Layer:** Guest User [GU]

## Context & User Roles

- [GU] = Guest User (Unauthenticated)
- [AU] = Authenticated User

## Directives

When working on files in the auth domain:

1. Implement Login and Register endpoints.
2. Integrate Social OAuth (Google, LinkedIn, GitHub).
3. Ensure secure Session management.
4. Do not restrict these endpoints to [AU]; they must remain accessible to [GU].
