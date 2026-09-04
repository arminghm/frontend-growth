# AGENTS.md

This repository is the persistent system of record for the user's frontend-engineering growth.

## Read order

Before assessing, teaching from repository context, or updating progress:

1. Read `CURRENT.md`.
2. Read `STATUS.md`.
3. Read only the relevant file(s) under `skills/`.
4. Read historical evidence only when needed to verify a change in proficiency.

Do not scan the whole repository by default.

## Evidence rules

- A topic being explained is **not** evidence of mastery.
- Prefer independent answers, applied reasoning, debugging, design decisions, and successful implementation as evidence.
- Do not upgrade a skill after one prompted/corrected answer.
- Do not downgrade a skill because of one minor slip when stronger repeated evidence exists.
- Preserve important contradictory evidence.
- Distinguish conceptual knowledge from practical experience.

## Proficiency scale

- `0 — UNKNOWN`: no demonstrated knowledge.
- `1 — AWARE`: recognizes the concept and its purpose.
- `2 — EXPLAIN`: can explain the concept accurately.
- `3 — APPLY`: can use it correctly in realistic tasks.
- `4 — REASON`: can analyze trade-offs, edge cases, and failures.
- `5 — DESIGN/TEACH`: can design complex solutions and teach the mental model clearly.

## Update protocol

After a meaningful learning or assessment session:

1. Add concise evidence under `evidence/`.
2. Update only affected `skills/*.md` files.
3. Update `STATUS.md` only if the assessment materially changed.
4. Update `CURRENT.md` with the immediate focus and next verification targets.
5. Update `ROADMAP.md` only when priorities change.
6. Update `maps/frontend.md` when the high-level skill map changes.

Keep `CURRENT.md` short. Keep this file short. Historical detail belongs in `evidence/`.

## Teaching strategy

Prioritize gaps that can misrepresent the user's engineering level in Senior Frontend interviews. Use spaced retesting: corrected topics should reappear later without hints before proficiency is upgraded.

Strong areas should be maintained with periodic system-design and applied questions rather than being retaught from zero.
