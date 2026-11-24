import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Item, NewItem } from "@/lib/restaurant-bill/types";
import { notify } from "./notify";
import { request } from "./queries";

export function useAddItem() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (input: NewItem) =>
         request<Item>("/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
         }),
      onMutate: async (input) => {
         await queryClient.cancelQueries({ queryKey: ["items"] });
         const tempId = `temp-${crypto.randomUUID()}`;
         const temp: Item = { id: tempId, ...input, paid: false };
         queryClient.setQueryData<Item[]>(["items"], (old) => (old ? [temp, ...old] : old));
         return { tempId };
      },
      onError: (_error, _input, context) => {
         if (!context) return;
         queryClient.setQueryData<Item[]>(["items"], (old) => old?.filter((i) => i.id !== context.tempId));
      },
      onSettled: () =>
         Promise.all([
            queryClient.invalidateQueries({ queryKey: ["items"] }),
            queryClient.invalidateQueries({ queryKey: ["guests"] }),
            queryClient.invalidateQueries({ queryKey: ["guest"] }),
         ]),
   });
}

export function useMarkPaid() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (id: string) =>
         request<Item>(`/api/items/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paid: true }),
         }),
      onMutate: async (id) => {
         await queryClient.cancelQueries({ queryKey: ["items"] });
         const setPaid = (paid: boolean) =>
            queryClient.setQueryData<Item[]>(["items"], (old) =>
               old?.map((i) => (i.id === id ? { ...i, paid } : i)),
            );
         setPaid(true);
         return { undo: () => setPaid(false) };
      },
      onError: (_error, _id, context) => {
         context?.undo();
         notify("Could not mark as paid, it was put back.");
      },
      onSettled: () =>
         Promise.all([
            queryClient.invalidateQueries({ queryKey: ["items"] }),
            queryClient.invalidateQueries({ queryKey: ["guest"] }),
         ]),
   });
}
