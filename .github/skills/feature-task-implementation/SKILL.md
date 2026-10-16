---
name: feature-task-implementation
description: 'Use before implementing a feature or coding task. First present a high-level implementation outline and wait for the user's approval; if they decline, suggest alternative approaches.'
argument-hint: 'Describe the feature or task to implement'
user-invocable: true
---

# Feature and Task Implementation

Use this workflow whenever the user asks you to implement a feature or coding task.

## Procedure

1. **Understand the request.** Inspect only enough nearby code, tests, and applicable instructions to identify the likely implementation surface, relevant behavior, and a useful validation check. Ask a focused question if a decision that materially changes the solution is unclear.
2. **Present the proposal first.** Before editing files, give a concise, high-level outline of the parts you would create or change, the intended behavior, and the main validation you would run. Keep the outline proportional to the task; for a small task, a short list or sentence is enough.
3. **Wait for explicit approval.** For feature work and non-trivial coding tasks, do not begin implementation or make file changes until the user accepts the proposed direction. A request to implement the task is not itself approval of a proposal that has not yet been shown. Trivial, low-risk mechanical edits with an obvious intended result and no meaningful behavior or design choice may be made directly.
4. **If declined, offer alternatives.** Do not implement the declined proposal. Briefly suggest viable alternatives and explain their key tradeoffs; ask which direction the user prefers when needed.
5. **Implement the accepted approach.** Follow repository instructions and conventions, keep changes scoped, and provide concise progress updates during substantial work. If implementation reveals a material change in scope or approach, pause, explain the revised proposal, and get approval before proceeding with that change.
6. **Validate and report.** Run the most focused relevant check available. Summarize what changed, the check result, and any meaningful unverified risks.

## Interaction Rules

- Treat approval as applying only to the proposal the user saw. Do not silently expand the work beyond it.
- If the user requests a different approach, revise the outline and wait for confirmation before implementing it.
- Keep the trivial-change exception narrow: use it for clear mechanical fixes such as a typo or similarly isolated edit, not for changes that affect behavior, APIs, data, or architecture.
- Do not ask for approval again for routine details that fit within the accepted proposal and repository conventions.
