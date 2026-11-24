# React Practice List

practice 1.0: restaurant bill
Theme: a restaurant tab. Every item on the tab was ordered by a guest, and many items belong to the same guest. An item is `{ id, guestId, name, priceCents, paid }`. A guest is `{ id, name, owesCents, itemCount }`.

The mock API is in `app/api` (see `app/api/README.md`). Add `?d=slow` (about 1.5s), `?d=flaky` (about half the requests fail) or `?d=fail` (always fails) to any URL.

Each stage below uses one API and, at most, one behavior variant of it.

practice 1.1:
`data.ts` exports a hard-coded `items` array. Use it to render a list: the name on top, the price and paid status under it.
- rendering lists

practice 1.2:
Same page, but the data now lives at `GET /api/items?limit=60`. Get it before you render. Show something while you wait. If the page goes away before the response arrives, the late response must not update it, and the request shouldn't be left running.
- useState
- useEffect
- data fetching
- fetch cancelling

practice 1.3:
Same page and the same URL, but now the request fails (`/api/items?limit=60&d=fail`). Handle it so the user knows what happened.
- error handling

practice 1.4:
Each item has a `guestId`. Show the guest's name on every row, from `GET /api/guests/:id?d=slow` (about 1.5s per request). There are 60 items but only 12 guests. The page shouldn't send 60 requests or take 60 waits.
- caching
- custom hooks

practice 1.5:
Same page, but the guest URL is now flaky (`GET /api/guests/:id?d=flaky`): about half of the requests fail. The names should still show up.
- retries

practice 1.6:
Add a "Mark paid" button on each unpaid item (`PATCH /api/items/:id` with `{ "paid": true }`). Each row also shows how much its guest still owes (`owesCents` from the guest), and that number has to stay right after a payment, on every row of that guest.
- mutations

practice 1.7:
Someone can also pay from another phone: `POST /api/dev/pay-random` simulates that. The page should catch up on its own, without a reload.
- polling

practice 1.8:
Redo the data handling from 1.4 to 1.7 with a library (TanStack Query), and compare what you no longer have to write.
- TanStack Query

practice 1.9:
The tab now has hundreds of items: `GET /api/items?d=slow` with no limit. Make the input box search them by name, add a paid/unpaid filter, and let the user sort by price or name. Typing must still feel instant.
- rendering lists
- memoization
- useRef
- custom hooks

practice 1.10:
Add a form that adds an item to the tab: `POST /api/items` with `{ guestId, name, priceCents }`. The new item should show up instantly. If the request fails (`POST /api/items?d=fail`), the user must be able to tell what happened and what state the list is in.
- forms
- labels
- mutations
- optimistic updates

practice 1.11:
Make "Mark paid" show up instantly too. If the request fails (`PATCH /api/items/:id?d=fail`), put things back and tell the user.
- optimistic updates

practice 1.12:
Let users star items, choose a light or dark theme, and open and close a filter panel. Stars and theme should survive a reload.
- useReducer
- context
- localStorage
- cookies

practice 1.13:
Starring on the full list of 400 items feels laggy. Separately, a plain function outside React (say, the code that handles a failed request) needs to show a toast and know the current theme. Rework where the state lives, and try two different approaches. Be ready to say when you'd keep what you had.
- Zustand
- Redux

practice 1.14:
One broken section shouldn't take down the page (`GET /api/guests/:id?d=fail`). A guest's receipt view is heavy, so only load it when someone opens it. Loading, error and empty handling is copy-pasted around the app, so centralize it. Add tests for the guest name display and for marking an item as paid.
- error boundaries
- Suspense
- render props
- testing
