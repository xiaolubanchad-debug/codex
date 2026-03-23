# Project Agents

This project uses a small set of specialized agents for a `Next.js + Node` stack instead of one
general-purpose agent. Each agent owns a narrow area, writes down assumptions, and hands work
back in a format that other agents can continue without re-discovery.

## Shared Rules

- Start from the current repository state instead of guessing architecture.
- Do not overwrite another agent's intent without explaining why.
- Prefer small, reviewable changes over broad refactors.
- Surface blockers early, especially missing requirements or conflicting assumptions.
- Every handoff must include changed files, open questions, and verification status.
- Respect the split between UI concerns, Next.js server concerns, and Node-side business logic.
- Call out when a change affects rendering strategy, caching, authentication, or environment variables.

## Agent Directory

Agent definitions live in `.codex/agents/`.

## Routing Guide

- Use `orchestrator` to break work into tasks, sequence execution, and resolve ambiguity.
- Use `product-manager` for requirement framing, scope control, acceptance criteria, and prioritization.
- Use `ui-designer` for information hierarchy, interaction flow, visual direction, and design specifications.
- Use `architect` for Next.js structure, rendering strategy, API boundaries, and cross-cutting decisions.
- Use `frontend` for React components, layouts, forms, accessibility, and client-side behavior.
- Use `backend` for route handlers, Node services, authentication, persistence, and integrations.
- Use `qa` for page-level validation, API regression checks, and release confidence.
- Use `docs` for setup, environment variables, scripts, and developer-facing guidance.

## Handoff Contract

Every agent should hand back results in this shape:

```text
Summary:
- What changed

Files:
- path/to/file

Checks:
- Passed / not run / blocked

Assumptions:
- Important assumptions made during the task

Open Questions:
- Anything that still needs a decision
```

## Execution Pattern

1. `orchestrator` clarifies scope and chooses the smallest useful set of agents.
2. `product-manager` defines the goal, user value, constraints, and acceptance criteria when the request is still fuzzy.
3. `ui-designer` shapes page structure, interaction flow, and visual guidance before implementation when UX is part of the task.
4. `architect` steps in when the task affects routing, data fetching, auth, caching, or deployment shape.
5. `frontend` and `backend` work in parallel when file ownership does not overlap.
6. `qa` validates route behavior, API behavior, and regression risk after implementation.
7. `docs` records durable decisions when the change affects future contributors.

## Customization Notes

- If the app uses the App Router, keep server and client component boundaries explicit.
- If the app includes a separate Node service, document where Next.js ends and that service begins.
- If product work is frequent, let `product-manager` own lightweight specs such as user stories, edge cases, and done criteria.
- If the app has a strong visual brand, let `ui-designer` own spacing, typography, component states, and responsive intent.
- Keep prompts concrete and role-specific.
- If the project grows, prefer adding a new specialist over making one agent too broad.
