# Mock API

Theme: restaurant tab. Routes live in this folder. Data is in `lib/restaurant-bill/db.ts` (400 items, 12 guests, in memory, restarted with the dev server or `POST /api/dev/reset`). Behavior toggles are in `lib/restaurant-bill/behavior.ts`. Types are in `lib/restaurant-bill/types.ts`.

| Endpoint | Notes |
| --- | --- |
| `GET /api/items?limit=` | list of `Item` |
| `POST /api/items` | body `{ guestId, name, priceCents }`, 400 on bad input |
| `PATCH /api/items/:id` | body `{ paid: boolean }` |
| `GET /api/guests` | list of `Guest`, with `owesCents` |
| `GET /api/guests/:id` | one guest, `owesCents` changes when items are paid |
| `POST /api/dev/pay-random` | pays a random unpaid item ("paid at the counter") |
| `POST /api/dev/reset` | restore seed data |

Add `?d=slow`, `?d=flaky` or `?d=fail` to any endpoint to change its behavior:

- (none): about 300ms
- `slow`: about 1.5s
- `flaky`: about half the requests fail with 503
- `fail`: always 500
