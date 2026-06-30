---
name: audit-accessibility
description: Steps to spin up the browser and test Tab focus, ARIA, and contrast
---

# Playbook: Audit Accessibility (A11y)

Use this playbook to verify that a specific page or complex component meets WCAG 2.1 AA standards.

## Step 1: Preparation
- Identify the target URL or component route to be audited.
- Ensure the local development server is running.

## Step 2: Automated Checks (Mental Sandbox)
- Review the source code for missing `alt` tags on images.
- Ensure form inputs have associated `<label>` elements or `aria-label`.
- Verify semantic HTML usage (e.g., `<main>`, `<nav>`, headings hierarchy).

## Step 3: Interactive Browser Audit
- Use the `browser_subagent` tool to navigate to the target page.
- **Task**: Instruct the subagent to simulate keyboard navigation (pressing Tab).
- Observe the focus order. Are there hidden focus traps? Is the focus indicator clearly visible?
- Test interactive elements (modals, dropdowns) with Enter/Space/Escape keys.

## Step 4: Visual Contrast Audit
- Take a screenshot of the component in both Light and Dark themes.
- Review text color against background colors for adequate contrast ratio.

## Step 5: Reporting
- Document all violations found.
- Provide actionable code snippets to resolve the identified issues (e.g., adding `aria-expanded` to a toggle button).
