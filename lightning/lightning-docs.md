# Lightning docs

Syntax only. TanStack Query 5.105, Zustand 5, Redux Toolkit 2.13, React 19.

## fetch

```ts
const res = await fetch(url, {
   method: "POST", // "PATCH" | "DELETE"
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(data),
   signal: controller.signal,
});
if (!res.ok) throw new Error(`HTTP ${res.status}`); // fetch does not reject on 4xx/5xx
const data = await res.json(); // a Promise
const body = await res.json().catch(() => null);
throw new Error(body?.error ?? `HTTP ${res.status}`);

const controller = new AbortController();
controller.abort(); // fetch rejects with AbortError
```

## Promises

```ts
await Promise.all([a, b]); // rejects on first failure
await Promise.allSettled([a, b]); // [{ status: "fulfilled", value } | { status: "rejected", reason }]
await Promise.race([a, b]);
await Promise.any([a, b]);
const t = setTimeout(fn, ms); clearTimeout(t);
queueMicrotask(fn);
// order: sync, microtasks (.then), timers
```

## JS

```ts
arr.map((item, index, array) => x);
arr.filter((item, index, array) => boolean);
arr.reduce((acc, item, index, array) => acc, init);
arr.find(fn); arr.findIndex(fn); arr.some(fn); arr.every(fn); arr.flatMap(fn);
arr.sort((a, b) => number); // mutates; copy first
arr.slice(start, end);

Object.entries(o); Object.fromEntries(entries); Object.keys(o);
const { a, b = 1, ...rest } = obj;
const [first, ...others] = arr;
obj?.a?.b; x ?? y; obj.list ??= [];
[...new Set(arr)];
new Map<K, V>(); map.get(k); map.set(k, v); map.has(k); map.delete(k);
structuredClone(obj);
new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
```

## TypeScript

```ts
type A = { type: "a"; id: string } | { type: "b" }; // discriminated union
Item["id"]; Omit<Item, "id">; Pick<Item, "id">; Partial<Item>; Record<string, T>;
ReturnType<typeof fn>; typeof value;
function f<T>(x: T): T {}
reduce<Record<string, Item[]>>(...); // generic arg types the accumulator
```

## React

```tsx
const [s, setS] = useState<T>(init);
setS((prev) => next);

useEffect(() => {
   return () => {}; // cleanup: before next run and on unmount
}, [deps]); // none: every render | []: mount | [a]: when a changes

const ref = useRef<T>(init); ref.current;
const v = useMemo(() => value, [deps]);
const fn = useCallback((args) => {}, [deps]);
const C = memo(function C(props) {});

const [state, dispatch] = useReducer(reducer, initialState);
// reducer: (state, action) => newState

const Ctx = createContext<T | null>(null);
<Ctx.Provider value={v}>{children}</Ctx.Provider>;
const v = useContext(Ctx);

class EB extends Component<Props, { error: Error | null }> {
   state = { error: null };
   static getDerivedStateFromError(error: Error) { return { error }; }
   componentDidCatch(error: Error, info: ErrorInfo) {}
}
```

## TanStack Query

```tsx
const [client] = useState(() => new QueryClient({ defaultOptions: { queries: {}, mutations: {} } }));
<QueryClientProvider client={client}>{children}</QueryClientProvider>;
```

### useQuery

```ts
const { data, error, status, isPending, isFetching, isLoading, isError, isSuccess, refetch } = useQuery({
   queryKey: ["guest", id],
   queryFn: ({ queryKey, signal, meta }) => Promise<T>, // must throw on failure
   enabled: boolean,
   staleTime: ms, // default 0
   gcTime: ms, // default 5 min
   retry: number | boolean | ((failureCount, error) => boolean),
   retryDelay: ms | ((failureCount, error) => ms),
   refetchInterval: ms,
   refetchOnWindowFocus: boolean,
   select: (data) => selected,
   placeholderData: value | ((previousData, previousQuery) => value), // import { keepPreviousData }
   initialData: T,
});
// status: "pending" | "error" | "success"
```

### queryOptions

```ts
const opts = (id: string) => queryOptions({ queryKey: ["guest", id], queryFn: () => fetchGuest(id) });
useQuery(opts(id));
```

### queryClient

```ts
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey });
queryClient.refetchQueries({ queryKey });
queryClient.cancelQueries({ queryKey });
queryClient.setQueryData<T>(queryKey, (old: T | undefined) => T);
queryClient.getQueryData<T>(queryKey);
queryClient.prefetchQuery(options);
queryClient.removeQueries({ queryKey });
```

### useMutation

```ts
const { mutate, mutateAsync, isPending, isError, error, data, reset } = useMutation({
   mutationFn: (variables) => Promise<T>,
   onMutate: (variables, context) => onMutateResult,
   onSuccess: (data, variables, onMutateResult, context) => {},
   onError: (error, variables, onMutateResult | undefined, context) => {},
   onSettled: (data | undefined, error | null, variables, onMutateResult | undefined, context) => {},
});
// onMutateResult = whatever onMutate returned. context = { client, meta, mutationKey }.

mutate(variables, { onSuccess, onError, onSettled }); // per-call callbacks, same signatures
await mutateAsync(variables); // throws on failure
```

### useInfiniteQuery

```ts
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
   queryKey,
   queryFn: ({ pageParam }) => Promise<Page>,
   initialPageParam: 0,
   getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => param | undefined | null,
});
data.pages; // Page[]
```

## Zustand

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

const useStore = create<State>()((set, get) => ({
   count: 0,
   inc: () => set((s) => ({ count: s.count + 1 })), // set(partial | (state) => partial)
}));

useStore((s) => s.count);
useStore(useShallow((s) => ({ a: s.a, b: s.b })));

create<State>()(persist((set, get) => ({}), { name: "key", partialize: (s) => ({ count: s.count }) }));

useStore.getState();
useStore.setState({ count: 0 });
useStore.subscribe((state, prevState) => {}); // returns unsubscribe
```

## Redux Toolkit

```ts
const slice = createSlice({
   name: "items",
   initialState,
   reducers: {
      added: (state, action: PayloadAction<Item>) => { state.push(action.payload); }, // mutate OR return, not both
      removed: (state, action: PayloadAction<string>) => state.filter((i) => i.id !== action.payload),
   },
   extraReducers: (builder) => {
      builder.addCase(thunk.pending, (state, action) => {});
      builder.addCase(thunk.fulfilled, (state, action) => {}); // action.payload
      builder.addCase(thunk.rejected, (state, action) => {}); // action.error.message
   },
});
export const { added, removed } = slice.actions;
export default slice.reducer;

const thunk = createAsyncThunk("items/fetch", async (arg: Arg, { dispatch, getState, rejectWithValue, signal }) => {
   return result; // becomes fulfilled action.payload; a throw becomes rejected
});
dispatch(thunk(arg));

const store = configureStore({ reducer: { items: slice.reducer } });
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
const useAppDispatch = useDispatch.withTypes<AppDispatch>();
const useAppSelector = useSelector.withTypes<RootState>();
<Provider store={store}>{children}</Provider>;

const selectX = createSelector([selectA, selectB], (a, b) => result); // memoized; array/object results need it

store.dispatch(action);
store.getState();
store.subscribe(() => {});
```

## React 19 and Suspense

```tsx
// Suspense
const Lazy = lazy(() => import("./X")); // default export, defined at module level
<Suspense fallback={<p>Loading...</p>}>{children}</Suspense>;
<ErrorBoundary><Suspense fallback={...}>{children}</Suspense></ErrorBoundary>; // boundary outside

// use: reads a promise or context during render
const data = use(promise); // suspends; a rejection goes to the error boundary; the promise must be stable
const ctx = use(Context); // may be called after an early return or inside an if

// transitions
const [isPending, startTransition] = useTransition();
startTransition(() => setState(x));
startTransition(async () => { await save(); }); // React 19: async allowed, isPending until it settles
const deferred = useDeferredValue(value, initialValue?); // wrap the slow child in memo

// forms
<form action={(formData: FormData) => {}} />; // or a function from useActionState
const [state, formAction, isPending] = useActionState(
   async (prevState, formData: FormData) => nextState,
   initialState,
);
import { useFormStatus } from "react-dom";
const { pending, data, method, action } = useFormStatus(); // in a child of the <form>
const [optimistic, addOptimistic] = useOptimistic(state, (current, optimisticValue) => next); // call inside an action

// React 19 syntax
function Input({ ref, ...props }: React.ComponentProps<"input">) { return <input ref={ref} {...props} />; } // no forwardRef
<Ctx value={v}>{children}</Ctx>; // no .Provider

// TanStack
const { data } = useSuspenseQuery({ queryKey, queryFn }); // data is never undefined; no isPending
```

- Next.js: `loading.tsx` wraps the page in `<Suspense>` automatically. With `cacheComponents: true`, uncached or runtime data in layouts and pages must sit inside `<Suspense>`.
