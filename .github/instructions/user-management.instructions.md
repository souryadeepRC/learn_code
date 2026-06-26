---
applyTo: '**/user/**/*, **/profile/**/*'
description: 'Rules for User Profile and Account Management'
---

# Feature: User Management

**Protection Layer:** Authenticated User [AU]

## Context & User Roles

- [AU] = Authenticated User

## Directives

When working on user management files, ensure all routes and components require an [AU] session.

1. Post-login: Handle user profile creation (linking Auth User to Profile data).
2. Allow modification of: First Name, Last Name, Image URL, Bio, and Addresses.
3. Manage Technology Skills: Add or Remove.
4. Handle account deletion (ensure cascading deletes for user data) and Logout.
