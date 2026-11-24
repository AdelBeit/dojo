"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Option = { value: string; label: string; disabled?: boolean };

const OPTIONS: Option[] = [
   { value: "apple", label: "Apple" },
   { value: "banana", label: "Banana" },
   { value: "cherry", label: "Cherry" },
   { value: "date", label: "Date", disabled: true },
   { value: "elderberry", label: "Elderberry" },
];

const enabled = OPTIONS.filter((o) => !o.disabled);

export function Dropdown() {
   const id = useId();
   const [open, setOpen] = useState(false);
   const [selected, setSelected] = useState<string | null>(null);
   const [active, setActive] = useState<string | null>(null);
   const rootRef = useRef<HTMLDivElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);
   const listRef = useRef<HTMLUListElement>(null);

   const optionId = (value: string) => `${id}-${value}`;
   const selectedLabel = OPTIONS.find((o) => o.value === selected)?.label;

   function openList() {
      setActive(selected ?? enabled[0].value);
      setOpen(true);
   }

   function closeList(returnFocus: boolean) {
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus();
   }

   function choose(value: string) {
      setSelected(value);
      closeList(true);
   }

   // Move focus into the list when it opens, so the keyboard keeps working there.
   useEffect(() => {
      if (open) listRef.current?.focus();
   }, [open]);

   // Clicking anywhere outside closes the list. Attached only while open.
   useEffect(() => {
      if (!open) return;
      function onPointerDown(e: MouseEvent) {
         if (!rootRef.current?.contains(e.target as Node)) closeList(false);
      }
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
   }, [open]);

   function move(delta: number) {
      const index = enabled.findIndex((o) => o.value === active);
      const next = Math.max(0, Math.min(enabled.length - 1, index + delta));
      setActive(enabled[next].value);
   }

   function onTriggerKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
         e.preventDefault();
         if (!open) openList();
      }
   }

   function onListKeyDown(e: KeyboardEvent) {
      switch (e.key) {
         case "ArrowDown":
            e.preventDefault();
            move(1);
            return;
         case "ArrowUp":
            e.preventDefault();
            move(-1);
            return;
         case "Home":
            e.preventDefault();
            setActive(enabled[0].value);
            return;
         case "End":
            e.preventDefault();
            setActive(enabled[enabled.length - 1].value);
            return;
         case "Enter":
         case " ":
            e.preventDefault();
            if (active) choose(active);
            return;
         case "Escape":
            e.preventDefault();
            closeList(true);
            return;
         case "Tab":
            closeList(false);
            return;
      }
      if (e.key.length === 1 && /\S/.test(e.key)) {
         const match = enabled.find((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
         if (match) setActive(match.value);
      }
   }

   return (
      <div ref={rootRef} className="relative inline-block">
         <button
            ref={triggerRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => (open ? closeList(false) : openList())}
            onKeyDown={onTriggerKeyDown}
            className="min-w-44 rounded border px-3 py-2 text-left"
         >
            {selectedLabel ?? "Choose a fruit"}
         </button>
         {open && (
            <ul
               ref={listRef}
               role="listbox"
               aria-label="Fruit"
               tabIndex={-1}
               aria-activedescendant={active ? optionId(active) : undefined}
               onKeyDown={onListKeyDown}
               className="absolute left-0 top-full z-10 mt-1 w-full rounded border bg-white py-1 shadow outline-none"
            >
               {OPTIONS.map((o) => (
                  <li
                     key={o.value}
                     id={optionId(o.value)}
                     role="option"
                     aria-selected={o.value === selected}
                     aria-disabled={o.disabled || undefined}
                     onClick={() => !o.disabled && choose(o.value)}
                     onMouseEnter={() => !o.disabled && setActive(o.value)}
                     className={`px-3 py-1 ${o.disabled ? "text-gray-400" : "cursor-pointer"} ${
                        active === o.value ? "bg-blue-100" : ""
                     } ${o.value === selected ? "font-semibold" : ""}`}
                  >
                     {o.label}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
