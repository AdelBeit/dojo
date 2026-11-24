import { useQuery } from "@tanstack/react-query";
import type { Guest, Item } from "@/lib/restaurant-bill/types";

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
   const res = await fetch(url, init);
   if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? `HTTP ${res.status}`);
   }
   return (await res.json()) as T;
}

export function useItems() {
   return useQuery({
      queryKey: ["items"],
      queryFn: ({ signal }) => request<Item[]>("/api/items?d=slow", { signal }),
      staleTime: 30_000,
   });
}

export function useGuest(id: string) {
   return useQuery({
      queryKey: ["guest", id],
      queryFn: ({ signal }) => request<Guest>(`/api/guests/${id}`, { signal }),
   });
}

export function useGuests() {
   return useQuery({
      queryKey: ["guests"],
      queryFn: ({ signal }) => request<Guest[]>("/api/guests", { signal }),
   });
}
