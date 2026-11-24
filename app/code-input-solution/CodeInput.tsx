"use client";

import { useRef, useState, type ClipboardEvent, type ChangeEvent, type KeyboardEvent } from "react";

type Props = {
   length?: number;
   onComplete?: (code: string) => void;
};

export function CodeInput({ length = 4, onComplete }: Props) {
   const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
   const refs = useRef<(HTMLInputElement | null)[]>([]);

   function focusBox(index: number) {
      refs.current[Math.max(0, Math.min(index, length - 1))]?.focus();
   }

   // One place to commit a change, so onComplete fires from events and never from render.
   function commit(next: string[]) {
      const code = next.join("");
      const wasCode = digits.join("");
      setDigits(next);
      if (code.length === length && code !== wasCode) onComplete?.(code);
   }

   function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      if (value === "") {
         const next = [...digits];
         next[index] = "";
         commit(next);
         return;
      }
      // A box that already has a digit receives "19" when typing 9: keep the newest character.
      const typed = value.slice(-1);
      if (!/\d/.test(typed)) return;
      const next = [...digits];
      next[index] = typed;
      commit(next);
      if (index < length - 1) focusBox(index + 1);
   }

   function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Backspace") {
         e.preventDefault();
         const next = [...digits];
         if (digits[index]) {
            next[index] = "";
            commit(next);
         } else if (index > 0) {
            next[index - 1] = "";
            commit(next);
            focusBox(index - 1);
         }
      } else if (e.key === "ArrowLeft") {
         e.preventDefault();
         focusBox(index - 1);
      } else if (e.key === "ArrowRight") {
         e.preventDefault();
         focusBox(index + 1);
      }
   }

   function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
      commit(next);
      focusBox(pasted.length);
   }

   return (
      <div className="flex gap-2">
         {digits.map((digit, index) => (
            <input
               key={index}
               ref={(el) => {
                  refs.current[index] = el;
               }}
               aria-label={`Digit ${index + 1}`}
               value={digit}
               inputMode="numeric"
               autoComplete="one-time-code"
               onChange={(e) => handleChange(index, e)}
               onKeyDown={(e) => handleKeyDown(index, e)}
               onPaste={handlePaste}
               onFocus={(e) => e.target.select()}
               className="h-12 w-10 rounded border text-center text-lg"
            />
         ))}
      </div>
   );
}
