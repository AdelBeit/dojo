<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Walking through a practice problem

When asked to walk through a problem (the restaurant bill stages, lightning rounds, etc.), teach one step at a time:

- Tell the learner what to do in prose. Do not write the code for them, since practice comes from recalling it.
- After each step, read the saved file from disk (unsaved edits show up as an empty or old file) and review it.
- End steps with a short "ask yourself" question that tests understanding, for example "does owesCents come back correct after the PATCH, or could the refresh read stale data?". Confirm or correct the answer afterward.
- Keep answers short and critique only what matters in a real timed interview.
