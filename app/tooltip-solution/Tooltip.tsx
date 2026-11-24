"use client";

import { cloneElement, useEffect, useId, useRef, useState, type FocusEvent, type MouseEvent, type ReactElement } from "react";

type ChildProps = {
   onMouseEnter?: (e: MouseEvent) => void;
   onMouseLeave?: (e: MouseEvent) => void;
   onFocus?: (e: FocusEvent) => void;
   onBlur?: (e: FocusEvent) => void;
   "aria-describedby"?: string;
};

type Props = {
   content: string;
   children: ReactElement<ChildProps>;
   placement?: "top" | "bottom";
   delayMs?: number;
   onOpenChange?: (open: boolean) => void;
};

export function Tooltip({ content, children, placement = "top", delayMs = 0, onOpenChange }: Props) {
   const id = useId();
   const [pointerOver, setPointerOver] = useState(false);
   const [delayElapsed, setDelayElapsed] = useState(false);
   const [focused, setFocused] = useState(false);
   const [dismissed, setDismissed] = useState(false);

   // Hover opens after the delay. The timer is an effect, so leaving or unmounting cancels it.
   useEffect(() => {
      if (!pointerOver || delayMs <= 0) return;
      const timer = setTimeout(() => setDelayElapsed(true), delayMs);
      return () => {
         clearTimeout(timer);
         setDelayElapsed(false);
      };
   }, [pointerOver, delayMs]);

   // Open is derived. Focus never waits for the delay. Escape (dismissed) wins over both.
   const hoverOpen = pointerOver && (delayMs <= 0 || delayElapsed);
   const open = !dismissed && (hoverOpen || focused);

   // The callback tells the parent about a change. It is not called for the initial render.
   const onOpenChangeRef = useRef(onOpenChange);
   useEffect(() => {
      onOpenChangeRef.current = onOpenChange;
   });
   const previous = useRef(false);
   useEffect(() => {
      if (previous.current !== open) {
         previous.current = open;
         onOpenChangeRef.current?.(open);
      }
   }, [open]);

   // Escape listens on the document, only while open, because focus may not be on the trigger.
   useEffect(() => {
      if (!open) return;
      function onKeyDown(e: KeyboardEvent) {
         if (e.key === "Escape") setDismissed(true);
      }
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
   }, [open]);

   const child = children;
   return (
      <span className="relative inline-block">
         {cloneElement(child, {
            onMouseEnter: (e: MouseEvent) => {
               child.props.onMouseEnter?.(e);
               setDismissed(false);
               setPointerOver(true);
            },
            onMouseLeave: (e: MouseEvent) => {
               child.props.onMouseLeave?.(e);
               setPointerOver(false);
            },
            onFocus: (e: FocusEvent) => {
               child.props.onFocus?.(e);
               setDismissed(false);
               setFocused(true);
            },
            onBlur: (e: FocusEvent) => {
               child.props.onBlur?.(e);
               setFocused(false);
            },
            "aria-describedby": open ? id : undefined,
         })}
         {open && (
            <span
               role="tooltip"
               id={id}
               data-placement={placement}
               className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white ${
                  placement === "top" ? "bottom-full mb-1" : "top-full mt-1"
               }`}
            >
               {content}
            </span>
         )}
      </span>
   );
}
