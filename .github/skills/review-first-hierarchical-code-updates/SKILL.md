---
name: review-first-hierarchical-code-updates
description: "Use when a user wants code changes reported and applied in a strict top-to-bottom hierarchy: feature goal, parent module, child component, affected section, exact code change, reason, and validation outcome. This skill is for hierarchical update summaries while implementing add, update, delete, or refactor work, not for vague or flat progress notes."
---

# Hierarchical Code Update Reporting

Use this skill when the user wants updates to be explained as a hierarchy, from the broadest feature context down to the exact code block being changed.

This is not only a review gate. It is a required update format during implementation: each new code step must be reported in top-down order before moving to the next one.

## Core Rule

When a prompt requests to add, update, delete, refactor, patch, or modify code, the agent must present the work in this order:

1. Goal / outcome
2. Parent feature or module
3. Child component or section
4. Exact file(s) involved
5. Exact code change being made
6. Why this change is needed
7. Validation result or next check

This is the user’s required “up-down logic” update flow.

## Required Behavior

### During implementation

Every update must be communicated in hierarchical structure, such as:

- Feature goal
- Parent screen or module
- Child component or logic block
- File and section touched
- Exact code change
- Reason for the code change
- Validation result or next step

Example structure:

- Feature: Procedure management
- Parent: Exchange details screen
- Child: ActionPanel component
- File: src/pages/file/exchangeDetails/DetailsComponents/ActionPanel.jsx
- Section: delete action handler
- Change: replace browser confirm with reusable popup and call delete API after confirmation
- Reason: keep destructive action consistent with the app theme and user-controlled flow
- Validation: static diagnostics pass; runtime check pending user approval

### No flat progress notes

Do not say only "I updated the file" or "I changed the component" without describing the surrounding hierarchy.

The agent must explain the exact update path from feature level down to the affected code block.

### Incremental progression

If the user wants changes in steps, the agent must report one layer at a time and wait for the user to confirm before continuing to the next update.

## Decision Points

### If the user asks for an add, update, or delete

- Show the top-level feature goal.
- Explain the parent and child structure involved.
- Mention the exact file and code section.
- State the exact change being made.
- Clarify why it belongs there.
- Give the validation status or next validation step.

### If the user wants incremental rollout

- Break the task into ordered updates.
- Report each update in hierarchical form.
- Pause after each step and wait for approval before moving down to the next level.

### If the user wants a broader refactor

- Present the dependency layers from higher to lower level.
- Explain the impacts before code changes.
- Keep the narrative structured and explicit.

## Completion Checks

The task is complete only when all of the following are true:

- The update was explained in hierarchical order.
- The parent-to-child path was visible.
- The exact file and code section were identified.
- The change itself was clearly described.
- The validation status was included.

## Output Style

Use a structured update format like this:

- Level 1: Feature / goal
- Level 2: Parent module or screen
- Level 3: Child component / logic block
- Level 4: File and section
- Level 5: Exact code change
- Level 6: Why this change is needed
- Level 7: Validation result or next step

This should feel like a code-change summary, not a vague review message.

## Example Prompts

- "Show me the update in hierarchical order from feature to code"
- "Explain the parent-to-child change flow before the next code update"
- "Give me the exact file and section being changed, then continue"
- "Break this task into top-down implementation updates and wait for my confirmation"
- "I want every code change explained from the feature level down to the specific block"

## Related Customizations

- Create a prompt for hierarchical implementation summaries
- Create a prompt for step-by-step top-down code updates
- Create instructions for reporting changes by feature → component → code block
