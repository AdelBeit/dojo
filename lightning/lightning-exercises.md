# Lightning exercises

Temporary file. About 2 to 3 minutes each. Write your answer in the code block under each exercise, then tell me which one to review. Ask for a hint if you're stuck.

Shared types and API (restaurant tab):

```ts
type Item = {
  id: string;
  guestId: string;
  name: string;
  priceCents: number;
  paid: boolean;
};
type Guest = { id: string; name: string; owesCents: number; itemCount: number };
type NewItem = { guestId: string; name: string; priceCents: number };
```

| Endpoint                                        | Success            | Failure                 |
| ----------------------------------------------- | ------------------ | ----------------------- |
| `GET /api/items?limit=60`                       | `Item[]`           | non-2xx                 |
| `POST /api/items` body `NewItem`                | `Item`, status 201 | 400 `{ error: string }` |
| `PATCH /api/items/:id` body `{ paid: boolean }` | the updated `Item` | 404 `{ error: string }` |
| `GET /api/guests/:id`                           | `Guest`            | 404 `{ error: string }` |

---

## 1. POST request

Write `async function addItem(input: NewItem): Promise<Item>`. Send the body as JSON and return the created item. If the server refuses, throw an `Error` with the server's message. `POST /api/items/`

```ts

```

## 2. PATCH request

Write `async function markPaid(id: string): Promise<Item>`. Return the updated item. On failure, throw an `Error` with the server's message, or `HTTP <status>` if the body has none.

```ts

```

## 3. useReducer

Without any component: write the state shape, the `Action` union type and the `reducer`.

State is `{ items: Item[]; filter: "all" | "paid" | "unpaid" }`. Actions: add an item, mark an item paid (by id), remove an item (by id), change the filter. Never mutate the state. Then write the one `dispatch` call that marks `"item-0001"` paid.

```ts

```

## 4. TanStack: a query

Write `useItems()` with `useQuery` for `GET /api/items?limit=60`. A failed request must count as an error. Data should be treated as fresh for 30 seconds. Return the query result.

```ts

```

## 5. TanStack: query keys and `enabled`

Write `useGuest(id: string | undefined)` with `useQuery` for `GET /api/guests/:id`. Each guest must be cached separately, and nothing should be requested while `id` is missing.

```ts

```

## 6. TanStack: a mutation and invalidation

Write `useMarkPaid()` with `useMutation` using the PATCH from exercise 2. After it succeeds, the items list and every cached guest must refetch. Use these keys: items is `["items"]`, a guest is `["guest", id]`.

```ts

```

## 7. TanStack: optimistic update with rollback

Extend `useMarkPaid()` so the item flips to paid in the cache immediately. If the request fails, put the previous list back. When it settles either way, refetch `["items"]`.

```ts

```

---

# Round 2

For these, assume `fetchItems(): Promise<Item[]>` already exists and throws on a bad response, and that `useItems`, `useGuest`, `addItem` and `markPaid` from above work.

## 8. TanStack: `select`

Write `useItemNames()` that returns only an array of the item names. It must share the `["items"]` cache with `useItems` (one request, not two), and it must not store the names array in state.

```ts

```

## 9. TanStack: polling and retry options

Write a query on `["items"]` that refetches every 10 seconds, retries a failed request twice with a 1 second wait, and does not refetch when the window regains focus.

```ts

```

## 10. TanStack: a dependent query

Write `useFirstItemGuest()` that returns the guest of the first item in the list. It may only ask for the guest after the items have loaded. Reuse `useItems` and `useGuest`.

```ts

```

## 11. TanStack: update the cache from a mutation's response

Write `useAddItem()` with `useMutation` and `addItem`. When it succeeds, add the created item to the `["items"]` cache directly, with no refetch.

```ts

```

## 12. TanStack: using a mutation in a component

Write a `PayButton({ id })` component that uses `useMarkPaid()`. The button is disabled while the request runs and says "Paying...". If it fails, show the error message under it.

```tsx

```

## 13. TanStack: `queryOptions` and prefetching

Write `guestQueryOptions(id)` using `queryOptions`, so the same key and function can be used in two places: inside `useGuest(id)`, and in a `GuestLink` component that prefetches the guest when the mouse enters the link.

```tsx
// your answer
```

## 14. TanStack: client defaults

Create the `QueryClient` the right way inside a component, so that every query defaults to fresh for 1 minute, retries once, and does not refetch on window focus.

```tsx
// your answer
```

## 15. JS: closures and `var`

What does this print, and why? Give two different fixes so it prints 0, 1, 2.

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

```js
// your answer
```

## 16. JS: the event loop

In what order do the letters print, and why?

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
queueMicrotask(() => console.log("D"));
console.log("E");
```

```js
// your answer
```

## 17. JS: debounce

Write `debounce(fn, ms)`. It returns a function that waits until `ms` have passed since the last call, then calls `fn` once with the latest arguments.

```ts
// your answer
```

## 18. JS: `Promise.allSettled`

Write `async function loadGuests(ids: string[]): Promise<Guest[]>`. It fetches every guest in parallel and returns only the ones that loaded. One failure must not lose the others. Use `GET /api/guests/:id`.

```ts
// your answer
```

## 19. JS: `reduce`

Write `groupByGuest(items)` returning `Record<string, Item[]>` (items grouped by `guestId`), and `owedByGuest(items)` returning `Record<string, number>` (the sum of `priceCents` of each guest's unpaid items).

```ts
// your answer
```

## 20. JS: shallow copy

What does this print, and why? How would you copy `a` so that changing `b` leaves `a` alone?

```js
const a = { x: { y: 1 } };
const b = { ...a };
b.x.y = 2;
console.log(a.x.y);
```

```js
// your answer
```

## 21. JS: memoize

Write `memoize(fn)` for a function that takes one argument. Calling the result twice with the same argument must call `fn` only once. It must also work when `fn` returns a falsy value like `0` or `""`.

```ts
// your answer
```

## 22. JS: a retry helper

Write `async function retry<T>(fn: () => Promise<T>, times: number): Promise<T>`. It calls `fn`, and if it rejects it tries again, up to `times` attempts in total. If every attempt fails, throw the last error.

```ts
// your answer
```

## 23. React: stale closure

This counter gets stuck at 1. Why? Fix it two ways, and say which one you prefer.

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{count}</p>;
}
```

```tsx
// your answer
```

## 24. React: `useDebounce`

Write `useDebounce<T>(value: T, ms = 300): T`. It returns the value only after it has stopped changing for `ms`.

```ts
// your answer
```

## 25. React: a controlled search box

Write `SearchableList({ items })`. It has a text input and shows only the items whose name contains the text (ignoring case). Use as little state as possible.

```tsx
// your answer
```

## 26. React: `usePrevious`

Write `usePrevious<T>(value: T): T | undefined`, returning the value from the previous render.

```ts
// your answer
```

## 27. React: an effect with cleanup

Write `WindowWidth`, a component that shows the current `window.innerWidth` and keeps it updated when the window is resized. It must work in Next.js without a hydration mismatch.

```tsx
// your answer
```

## 28. React: context

Write a `ThemeProvider` and a `useTheme()` hook. The theme is `"light" | "dark"` and starts as light. `useTheme()` returns `{ theme, toggle }` and throws a clear error if used outside the provider.

```tsx
// your answer
```

## 29. React: an error boundary

Write an `ErrorBoundary` component that shows the error message and a "Try again" button instead of its children when a child throws while rendering. The button must make it try rendering the children again.

```tsx
// your answer
```

---

# Round 3: Zustand and Redux

Zustand exercises use `create` from `zustand`. Redux exercises use Redux Toolkit and `react-redux`. Both use the `Item` type from above.

## 30. Zustand: create a store

Create `useStarStore` with `starred: string[]` (item ids) and a `toggle(id)` action that adds the id if it's missing and removes it if it's there. Type it with TypeScript.

```ts
// your answer
```

## 31. Zustand: selectors

Write `StarButton({ id })`. It shows a filled star if this item is starred and an empty star otherwise, and clicking toggles it. It must re-render only when this one item's starred state changes, not when any other item is starred.

```tsx
// your answer
```

## 32. Zustand: persist

Extend the store from exercise 30 so `starred` is saved to `localStorage` under the key `"stars"` and restored on reload. Only `starred` should be saved, not the actions.

```ts
// your answer
```

## 33. Zustand: outside React

Create a `useToastStore` with `toasts: string[]` and `addToast(message)`. Then write a plain function `onFetchError(message: string)`, outside any component, that adds a toast.

```ts
// your answer
```

## 34. Zustand: an async action

Create `useItemsStore` with `items`, `status` (`"idle" | "loading" | "success" | "error"`), `error`, and a `fetchItems()` action for `GET /api/items?limit=60` that updates them. Failed requests must set the error status.

```ts
// your answer
```

## 35. Redux Toolkit: a slice

Write an `itemsSlice` with `createSlice`. The state is `Item[]`. Actions: `added` (an item), `markedPaid` (an id), `removed` (an id). Export the actions and the reducer.

```ts
// your answer
```

## 36. Redux Toolkit: store and typed hooks

Write the `store` with `configureStore` using the slice reducer under the key `items`. Export the `RootState` and `AppDispatch` types and typed `useAppSelector` and `useAppDispatch` hooks. Then show how the app gets the store.

```tsx
// your answer
```

## 37. Redux Toolkit: an async thunk

Write a `fetchItems` thunk with `createAsyncThunk` for `GET /api/items?limit=60`, and a slice with state `{ items, status, error }`. Use `extraReducers` to handle pending, fulfilled and rejected.

```ts
// your answer
```

## 38. Redux Toolkit: a memoized selector

Write `selectUnpaidItems`, which returns the unpaid items from `state.items.items`, using `createSelector`. Explain what goes wrong if you write it as a plain `state.items.items.filter(...)` and use it with `useSelector`.

```ts
// your answer
```

## 39. Redux Toolkit: outside React

Assume a `toastAdded(message: string)` action exists. Write `onFetchError(message: string)`, outside any component, that adds a toast, and `isDark()` that returns whether the current theme in the store (`state.theme.mode`) is `"dark"`.

```ts
// your answer
```

## 40. Concept: which one?

In your own words, in a few bullets: when would you use Context with `useReducer`, when Zustand, and when Redux Toolkit? Where does TanStack Query fit?

```md
your answer
```

---

# Round 4: React 19 and Suspense

Assume `fetchGuest(id): Promise<Guest>`, `addItem`, `markPaid` and the `ThemeContext` from above exist. Hooks come from `react`, except `useFormStatus`, which comes from `react-dom`.

## 41. Suspense: lazy loading

`GuestDetail` is a heavy component in its own file (a default export). Show it only after a button is clicked, load its code only then, and show "Loading..." while it loads.

```tsx

```

## 42. Suspense with an error boundary

You lazy-load a component and the request for its code might fail. Write only the JSX tree that shows "Loading..." while it loads and your `ErrorBoundary`'s fallback if it fails. Which one goes on the outside?

```tsx

```

## 43. React 19: `use` with a promise

Write `GuestName({ guestPromise })` that reads the promise with `use` and renders the guest's name. Then write the parent that creates the promise and shows "Loading..." until it resolves. The promise must not be recreated on every render.

```tsx

```

## 44. React 19: `use` with context

Write `ThemeBadge({ show })` that renders nothing when `show` is false, and otherwise reads `ThemeContext` with `use` and shows the theme name. Why can't you do this with `useContext`?

```tsx

```

## 45. `useTransition`

Clicking a tab button calls `setTab(next)`, and rendering the new tab is slow, so the screen freezes. Use `useTransition` so the old tab stays on screen and responsive, and the clicked button shows a pending state.

```tsx

```

## 46. React 19: async transitions

Write `PayButton({ id })`. Clicking runs `markPaid(id)` inside a transition. The button is disabled and says "Saving..." until the request finishes, with no `useState` for the loading flag.

```tsx

```

## 47. `useDeferredValue`

A search box filters a very slow list. Keep typing responsive by letting the list lag behind the input. Show the input and the list, and say what you must also do to the list component for this to help.

```tsx

```

## 48. React 19: form actions and `useActionState`

Write `AddItemForm` using `<form action={...}>` and `useActionState`. The action calls `addItem` with the form's values (`guestId`, `name`, `price` in dollars). It returns the error message on failure and `null` on success. Show the error and disable the button while it runs.

```tsx

```

## 49. React 19: `useFormStatus`

Write a `SubmitButton` that disables itself and shows "Saving..." while the form it is inside is submitting. It takes no props about the form. Where must it be rendered?

```tsx

```

## 50. React 19: `useOptimistic`

Write `ItemList({ items, onAdd })`. Submitting its form shows the new item in the list immediately, before `onAdd(name)` (a function that returns a promise) finishes. When it finishes, the list shows the real `items` again.

```tsx

```

## 51. React 19: `ref` as a prop and `Context` as a provider

Write a `TextInput` component that passes a `ref` through to its `<input>` without `forwardRef`. Then write the line that provides `ThemeContext` without `.Provider`.

```tsx

```

## 52. Suspense with TanStack: `useSuspenseQuery`

Write `GuestName({ id })` with `useSuspenseQuery`, with no loading or error checks inside it. Then write the JSX around it that handles loading and errors.

```tsx

```

## 53. Concept: Suspense, React or Next.js?

In a few bullets: which parts of Suspense are React and which are Next.js? What does `loading.tsx` do? What does this project's `cacheComponents: true` require about Suspense?

```md

```
