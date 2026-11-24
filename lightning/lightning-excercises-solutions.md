# Solutions for lightning-exercises.md

Try each one first. Each has the "what's being checked" line under it.

## 1. POST request

```ts
async function addItem(input: NewItem): Promise<Item> {
   const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
   });
   if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? `HTTP ${res.status}`);
   }
   return res.json();
}
```

Checked: `fetch` doesn't reject on 4xx or 5xx, so you check `res.ok` yourself. The `Content-Type` header and `JSON.stringify` are both needed. The error body might not be JSON, hence the `.catch`.

## 2. PATCH request

```ts
async function markPaid(id: string): Promise<Item> {
   const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: true }),
   });
   if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? `HTTP ${res.status}`);
   }
   return res.json();
}
```

Checked: same points as 1, plus the id in the URL and a body that only has the changed field. If an interviewer asks about duplication, say you'd pull out a small `request(url, init)` helper.

## 3. useReducer

```ts
type State = { items: Item[]; filter: "all" | "paid" | "unpaid" };

type Action =
   | { type: "added"; item: Item }
   | { type: "markedPaid"; id: string }
   | { type: "removed"; id: string }
   | { type: "filterChanged"; filter: State["filter"] };

function reducer(state: State, action: Action): State {
   switch (action.type) {
      case "added":
         return { ...state, items: [...state.items, action.item] };
      case "markedPaid":
         return {
            ...state,
            items: state.items.map((i) => (i.id === action.id ? { ...i, paid: true } : i)),
         };
      case "removed":
         return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      case "filterChanged":
         return { ...state, filter: action.filter };
   }
}

dispatch({ type: "markedPaid", id: "item-0001" });
```

Checked: a discriminated union on `type`, new objects and arrays every time (no `push`, no assigning into `state`), and a `switch` with no `default`, so TypeScript errors if you forget a case. Name actions after what happened, not what to do.

## 4. TanStack: a query

```ts
function useItems() {
   return useQuery({
      queryKey: ["items"],
      queryFn: async (): Promise<Item[]> => {
         const res = await fetch("/api/items?limit=60");
         if (!res.ok) throw new Error(`HTTP ${res.status}`);
         return res.json();
      },
      staleTime: 30_000,
   });
}
```

Checked: the `queryFn` must throw on a bad response, or the query counts a 500 as success. `staleTime` is in milliseconds. v5 takes one options object.

## 5. TanStack: query keys and `enabled`

```ts
function useGuest(id: string | undefined) {
   return useQuery({
      queryKey: ["guest", id],
      queryFn: async (): Promise<Guest> => {
         const res = await fetch(`/api/guests/${id}`);
         if (!res.ok) throw new Error(`HTTP ${res.status}`);
         return res.json();
      },
      enabled: !!id,
   });
}
```

Checked: everything the function depends on goes in the key, so each guest gets its own cache entry. `enabled: false` stops the request until the value exists.

## 6. TanStack: a mutation and invalidation

```ts
function useMarkPaid() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: markPaid,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["items"] });
         queryClient.invalidateQueries({ queryKey: ["guest"] });
      },
   });
}
```

Checked: invalidation matches by prefix, so `["guest"]` refreshes every `["guest", id]`. You get the client from `useQueryClient()`.

## 7. TanStack: optimistic update with rollback

```ts
function useMarkPaid() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: markPaid,
      onMutate: async (id: string) => {
         await queryClient.cancelQueries({ queryKey: ["items"] });
         const previous = queryClient.getQueryData<Item[]>(["items"]);
         queryClient.setQueryData<Item[]>(["items"], (old) =>
            old?.map((i) => (i.id === id ? { ...i, paid: true } : i)),
         );
         return { previous };
      },
      onError: (_error, _id, context) => {
         queryClient.setQueryData(["items"], context?.previous);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["items"] });
      },
   });
}
```

Checked: the order is cancel, snapshot, update, then return the snapshot as context. Cancelling first stops an in-flight refetch from overwriting your optimistic value. `onSettled` refetches so the cache ends up matching the server whether the request worked or not.

---

# Round 2

## 8. TanStack: `select`

```ts
function useItemNames() {
   return useQuery({
      queryKey: ["items"],
      queryFn: fetchItems,
      select: (items) => items.map((i) => i.name),
   });
}
```

Checked: same key means the same cache entry and one request. `select` transforms what the component sees without changing the cache, so you never copy it into state.

## 9. TanStack: polling and retry options

```ts
useQuery({
   queryKey: ["items"],
   queryFn: fetchItems,
   refetchInterval: 10_000,
   retry: 2,
   retryDelay: 1000,
   refetchOnWindowFocus: false,
});
```

Checked: `retry` is the number of retries after the first failure. `retryDelay` takes a number or a function of the attempt, which is how you do backoff. Polling pauses in a background tab unless you set `refetchIntervalInBackground`.

## 10. TanStack: a dependent query

```ts
function useFirstItemGuest() {
   const { data: items } = useItems();
   return useGuest(items?.[0]?.guestId);
}
```

Checked: a dependent query is just `enabled` on a value that comes from another query. `useGuest` already has `enabled: !!id`, so while `items` is loading the id is `undefined` and nothing is requested.

## 11. TanStack: update the cache from a mutation's response

```ts
function useAddItem() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: addItem,
      onSuccess: (created) => {
         queryClient.setQueryData<Item[]>(["items"], (old) => (old ? [...old, created] : [created]));
      },
   });
}
```

Checked: the updater gets the old value, which may be `undefined`, and must return a new array, not push into the old one. Updating from the response saves a request. Use `invalidateQueries` instead when the server decides the order or has extra fields.

## 12. TanStack: using a mutation in a component

```tsx
function PayButton({ id }: { id: string }) {
   const { mutate, isPending, isError, error } = useMarkPaid();
   return (
      <>
         <button disabled={isPending} onClick={() => mutate(id)}>
            {isPending ? "Paying..." : "Mark paid"}
         </button>
         {isError && <p role="alert">{error.message}</p>}
      </>
   );
}
```

Checked: `mutate` is fire and forget. `mutateAsync` returns a promise, so it needs a `try/catch`. The status flags (`isPending`, `isError`, `error`) come back from the hook, so you don't need your own state.

## 13. TanStack: `queryOptions` and prefetching

```tsx
function guestQueryOptions(id: string) {
   return queryOptions({
      queryKey: ["guest", id],
      queryFn: async (): Promise<Guest> => {
         const res = await fetch(`/api/guests/${id}`);
         if (!res.ok) throw new Error(`HTTP ${res.status}`);
         return res.json();
      },
   });
}

function useGuest(id: string) {
   return useQuery(guestQueryOptions(id));
}

function GuestLink({ id }: { id: string }) {
   const queryClient = useQueryClient();
   return (
      <a href={`/guests/${id}`} onMouseEnter={() => queryClient.prefetchQuery(guestQueryOptions(id))}>
         Guest
      </a>
   );
}
```

Checked: `queryOptions` keeps the key and function together, so the prefetch and the hook can't drift apart. Prefetching fills the cache, so the next `useGuest` shows data immediately. The prefetch is skipped if the data is still fresh.

## 14. TanStack: client defaults

```tsx
function Providers({ children }: { children: ReactNode }) {
   const [client] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
            },
         }),
   );
   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

Checked: `useState(() => new QueryClient(...))` creates the client once. A bare `new QueryClient()` in the body would wipe the cache on every render. Options set on one query still override these defaults.

## 15. JS: closures and `var`

Prints `3 3 3`.

`var` is function scoped, so the loop has one shared `i`. By the time the timeouts run, the loop has finished and `i` is 3.

```js
// fix 1: let makes a new binding per iteration
for (let i = 0; i < 3; i++) {
   setTimeout(() => console.log(i), 0);
}

// fix 2: capture the value in its own scope
for (var i = 0; i < 3; i++) {
   ((j) => setTimeout(() => console.log(j), 0))(i);
}
```

Checked: you can say what the closure captures (the variable, not the value) and that `let` creates a fresh variable per iteration.

## 16. JS: the event loop

Prints `A E C D B`.

Synchronous code runs first (`A`, `E`). Then the microtask queue empties, in the order things were queued (`C` from the promise, then `D` from `queueMicrotask`). Timers are macrotasks and run after that (`B`), even with a 0ms delay.

## 17. JS: debounce

```ts
function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
   let timer: ReturnType<typeof setTimeout> | undefined;
   return (...args: A) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
   };
}
```

Checked: the returned function closes over `timer`. Each call cancels the pending one, and the arguments are passed through. Throttle is the sibling: it runs at most once per interval instead of waiting for quiet.

## 18. JS: `Promise.allSettled`

```ts
async function loadGuests(ids: string[]): Promise<Guest[]> {
   const results = await Promise.allSettled(
      [...new Set(ids)].map(async (id) => {
         const res = await fetch(`/api/guests/${id}`);
         if (!res.ok) throw new Error(`HTTP ${res.status}`);
         return (await res.json()) as Guest;
      }),
   );
   return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
}
```

Checked: `Promise.all` rejects as soon as one fails. `allSettled` never rejects and reports each result, and checking `r.status` narrows the type. The `Set` dedupes the ids so you don't send the same request twice. Remember to `await` the whole thing before you use the result.

## 19. JS: `reduce`

```ts
function groupByGuest(items: Item[]): Record<string, Item[]> {
   return items.reduce<Record<string, Item[]>>((groups, item) => {
      (groups[item.guestId] ??= []).push(item);
      return groups;
   }, {});
}

function owedByGuest(items: Item[]): Record<string, number> {
   return items.reduce<Record<string, number>>((totals, item) => {
      if (!item.paid) totals[item.guestId] = (totals[item.guestId] ?? 0) + item.priceCents;
      return totals;
   }, {});
}
```

Checked: pass the starting value `{}` and always return the accumulator. Changing the accumulator inside `reduce` is fine because it's a local object you created. The generic argument types the accumulator.

## 20. JS: shallow copy

Prints `2`.

Spread copies only the first level. `b.x` and `a.x` are the same object, so changing `b.x.y` changes both.

```js
const b1 = structuredClone(a); // deep copy
const b2 = { ...a, x: { ...a.x, y: 2 } }; // copy only the path you change
```

Checked: this is the reason React state updates copy each level along the path they change.

## 21. JS: memoize

```ts
function memoize<A, R>(fn: (arg: A) => R): (arg: A) => R {
   const cache = new Map<A, R>();
   return (arg) => {
      if (cache.has(arg)) return cache.get(arg) as R;
      const result = fn(arg);
      cache.set(arg, result);
      return result;
   };
}
```

Checked: use `has`, not a truthiness check, or `0` and `""` get recomputed every time. A `Map` keys objects by reference, so two equal objects are two entries.

## 22. JS: a retry helper

```ts
async function retry<T>(fn: () => Promise<T>, times: number): Promise<T> {
   let lastError: unknown;
   for (let attempt = 0; attempt < times; attempt++) {
      try {
         return await fn();
      } catch (e) {
         lastError = e;
      }
   }
   throw lastError;
}
```

Checked: `return await fn()` matters. Without the `await`, the rejection happens after the function returned and the `catch` never sees it. You can add a delay between attempts, such as `await sleep(300 * 2 ** attempt)`.

## 23. React: stale closure

The effect runs once (`[]`), so it captured `count` as `0`. Every tick runs `setCount(0 + 1)`.

```tsx
// fix 1 (preferred): functional update, no dependency on count
useEffect(() => {
   const id = setInterval(() => setCount((c) => c + 1), 1000);
   return () => clearInterval(id);
}, []);

// fix 2: list count as a dependency (the interval restarts every tick)
useEffect(() => {
   const id = setInterval(() => setCount(count + 1), 1000);
   return () => clearInterval(id);
}, [count]);
```

Checked: fix 1 is better because the interval is created once. Fix 2 works but tears the timer down and recreates it every second.

## 24. React: `useDebounce`

```ts
function useDebounce<T>(value: T, ms = 300): T {
   const [debounced, setDebounced] = useState(value);
   useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), ms);
      return () => clearTimeout(timer);
   }, [value, ms]);
   return debounced;
}
```

Checked: the cleanup clears the previous timer on every change and on unmount. Both `value` and `ms` are dependencies.

## 25. React: a controlled search box

```tsx
function SearchableList({ items }: { items: Item[] }) {
   const [query, setQuery] = useState("");
   const visible = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
   return (
      <>
         <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search items" />
         <ul>
            {visible.map((i) => (
               <li key={i.id}>{i.name}</li>
            ))}
         </ul>
      </>
   );
}
```

Checked: `query` is the only state. `visible` is derived during render, so there's no second state and no effect. The key is a stable id. Memoize `visible` only if the list is big.

## 26. React: `usePrevious`

```ts
function usePrevious<T>(value: T): T | undefined {
   const ref = useRef<T | undefined>(undefined);
   useEffect(() => {
      ref.current = value;
   });
   return ref.current;
}
```

Checked: the effect runs after the render, so during the render `ref.current` still holds the earlier value. Writing to a ref doesn't cause a re-render. The React compiler lint rule can complain about reading a ref during render here, but this is the standard answer.

## 27. React: an effect with cleanup

```tsx
function WindowWidth() {
   const [width, setWidth] = useState(0);
   useEffect(() => {
      const onResize = () => setWidth(window.innerWidth);
      onResize();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
   }, []);
   return <p>{width}px</p>;
}
```

Checked: `window` doesn't exist on the server, and reading it in the initial state would mismatch the server HTML. So start at a fixed value and read the window in the effect. The cleanup must remove the same function you added. A lint rule may flag the direct `onResize()` call in the effect; `useSyncExternalStore` is the other way to do this.

## 28. React: context

```tsx
type Theme = "light" | "dark";
type ThemeValue = { theme: Theme; toggle: () => void };

const ThemeContext = createContext<ThemeValue | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
   const [theme, setTheme] = useState<Theme>("light");
   const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
   return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

function useTheme(): ThemeValue {
   const ctx = useContext(ThemeContext);
   if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
   return ctx;
}
```

Checked: a `null` default plus a thrown error gives a clear message and removes `null` from the return type. The `value` object is a new object every render, so every consumer re-renders when the provider does. Say you'd wrap it in `useMemo` if that mattered.

## 29. React: an error boundary

```tsx
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
   state: { error: Error | null } = { error: null };

   static getDerivedStateFromError(error: Error) {
      return { error };
   }

   reset = () => this.setState({ error: null });

   render() {
      if (this.state.error) {
         return (
            <div role="alert">
               <p>{this.state.error.message}</p>
               <button onClick={this.reset}>Try again</button>
            </div>
         );
      }
      return this.props.children;
   }
}
```

Checked: error boundaries must be class components. They catch errors thrown while rendering, in lifecycles and in constructors of their children. They don't catch errors in event handlers, async code, or the boundary itself. Resetting clears the error state so the children render again.

---

# Round 3: Zustand and Redux

## 30. Zustand: create a store

```ts
import { create } from "zustand";

type StarState = {
   starred: string[];
   toggle: (id: string) => void;
};

const useStarStore = create<StarState>()((set) => ({
   starred: [],
   toggle: (id) =>
      set((state) => ({
         starred: state.starred.includes(id) ? state.starred.filter((x) => x !== id) : [...state.starred, id],
      })),
}));
```

Checked: the `create<State>()(...)` double call is the TypeScript form. `set` merges the returned object into the state, and you still return new arrays, never push into the old one. Actions live in the store next to the data.

## 31. Zustand: selectors

```tsx
function StarButton({ id }: { id: string }) {
   const starred = useStarStore((s) => s.starred.includes(id));
   const toggle = useStarStore((s) => s.toggle);
   return (
      <button aria-pressed={starred} onClick={() => toggle(id)}>
         {starred ? "★" : "☆"}
      </button>
   );
}
```

Checked: the selector returns a boolean, and a component only re-renders when what its selector returns changes. Calling `useStarStore()` with no selector would re-render on every change to the store. `s.toggle` never changes, so that subscription is free. To select several values, use `useShallow` from `zustand/react/shallow`.

## 32. Zustand: persist

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStarStore = create<StarState>()(
   persist(
      (set) => ({
         starred: [],
         toggle: (id) =>
            set((state) => ({
               starred: state.starred.includes(id) ? state.starred.filter((x) => x !== id) : [...state.starred, id],
            })),
      }),
      {
         name: "stars",
         partialize: (state) => ({ starred: state.starred }),
      },
   ),
);
```

Checked: `persist` wraps the store creator, and `name` is the storage key (localStorage by default). `partialize` picks what to save, so functions aren't serialized. In Next.js the stored value only exists in the browser, so the first server render uses the initial state.

## 33. Zustand: outside React

```ts
type ToastState = {
   toasts: string[];
   addToast: (message: string) => void;
};

const useToastStore = create<ToastState>()((set) => ({
   toasts: [],
   addToast: (message) => set((state) => ({ toasts: [...state.toasts, message] })),
}));

function onFetchError(message: string) {
   useToastStore.getState().addToast(message);
}
```

Checked: the hook is also the store, so `getState()`, `setState()` and `subscribe()` work anywhere. Context can't do this, because a plain function has no access to a provider's value. This is the main reason people leave context.

## 34. Zustand: an async action

```ts
type ItemsState = {
   items: Item[];
   status: "idle" | "loading" | "success" | "error";
   error: string | null;
   fetchItems: () => Promise<void>;
};

const useItemsStore = create<ItemsState>()((set) => ({
   items: [],
   status: "idle",
   error: null,
   fetchItems: async () => {
      set({ status: "loading", error: null });
      try {
         const res = await fetch("/api/items?limit=60");
         if (!res.ok) throw new Error(`HTTP ${res.status}`);
         const items: Item[] = await res.json();
         set({ items, status: "success" });
      } catch (e) {
         set({ status: "error", error: e instanceof Error ? e.message : "Something went wrong" });
      }
   },
}));
```

Checked: actions can be async, and no middleware is needed. You call `set` at each step. Handle the failure yourself, since `fetch` doesn't reject on a bad status.

## 35. Redux Toolkit: a slice

```ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const itemsSlice = createSlice({
   name: "items",
   initialState: [] as Item[],
   reducers: {
      added: (state, action: PayloadAction<Item>) => {
         state.push(action.payload);
      },
      markedPaid: (state, action: PayloadAction<string>) => {
         const item = state.find((i) => i.id === action.payload);
         if (item) item.paid = true;
      },
      removed: (state, action: PayloadAction<string>) => state.filter((i) => i.id !== action.payload),
   },
});

export const { added, markedPaid, removed } = itemsSlice.actions;
export default itemsSlice.reducer;
```

Checked: inside `createSlice`, "mutating" code like `state.push` is safe because Immer turns it into an immutable update. In a reducer you either change `state` or return a new value, never both. The action creators are generated from the reducer names.

## 36. Redux Toolkit: store and typed hooks

```tsx
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import itemsReducer from "./itemsSlice";

export const store = configureStore({
   reducer: { items: itemsReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// at the root of the app
<Provider store={store}>
   <App />
</Provider>;
```

Checked: the state type is inferred from the store, so it never goes out of date. The typed hooks save you from annotating every selector and dispatch. The `Provider` is what makes the store available to components.

## 37. Redux Toolkit: an async thunk

```ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchItems = createAsyncThunk("items/fetch", async () => {
   const res = await fetch("/api/items?limit=60");
   if (!res.ok) throw new Error(`HTTP ${res.status}`);
   return (await res.json()) as Item[];
});

type ItemsState = {
   items: Item[];
   status: "idle" | "loading" | "success" | "error";
   error: string | null;
};

const initialState: ItemsState = { items: [], status: "idle", error: null };

const itemsSlice = createSlice({
   name: "items",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchItems.pending, (state) => {
            state.status = "loading";
            state.error = null;
         })
         .addCase(fetchItems.fulfilled, (state, action) => {
            state.status = "success";
            state.items = action.payload;
         })
         .addCase(fetchItems.rejected, (state, action) => {
            state.status = "error";
            state.error = action.error.message ?? "Something went wrong";
         });
   },
});
```

Checked: the thunk creates three actions (pending, fulfilled, rejected), and a thrown error becomes `rejected`. `extraReducers` with the builder form is how a slice reacts to actions it didn't define. You dispatch it with `dispatch(fetchItems())`.

## 38. Redux Toolkit: a memoized selector

```ts
import { createSelector } from "@reduxjs/toolkit";

const selectItems = (state: RootState) => state.items.items;

export const selectUnpaidItems = createSelector([selectItems], (items) => items.filter((i) => !i.paid));
```

Checked: `useSelector` re-renders the component when the selected value changes by reference. A plain `.filter(...)` returns a new array every time it runs, so the component re-renders after every store update, even unrelated ones, and React-Redux warns about it in development. `createSelector` returns the same array until `state.items.items` changes.

## 39. Redux Toolkit: outside React

```ts
import { store } from "./store";
import { toastAdded } from "./toastsSlice";

function onFetchError(message: string) {
   store.dispatch(toastAdded(message));
}

function isDark(): boolean {
   return store.getState().theme.mode === "dark";
}
```

Checked: the store is a plain module-level object, so `dispatch` and `getState` work anywhere, with no hooks. This is why Redux and Zustand fit code outside the component tree, like request handlers or timers.

## 40. Concept: which one?

- **Context with `useReducer`:** best for small state that rarely changes (a theme, the current user). No extra dependency. The downside is that every consumer re-renders when the value changes, and a plain function can't reach it.
- **Zustand:** a small API with no provider. Components subscribe through selectors, so only the ones whose slice changed re-render. It works outside React and has middleware such as `persist`. A good default for medium-sized client state.
- **Redux Toolkit:** best for large apps and teams that want a strict structure. You get slices, devtools with time travel, middleware, and tools for async work and listening to actions. It costs more setup.
- **TanStack Query:** none of the above is the place for server data. Use Query for data from the API (caching, refetching, retries), and keep only real client state (selection, theme, form drafts) in context, Zustand or Redux.

---

# Round 4: React 19 and Suspense

## 41. Suspense: lazy loading

```tsx
import { lazy, Suspense, useState } from "react";

const GuestDetail = lazy(() => import("./GuestDetail"));

function Page() {
   const [open, setOpen] = useState(false);
   return (
      <>
         <button onClick={() => setOpen(true)}>Show details</button>
         {open && (
            <Suspense fallback={<p>Loading...</p>}>
               <GuestDetail />
            </Suspense>
         )}
      </>
   );
}
```

Checked: `lazy` needs a default export. It's defined at module level, not inside a component. The code is only downloaded when `GuestDetail` is first rendered, and `Suspense` shows the fallback until then.

## 42. Suspense with an error boundary

```tsx
<ErrorBoundary>
   <Suspense fallback={<p>Loading...</p>}>
      <GuestDetail />
   </Suspense>
</ErrorBoundary>
```

Checked: the error boundary goes on the outside. If the load fails, the promise rejects, and the error is thrown during render of the lazy component, which bubbles up through `Suspense` to the boundary. `Suspense` only handles "not ready yet", not "failed".

## 43. React 19: `use` with a promise

```tsx
import { Suspense, use, useState } from "react";

function GuestName({ guestPromise }: { guestPromise: Promise<Guest> }) {
   const guest = use(guestPromise);
   return <p>{guest.name}</p>;
}

function Page() {
   const [guestPromise] = useState(() => fetchGuest("g01"));
   return (
      <Suspense fallback={<p>Loading...</p>}>
         <GuestName guestPromise={guestPromise} />
      </Suspense>
   );
}
```

Checked: `use` suspends the component until the promise resolves, and a rejected promise goes to the nearest error boundary. The promise has to be stable. A promise created during render would be new on every render and suspend forever. Here the lazy `useState` initializer keeps it for the component's life. In Next.js you'd usually create it in a Server Component and pass it down.

## 44. React 19: `use` with context

```tsx
import { use } from "react";

function ThemeBadge({ show }: { show: boolean }) {
   if (!show) return null;
   const { theme } = use(ThemeContext);
   return <span>{theme}</span>;
}
```

Checked: `useContext` is a hook, so it can't be called after an early return or inside a condition. `use` can be called conditionally, including in loops and after returns. That's the difference.

## 45. `useTransition`

```tsx
import { useState, useTransition } from "react";

function Tabs() {
   const [tab, setTab] = useState<Tab>("a");
   const [isPending, startTransition] = useTransition();

   function select(next: Tab) {
      startTransition(() => {
         setTab(next);
      });
   }

   return (
      <>
         {TABS.map((t) => (
            <button key={t} onClick={() => select(t)} aria-busy={isPending && t !== tab}>
               {t}
            </button>
         ))}
         <TabPanel tab={tab} />
      </>
   );
}
```

Checked: the update inside `startTransition` is marked non-urgent, so React keeps the current UI interactive and swaps in the new tab when it's ready. `isPending` is true while the new render is in progress. Updates outside the transition (like typing) stay urgent.

## 46. React 19: async transitions

```tsx
import { useTransition } from "react";

function PayButton({ id }: { id: string }) {
   const [isPending, startTransition] = useTransition();
   return (
      <button
         disabled={isPending}
         onClick={() =>
            startTransition(async () => {
               await markPaid(id);
            })
         }
      >
         {isPending ? "Saving..." : "Mark paid"}
      </button>
   );
}
```

Checked: since React 19, the function passed to `startTransition` can be `async`, and `isPending` stays true until it settles. An error thrown inside is rethrown to the nearest error boundary. State updates made after an `await` need their own `startTransition` to count as part of the transition.

## 47. `useDeferredValue`

```tsx
import { memo, useDeferredValue, useState } from "react";

const SlowList = memo(function SlowList({ query }: { query: string }) {
   // expensive render using query
   return <ul>{/* ... */}</ul>;
});

function Search() {
   const [query, setQuery] = useState("");
   const deferredQuery = useDeferredValue(query);
   return (
      <>
         <input value={query} onChange={(e) => setQuery(e.target.value)} />
         <SlowList query={deferredQuery} />
      </>
   );
}
```

Checked: the input uses the urgent `query`, the list uses `deferredQuery`, which lags and gets interrupted by new keystrokes. The list component must be wrapped in `memo`, or it re-renders with the urgent value anyway and nothing is gained.

## 48. React 19: form actions and `useActionState`

```tsx
import { useActionState } from "react";

async function submit(_prev: string | null, formData: FormData): Promise<string | null> {
   try {
      await addItem({
         guestId: String(formData.get("guestId")),
         name: String(formData.get("name")),
         priceCents: Math.round(Number(formData.get("price")) * 100),
      });
      return null;
   } catch (e) {
      return e instanceof Error ? e.message : "Something went wrong";
   }
}

function AddItemForm() {
   const [error, formAction, isPending] = useActionState(submit, null);
   return (
      <form action={formAction}>
         <input name="guestId" />
         <input name="name" />
         <input name="price" type="number" step="0.01" />
         <button disabled={isPending}>Add</button>
         {error && <p role="alert">{error}</p>}
      </form>
   );
}
```

Checked: the action receives the previous state first, then the `FormData`. `useActionState(action, initialState)` returns `[state, wrappedAction, isPending]`. The returned value becomes the new state. Gotcha: after an action finishes, React resets uncontrolled form fields, even on error. To keep what the user typed, return it in the state and use it as `defaultValue`.

## 49. React 19: `useFormStatus`

```tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
   const { pending } = useFormStatus();
   return <button disabled={pending}>{pending ? "Saving..." : "Save"}</button>;
}

// used as a child of the form
<form action={formAction}>
   <SubmitButton />
</form>;
```

Checked: `useFormStatus` reads the status of the nearest parent `<form>`, so it only works in a component rendered inside the form, not in the component that renders the `<form>` itself. It's imported from `react-dom`.

## 50. React 19: `useOptimistic`

```tsx
import { useOptimistic } from "react";

function ItemList({ items, onAdd }: { items: Item[]; onAdd: (name: string) => Promise<void> }) {
   const [optimisticItems, addOptimistic] = useOptimistic(items, (current: Item[], newItem: Item) => [
      ...current,
      newItem,
   ]);

   async function action(formData: FormData) {
      const name = String(formData.get("name"));
      addOptimistic({ id: `tmp-${crypto.randomUUID()}`, guestId: "", name, priceCents: 0, paid: false });
      await onAdd(name);
   }

   return (
      <>
         <ul>
            {optimisticItems.map((i) => (
               <li key={i.id}>{i.name}</li>
            ))}
         </ul>
         <form action={action}>
            <input name="name" />
            <button>Add</button>
         </form>
      </>
   );
}
```

Checked: `useOptimistic(state, updater)` returns `[optimisticState, addOptimistic]`. The updater gets the current state and the value you pass to `addOptimistic`. Call `addOptimistic` inside an action or transition. When the action finishes, React discards the optimistic value and shows the real `items` again, which is also how a failure rolls back.

## 51. React 19: `ref` as a prop and `Context` as a provider

```tsx
function TextInput({ ref, ...props }: React.ComponentProps<"input">) {
   return <input ref={ref} {...props} />;
}

<ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
```

Checked: in React 19, `ref` is a normal prop for function components, so `forwardRef` isn't needed. `<Context value={...}>` works as the provider, and `<Context.Provider>` is the older form.

## 52. Suspense with TanStack: `useSuspenseQuery`

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";

function GuestName({ id }: { id: string }) {
   const { data } = useSuspenseQuery({
      queryKey: ["guest", id],
      queryFn: () => fetchGuest(id),
   });
   return <p>{data.name}</p>;
}

<ErrorBoundary>
   <Suspense fallback={<p>Loading...</p>}>
      <GuestName id="g01" />
   </Suspense>
</ErrorBoundary>;
```

Checked: `data` is never `undefined`. Loading suspends and errors throw to the nearest boundary, so the component has no `isPending` or `isError` branches. `enabled` is not available on the suspense version.

## 53. Concept: Suspense, React or Next.js?

- **React:** `<Suspense fallback>`, `lazy`, and `use` are all React. `Suspense` shows a fallback while something below it isn't ready.
- **Next.js:** builds on that. A `loading.tsx` file automatically wraps its page in a `<Suspense>` boundary, so the shell can stream first and the content swaps in later. You can also place your own `<Suspense>` around a slow Server Component.
- **`cacheComponents: true`:** uncached or runtime data access in a layout or page must be wrapped in `<Suspense>`. Otherwise Next.js reports a build-time error. The static shell streams first, and the uncached content fills in.
