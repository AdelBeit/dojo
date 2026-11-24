## Interview drills

Timed React drills modeled on reported frontend coding screens. Each drill is its own project under `app/<name>/`:

- `README.md`: the prompt, the choices already made, every stage in order, and follow-up questions an interviewer might ask. Read the next stage only when the current one works.
- `page.tsx` (and sometimes one more starter file): the file to work in.
- Stages 1 to 3 (or 4) are about React behavior. The `Bonus` section at the end holds accessibility, HTML and CSS requirements. Do it after the stages.

Reference solutions live in the sibling `app/<name>-solution/` folder. Do not open them until the drill is done.

Forms that submit use the fake backend in `lib/fake-api.ts` (configurable delay and failures, no real network).

### If short on time, do these in order

1. `transactions`
2. `multi-step-form`
3. `code-input`
4. `signup-validation`

Then, when those four are comfortable: `contact-form`, `tooltip`, `match-the-demo`, `encode-decode`.

### Pick by concept

| Concept | Drill |
|---|---|
| Derived vs stored state, filter and search | `transactions` |
| `useReducer` vs `useState`, step navigation | `multi-step-form` |
| Refs, focus, keyboard, paste | `code-input` |
| Validation timing, live feedback, async checks, stale responses | `signup-validation` |
| Async submit, loading/error/success, double submit | `contact-form`, and stage 3 of `multi-step-form` |
| Component API design, hover/focus/Escape, written design | `tooltip` |
| Working out behavior from a running demo | `match-the-demo` |
| Shared state across forms, separating logic from UI | `encode-decode` |
